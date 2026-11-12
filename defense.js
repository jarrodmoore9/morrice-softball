/*
  MORRICE DEFENSE LAB — visual coach's teaching model, not a rules engine.
  Team conventions: sure out > hero out; 1B holds R1 pre-pitch;
  corners read and crash bunts, middle rotates; SS runs infield,
  CF runs outfield; called cutoff & backup on every outfield throw.
  Read README before treating a scenario as an installed team coverage.
*/
(() => {
  'use strict';
  const NS='http://www.w3.org/2000/svg';
  const home={x:500,y:735}, first={x:685,y:550}, second={x:500,y:365}, third={x:315,y:550};
  const base={HOME:home,'1B':first,'2B':second,'3B':third};
  const start={C:{x:500,y:773},P:{x:500,y:560},'1B':{x:663,y:535},'2B':{x:602,y:440},SS:{x:399,y:440},'3B':{x:337,y:535},LF:{x:258,y:288},CF:{x:500,y:205},RF:{x:742,y:288}};
  const order=['P','C','1B','2B','SS','3B','LF','CF','RF'];
  const spotPresets={
    '3B line':{x:302,y:533},'SS hole':{x:416,y:465},'Up the middle':{x:500,y:463},'2B hole':{x:589,y:465},'1B line':{x:697,y:532},
    'Bunt: third-base side':{x:418,y:650},'Bunt: middle':{x:504,y:661},'Bunt: first-base side':{x:590,y:651},
    'Left field':{x:284,y:280},'Left-center gap':{x:405,y:256},'Center field':{x:500,y:206},'Right-center gap':{x:595,y:256},'Right field':{x:718,y:280}
  };
  const clone=(p)=>({x:p.x,y:p.y});
  const origin=(p)=>p==='1B' && state.runners.has('1B')?clone(first):clone(start[p]);
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const state={runners:new Set(),outs:0,contact:'ground',spot:'SS hole',ball:clone(spotPresets['SS hole']),fielder:'AUTO',throwTo:'AUTO',speed:1,plan:null,playing:false,animation:null};
  const el=(id)=>document.getElementById(id);
  const svgEl=(tag,attr={})=>{const n=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attr))n.setAttribute(k,String(v));return n;};
  const pstr=(p)=>`${Math.round(p.x)},${Math.round(p.y)}`;
  const len=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  const moveToward=(a,b,portion)=>({x:a.x+(b.x-a.x)*portion,y:a.y+(b.y-a.y)*portion});
  const esc=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function makeZone(point){
    const x=point.x,y=point.y;
    if(state.contact==='bunt')return x<449?'bunt-left':x>554?'bunt-right':'bunt-center';
    if(y<395) return x<370?'of-left':x<465?'of-left-gap':x<535?'of-center':x<630?'of-right-gap':'of-right';
    return x<370?'if-third':x<464?'if-short':x<545?'if-middle':x<648?'if-second':'if-first';
  }
  function fielderFor(zone,ball){
    if(state.fielder!=='AUTO')return state.fielder;
    if(zone.startsWith('of'))return zone==='of-left'?'LF':zone==='of-right'?'RF':'CF';
    if(zone==='bunt-left')return '3B';
    if(zone==='bunt-right')return '1B';
    if(zone==='bunt-center')return ball.y>705?'C':'P';
    return ({'if-third':'3B','if-short':'SS','if-middle':'P','if-second':'2B','if-first':'1B'})[zone]||'P';
  }
  function forcedBases(){const r=state.runners;const o=[];if(r.has('1B'))o.push('2B');if(r.has('1B')&&r.has('2B'))o.push('3B');if(r.has('1B')&&r.has('2B')&&r.has('3B'))o.push('HOME');return o;}
  function decision(fielder,isOutfield){
    const r=state.runners, outs=state.outs;
    if(state.contact==='fly')return ['HOLD','Catch first. On a tag-up or missed catch, re-evaluate; choose HOME/3B to practice a specific throw.'];
    if(state.contact==='bunt')return ['1B','Bunt: secure a clean routine out unless a called, early force or squeeze play is clearly there.'];
    if(isOutfield){
      if(r.has('3B'))return ['HOME','Runner on third may score; model the home throw, then judge whether there is a realistic play.'];
      if(r.has('2B'))return ['2B','Runner on second: secure the ball and hit the cutoff. Choose HOME if the runner is trying to score and the play is realistic.'];
      if(r.has('1B'))return ['2B','Runner on first: prevent the extra base; call 3B when a real play is available.'];
      return ['2B','No runners: get the ball in through the cutoff; prevent an avoidable extra base.'];
    }
    if(outs<2 && r.has('1B') && r.has('2B') && fielder==='3B')return ['3B','Force at third exists because both first and second are occupied. Take it only when the play is clean.'];
    if(outs<2 && r.has('1B') && (fielder==='SS'||fielder==='2B'||fielder==='P'))return ['2B','Routine force at second is available. If the lead throw is not sure, take first instead.'];
    if(r.has('3B'))return ['1B','Protect the easy out at first. HOME is a coach-called alternative only when the runner breaks and the play is available.'];
    return ['1B',outs===2?'Two outs: get the sure force at first.':'Make the routine play elite. Take the easy out at first.'];
  }
  function buildPlan(){
    const ball=clone(state.ball),zone=makeZone(ball),isOutfield=zone.startsWith('of')||['LF','CF','RF'].includes(state.fielder);
    const fielder=fielderFor(zone,ball);
    const [suggested,reason]=decision(fielder,isOutfield);
    const target=state.throwTo==='AUTO'?suggested:state.throwTo;
    const positions=Object.fromEntries(order.map(p=>[p,clone(start[p])]));
    const assignment={};order.forEach(p=>assignment[p]='Ready position: read the ball and react.');
    let cutoff=null,receiver=target;
    positions[fielder]=clone(ball);
    assignment[fielder]=isOutfield?'PRIMARY: field the ball. Get behind it, secure it, and find the called cutoff.':'PRIMARY: field cleanly. Transfer, set feet, and take the sure out.';
    if(isOutfield){
      const leftSide=['LF'].includes(fielder) || (fielder==='CF'&&ball.x<490);
      if(fielder==='LF'){
        positions.CF={x:clamp(ball.x+78,280,650),y:clamp(ball.y-48,125,375)};
        positions.RF={x:650,y:310};
        assignment.CF='BACKUP: close behind LF and protect the gap.';
        assignment.RF='SUPPORT: move toward right-center; stay available for an overthrow.';
      }else if(fielder==='RF'){
        positions.CF={x:clamp(ball.x-78,350,720),y:clamp(ball.y-48,125,375)};
        positions.LF={x:350,y:310};
        assignment.CF='BACKUP: close behind RF and protect the gap.';
        assignment.LF='SUPPORT: move toward left-center and anticipate the next throw.';
      }else{
        positions.LF={x:clamp(ball.x-88,235,470),y:clamp(ball.y+25,190,375)};
        positions.RF={x:clamp(ball.x+88,530,765),y:clamp(ball.y+25,190,375)};
        assignment.LF='SUPPORT: close the left-center gap and back up CF.';
        assignment.RF='SUPPORT: close the right-center gap and back up CF.';
      }
      positions.P={x:500,y:802};assignment.P='BACKUP: get behind home on an outfield throw; adjust to the actual target.';
      positions.C={x:500,y:737};assignment.C='DIRECT: call the target and line up the throw; receive at home if needed.';
      positions['1B']=clone(first);assignment['1B']='COVER: stay available at first unless assigned the right-side home cutoff.';
      positions['3B']=clone(third);assignment['3B']='COVER: stay available at third unless assigned the left-side home cutoff.';
      if(target==='HOME'){
        cutoff=leftSide?'3B':'1B';
        positions[cutoff]=moveToward(ball,home,0.55);
        assignment[cutoff]='CUTOFF HOME: get directly between the ball and plate, hands up, listen for call.';
        if(cutoff==='3B'){positions.SS=clone(third);assignment.SS='COVER THIRD: replace 3B when 3B cuts the throw home.';positions['2B']=clone(second);assignment['2B']='COVER SECOND: protect the trailing runner.';}
        else {positions['2B']=clone(first);assignment['2B']='COVER FIRST: replace 1B when 1B cuts the throw home.';positions.SS=clone(second);assignment.SS='COVER SECOND: protect the trailing runner.';}
      }else if(target==='2B'){
        cutoff=leftSide?'SS':'2B';
        positions[cutoff]=moveToward(ball,second,0.58);assignment[cutoff]='CUTOFF TO SECOND: line up the throw, present a target, relay only if called.';
        const cover=cutoff==='SS'?'2B':'SS';positions[cover]=clone(second);assignment[cover]='COVER SECOND: own the bag and receive if throw comes through.';
      }else if(target==='3B'){
        cutoff=leftSide?'SS':'2B';
        positions[cutoff]=moveToward(ball,third,0.57);assignment[cutoff]='CUTOFF TO THIRD: line up with LF/RF/CF and the third-base target.';
        positions['3B']=clone(third);assignment['3B']='RECEIVE: cover third and prepare the tag.';
        if(cutoff==='SS'){positions['2B']=clone(second);assignment['2B']='COVER SECOND: hold the trailing runner.';}
        else{positions.SS=clone(second);assignment.SS='COVER SECOND: hold the trailing runner.';}
      }else if(target==='1B'){
        cutoff=leftSide?'SS':'2B';positions[cutoff]=moveToward(ball,first,0.6);assignment[cutoff]='CUTOFF: line up the outfield throw toward first.';
      }else{
        positions.SS={x:430,y:440};positions['2B']={x:570,y:440};
        assignment.SS='HOLD: read the runner and be ready for a secondary play.';
        assignment['2B']='HOLD: read the runner and be ready for a secondary play.';
      }
    }else if(state.contact==='bunt'){
      // Morrice base coverage is a called scheme. These are starting teaching lanes.
      positions.P= fielder==='P'?clone(ball):{x:508,y:628};
      positions.C= fielder==='C'?clone(ball):{x:500,y:737};
      positions['3B']=fielder==='3B'?clone(ball):{x:414,y:627};
      positions['1B']=fielder==='1B'?clone(ball):{x:592,y:625};
      if(fielder==='P')assignment.P='PRIMARY: charge the middle bunt; field and throw to the sure out.';
      else assignment.P='SUPPORT: attack the middle; cover the vacated line if called.';
      if(fielder!=='C')assignment.C=state.runners.has('3B')?'PROTECT HOME: receive a squeeze play if it develops.':'DIRECT: call the play early; back up first when safe.';
      if(fielder!=='3B')assignment['3B']=state.runners.has('2B')?'READ: protect third if needed; if crashing, SS must replace.':'CHARGE: attack the third-base side when the bunt is down.';
      if(fielder!=='1B')assignment['1B']='CHARGE: attack first-base-side bunts after the pitch.';
      positions['2B']=clone(first);assignment['2B']='COVER FIRST: sprint to the bag when the corner crashes.';
      if(state.runners.has('2B')){positions.SS=clone(third);assignment.SS='COVER THIRD: replace charging 3B when a runner threatens third.';}
      else{positions.SS=clone(second);assignment.SS='COVER SECOND: own second while 2B covers first.';}
      positions.LF={x:234,y:560};positions.CF={x:500,y:280};positions.RF={x:795,y:560};
      assignment.LF='BACKUP: run behind third for a possible overthrow.';
      assignment.CF='BACKUP: watch second and read the next throw.';
      assignment.RF='BACKUP: run behind first for a possible overthrow.';
      if(fielder==='C'&&state.runners.has('3B')){positions.P=clone(home);assignment.P='COVER HOME: replace the catcher who fields the bunt.';}
      if(target==='1B')receiver='1B';
      if(target==='2B')receiver='SS';
      if(target==='3B')receiver='SS';
    }else{
      // General infield movement after an ordinary grounder/pop-up.
      if(target==='1B'){positions['1B']=clone(first);if(fielder!=='1B')assignment['1B']='RECEIVE: give a big target at first and finish the sure out.';
        else{positions.P={x:665,y:560};assignment.P='BACKUP/REPLACE: assist near first if the first baseman fields the ball.';}}
      if(target==='2B'){
        let cover=['SS','P','3B'].includes(fielder)?'2B':'SS';
        positions[cover]=clone(second);assignment[cover]='COVER SECOND: own the force bag, receive cleanly.';
      }
      if(target==='3B'){
        const cover=fielder==='3B'?'SS':'3B';positions[cover]=clone(third);assignment[cover]='COVER THIRD: receive the force or tag as called.';
      }
      if(target==='HOME'){
        positions.C=clone(home);if(fielder!=='C')assignment.C='RECEIVE HOME: prepare for a tag or force depending on runners.';
      }
      if(fielder!=='C')positions.C=clone(home);
      positions.LF={x:250,y:400};positions.CF={x:500,y:295};positions.RF={x:755,y:405};
      assignment.LF='BACKUP THIRD: move behind the base when a throw might go there.';
      assignment.CF='BACKUP SECOND: watch the middle and anticipate an overthrow.';
      assignment.RF='BACKUP FIRST: line up beyond first for a bad throw.';
      if(fielder==='P'&&target==='1B')assignment.P='PRIMARY: secure the comebacker, then make the sure throw to first.';
      if(fielder==='1B'&&target==='1B')assignment.P='SUPPORT: cover first on a ball fielded by 1B if the play requires it.';
    }
    // Never let a replacement assignment supersede the primary fielder.
    assignment[fielder]=isOutfield?'PRIMARY: field first, keep it in front, then hit the called cutoff.':state.contact==='bunt'?'PRIMARY: charge this bunt, field under control, and take the sure out.':'PRIMARY: field the ball cleanly before making the called throw.';
    const force=forcedBases();
    const note=state.contact==='bunt'?'Bunt coverage is a pre-pitch team call. Verify who covers third if SS is assigned second; adjust for 1st-and-3rd and squeeze.':isOutfield?'Throw target and cutoff depend on ball depth, runners, speed, and coach calls. A runner on base alone never makes an outfield throw automatic.':'A force at third exists only with runners on BOTH first and second. A runner on first alone does not force third.';
    return {ball,zone,fielder,isOutfield,target,cutoff,positions,assignment,reason,note,forced:force};
  }

  function makeField(){
    // SOFTBALL GEOMETRY: one continuous skinned infield, not a baseball grass diamond.
    // The white foul lines pass through home → 3B → left-field pole and home → 1B → right-field pole.
    // Keep the fixed 1000×850 coordinate system so the existing movement and hit locations still match.
    const field=`<svg viewBox="0 0 1000 850" id="defenseField" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Interactive fastpitch softball field with a full dirt infield, grass outfield, and foul lines extending through first and third base. Tap fair territory to place a batted ball.">
      <defs>
        <pattern id="stripe" width="94" height="94" patternUnits="userSpaceOnUse" patternTransform="rotate(37)"><rect width="94" height="94" fill="#214831"/><rect width="47" height="94" fill="#1b402d"/></pattern>
        <pattern id="dirtGrain" width="48" height="48" patternUnits="userSpaceOnUse"><circle cx="5" cy="11" r="1.3" fill="#f1d3a3" opacity=".17"/><circle cx="30" cy="37" r="1.5" fill="#71482d" opacity=".20"/><circle cx="39" cy="12" r="1" fill="#ecd0a9" opacity=".20"/><circle cx="15" cy="29" r=".9" fill="#623b29" opacity=".13"/></pattern>
        <linearGradient id="infieldDirt" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#bd8861"/><stop offset=".52" stop-color="#b07950"/><stop offset="1" stop-color="#97613f"/></linearGradient>
        <linearGradient id="fieldVignette" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#000000" stop-opacity=".05"/><stop offset="1" stop-color="#000000" stop-opacity=".18"/></linearGradient>
        <clipPath id="softballFairClip"><path d="M 500 735 L 88 323 C 131 165 259 76 500 71 C 741 76 869 165 912 323 Z"/></clipPath>
        <marker id="orangeArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M 0 0 L 6 3 L 0 6 z" fill="#f26726"/></marker>
        <marker id="whiteArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M 0 0 L 6 3 L 0 6 z" fill="#fff9e9"/></marker>
      </defs>
      <rect width="1000" height="850" fill="#111b17"/>
      <!-- The entire playable wedge is grass first, then a large skinned softball infield. -->
      <g clip-path="url(#softballFairClip)">
        <path d="M 500 735 L 88 323 C 131 165 259 76 500 71 C 741 76 869 165 912 323 Z" fill="url(#stripe)"/>
        <path d="M 500 735 L 158 393 Q 500 140 842 393 Z" fill="url(#infieldDirt)"/>
        <path d="M 500 735 L 158 393 Q 500 140 842 393 Z" fill="url(#dirtGrain)" opacity=".85"/>
        <path d="M 158 393 Q 500 140 842 393" fill="none" stroke="#c6a078" stroke-width="4" opacity=".8"/>
        <path d="M 500 735 L 88 323 C 131 165 259 76 500 71 C 741 76 869 165 912 323 Z" fill="url(#fieldVignette)"/>
      </g>
      <!-- Fair/foul boundaries follow the actual home–third and home–first lines. -->
      <path id="fairTerritoryOutline" d="M 500 735 L 88 323 C 131 165 259 76 500 71 C 741 76 869 165 912 323 Z" fill="none" stroke="#708b71" stroke-width="3"/>
      <path d="M 500 735 L 88 323 M 500 735 L 912 323" fill="none" stroke="#ffffff" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
      <!-- Foul poles and a soft, subtle fence: visible without fighting player routes. -->
      <path d="M 88 323 C 131 165 259 76 500 71 C 741 76 869 165 912 323" fill="none" stroke="#d1dfd1" stroke-width="5" opacity=".78"/>
      <path d="M 88 323 L 88 295 M 912 323 L 912 295" fill="none" stroke="#ff812e" stroke-width="6" stroke-linecap="round"/>
      <!-- The dirt is continuous: no baseball-style grass square, no chalk lines across second base. -->
      <circle cx="500" cy="560" r="35" fill="none" stroke="#eed2ae" stroke-width="2.6" stroke-dasharray="7 7" opacity=".92"/>
      <rect x="487" y="546" width="26" height="6" rx="1" fill="#f8f0dd" opacity=".92"/>
      <g fill="#ffffff" stroke="#765c47" stroke-width="2.8">
        <rect class="field-base" x="676" y="541" width="18" height="18" transform="rotate(45 685 550)"/>
        <rect class="field-base" x="491" y="356" width="18" height="18" transform="rotate(45 500 365)"/>
        <rect class="field-base" x="306" y="541" width="18" height="18" transform="rotate(45 315 550)"/>
        <path d="M 487 729 L 513 729 L 510 742 L 500 749 L 490 742 Z"/>
      </g>
      <g id="runnerLayer"></g><g id="movementLayer"></g><g id="throwLayer"></g><g id="playerLayer"></g><g id="ballLayer"></g>
      <text x="500" y="29" text-anchor="middle" font-family="Barlow Condensed, sans-serif" font-weight="800" font-size="21" letter-spacing="6" fill="#f4f5ec" opacity=".53">MORRICE DEFENSIVE SYSTEM</text>
      <text x="500" y="835" text-anchor="middle" font-family="Barlow Condensed, sans-serif" font-weight="800" font-size="14" letter-spacing="3" fill="#f4f5ec" opacity=".52">TAP FAIR TERRITORY TO PLACE THE BALL</text>
    </svg>`;
    return field;
  }
  function render(){
    const options=Object.keys(spotPresets).map(x=>`<option value="${x}" ${x===state.spot?'selected':''}>${x}</option>`).join('');
    return `<div class="lab-page"><div class="lab-top"><div class="eyebrow kicker-line">THE TOOLBOX / INTERACTIVE TRAINING</div><h1 class="section-heading">DEFENSE <em>LAB.</em></h1><p class="lede">Set the game situation. Choose the type of contact. Tap the diamond. Then play the animation to see fielders move, the cutoff get into line, and the ball travel toward its target.</p></div><div class="lab-shell"><div class="lab-board"><div class="lab-board-header"><strong>THE DIAMOND / READ. REACT. EXECUTE.</strong><small id="fieldSceneLabel">SCENE 01 / LOADING</small></div><div class="field-frame"><div class="field-hint">TAP A LOCATION OR USE THE PRESETS →</div>${makeField()}</div><div class="field-legend"><span><i class="movement-sample"></i> Player movement</span><span><i class="throw-sample"></i> Throw/cutoff route</span><span><span style="color:var(--orange);font-size:19px">●</span> Primary fielder</span><span><span style="color:#e9b05a;font-size:18px">◌</span> Cutoff</span></div><div class="lab-actions"><button type="button" class="btn btn-primary" id="playBtn">▶ PLAY THE DEFENSE</button><button type="button" class="btn btn-secondary" id="resetBtn">↺ RESET FIELD</button><button type="button" class="btn btn-secondary" id="quizBtn">? QUIZ ME</button><button type="button" class="btn btn-secondary" id="fullscreenBtn">⛶ EXPAND FIELD</button></div><div class="quiz-panel" id="quizPanel" hidden><div class="eyebrow">YOUR REP / TEST YOUR IQ</div><h3 id="quizQuestion"></h3><button class="btn btn-primary" type="button" id="revealAnswer">REVEAL THE COACH'S READ</button><p id="quizAnswer" aria-live="polite"></p></div></div>
    <aside class="lab-sidebar"><section class="control-card"><h2 class="card-title">01 / THE SITUATION</h2><span class="control-label">Runners on base</span><div class="runner-options" id="runnerButtons"><button class="toggle-square" type="button" data-runner="1B">1ST<small>EMPTY</small></button><button class="toggle-square" type="button" data-runner="2B">2ND<small>EMPTY</small></button><button class="toggle-square" type="button" data-runner="3B">3RD<small>EMPTY</small></button></div><span class="control-label">Outs</span><div class="outs-options" id="outsButtons"><button type="button" data-outs="0" class="toggle-square active">0</button><button type="button" data-outs="1" class="toggle-square">1</button><button type="button" data-outs="2" class="toggle-square">2</button></div><div class="row-two"><div><label class="control-label" for="contactType">Contact</label><select id="contactType"><option value="ground">Ground ball</option><option value="line">Line drive / hit</option><option value="fly">Fly ball / caught</option><option value="bunt">Bunt</option></select></div><div><label class="control-label" for="ballSpot">Ball location</label><select id="ballSpot">${options}<option value="custom">Custom / field tap</option></select></div></div><label class="control-label" for="fielderSelect">Who fields it? (optional)</label><select id="fielderSelect"><option value="AUTO">Auto-detect from location</option>${order.map(p=>`<option value="${p}">${p}</option>`).join('')}</select><label class="control-label" for="throwSelect">Throw target / coach override</label><select id="throwSelect"><option value="AUTO">Coach recommendation</option><option value="1B">First base</option><option value="2B">Second base</option><option value="3B">Third base</option><option value="HOME">Home plate</option><option value="HOLD">Hold / no throw</option></select><p class="mini-help">Use the override when a runner's speed, ball depth, or called play changes the decision.</p></section>
    <section class="readout-card"><div class="eyebrow">THE TEACHING READ</div><h2 class="card-title" style="margin-top:8px">02 / WHAT HAPPENS</h2><div id="playSummary"></div><div id="playAssignments" class="assignment-list"></div><p class="lab-warning" id="planCaveat"></p></section><section class="callout"><strong>CORE STANDARD:</strong> Ball first always. Sure out &gt; hero out. Don't make a throw when there is no play—EAT IT. The coach owns the final defensive call.</section></aside></div>
    <section class="section panel-light"><div class="max-layout"><div class="eyebrow kicker-line">WHY WE BUILT THIS</div><h2 class="section-heading">SEE IT.<br/><em>THEN OWN IT.</em></h2><div class="lab-help-grid"><div class="feature"><span class="num">01 / READ</span><h3>KNOW THE SITUATION.</h3><p>Before the pitch: outs, baserunners, likely ball, and your first responsibility.</p></div><div class="feature"><span class="num">02 / REACT</span><h3>MOVE WITH PURPOSE.</h3><p>Only one player fields it. Everyone else covers, cuts, or backs up.</p></div><div class="feature"><span class="num">03 / EXECUTE</span><h3>TAKE THE SURE OUT.</h3><p>Hit the target, keep the ball in front, and prevent the big inning.</p></div></div><p style="margin-top:25px;font-size:13px;color:#777">This is an instructional simulation of a Morrice baseline defense, not a live umpiring/rules engine or proof that every route is optimal. Defensive choices change with the batted ball, timing, hitter, arm strength, baserunner speed, and team calls.</p></div></section></div>`;
  }

  function drawRunners(){const layer=el('runnerLayer');if(!layer)return;layer.replaceChildren();for(const name of ['1B','2B','3B']){if(!state.runners.has(name))continue;const p=base[name];const r=svgEl('rect',{x:p.x-12,y:p.y-12,width:24,height:24,transform:`rotate(45 ${p.x} ${p.y})`,fill:'#f26726',stroke:'#171717','stroke-width':3});r.setAttribute('aria-label','Runner on '+name);layer.append(r);}}
  function prepPlayers(){const layer=el('playerLayer');if(!layer)return;layer.replaceChildren();order.forEach(p=>{const pos=origin(p);const g=svgEl('g',{class:'fielder'+(state.plan.fielder===p?' is-primary':'')+(state.plan.cutoff===p?' is-cutoff':''),'data-fielder':p});g.setAttribute('tabindex','0');g.setAttribute('role','button');g.setAttribute('aria-label',`${p}: ${state.plan.assignment[p]}`);g.append(svgEl('circle',{cx:0,cy:0,r:24}));const text=svgEl('text',{x:0,y:1});text.textContent=p;g.append(text);g.setAttribute('transform',`translate(${pos.x} ${pos.y})`);const show=()=>highlightAssignment(p);g.addEventListener('click',(e)=>{e.stopPropagation();show()});g.addEventListener('keydown',(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show()}});layer.append(g);});}
  function highlightAssignment(p){const list=el('playAssignments');if(!list)return;list.querySelectorAll('[data-assignment]').forEach(n=>n.style.background=n.getAttribute('data-assignment')===p?'#393f37':'');const row=list.querySelector(`[data-assignment="${p}"]`);row?.scrollIntoView({block:'nearest',behavior:'smooth'});}
  function drawPlanLines(plan,after=false){const ml=el('movementLayer'),tl=el('throwLayer');if(!ml||!tl)return;ml.replaceChildren();tl.replaceChildren();for(const p of order){const a=origin(p),b=plan.positions[p];if(len(a,b)<27)continue;const path=svgEl('line',{x1:a.x,y1:a.y,x2:b.x,y2:b.y,class:'move-path','marker-end':'url(#orangeArrow)',opacity:after?.94:.48});ml.append(path);}if(plan.target!=='HOLD'){
      const from=plan.positions[plan.fielder];const pts=[from];if(plan.cutoff&&plan.cutoff!==plan.fielder)pts.push(plan.positions[plan.cutoff]);pts.push(base[plan.target]);const poly=svgEl('polyline',{points:pts.map(pstr).join(' '),class:'throw-path','marker-end':'url(#whiteArrow)',opacity:after?.92:.4});tl.append(poly);
    }}
  function drawBall(){const layer=el('ballLayer');if(!layer)return;layer.replaceChildren();const p=state.ball;layer.append(svgEl('circle',{cx:p.x,cy:p.y,r:19,class:'hit-glow'}));layer.append(svgEl('circle',{cx:p.x,cy:p.y,r:8,class:'hit-indicator'}));layer.append(svgEl('text',{x:clamp(p.x+15,10,835),y:clamp(p.y-20,35,770),'font-size':15,'font-family':'DM Sans, sans-serif','font-weight':800,fill:'#fff','paint-order':'stroke',stroke:'#152219','stroke-width':4}));layer.lastChild.textContent='BALL';}
  function updateControls(){document.querySelectorAll('[data-runner]').forEach(b=>{const active=state.runners.has(b.getAttribute('data-runner'));b.classList.toggle('active',active);b.querySelector('small').textContent=active?'ON':'EMPTY';b.setAttribute('aria-pressed',String(active));});document.querySelectorAll('[data-outs]').forEach(b=>b.classList.toggle('active',+b.getAttribute('data-outs')===state.outs));}
  function updateReadout(plan){const summary=el('playSummary');if(!summary)return;const loc=state.spot==='custom'?'CUSTOM LOCATION':state.spot.toUpperCase();summary.innerHTML=`<h4>${plan.fielder} FIELDS • ${plan.target==='HOLD'?'HOLD':('THROW TO '+plan.target)}</h4><p>${esc(loc)} · ${esc(state.contact.toUpperCase())} · ${state.outs} OUT${state.outs===1?'':'S'}</p><p><strong>WHY:</strong> ${esc(plan.reason)}</p>${plan.cutoff?`<p><strong>CUTOFF:</strong> ${plan.cutoff} aligns with the intended ${plan.target} target.</p>`:''}<p><strong>FORCES ON THE BASEPATH:</strong> ${plan.forced.length?plan.forced.join(', '):'None beyond the batter at first'}.</p>`;
    el('playAssignments').innerHTML=order.map(p=>`<div class="assignment ${p===plan.fielder?'primary':''}" data-assignment="${p}"><span class="position-tag">${p}</span><span>${esc(plan.assignment[p])}</span></div>`).join('');el('planCaveat').textContent=plan.note;el('fieldSceneLabel').textContent=`${plan.zone.toUpperCase().replaceAll('-',' ')} / ${plan.fielder} → ${plan.target}`;
  }
  function stopAnimation(){if(state.animation){cancelAnimationFrame(state.animation);state.animation=null;}state.playing=false;}
  function refresh(){stopAnimation();state.plan=buildPlan();updateControls();drawRunners();prepPlayers();drawPlanLines(state.plan,false);drawBall();updateReadout(state.plan);if(el('playBtn')){el('playBtn').textContent='▶ PLAY THE DEFENSE';el('playBtn').disabled=false;}}
  function animatePlay(){stopAnimation();const plan=state.plan;if(!plan)return;state.playing=true;drawPlanLines(plan,true);const duration=2100/state.speed;const players=[...el('playerLayer').querySelectorAll('[data-fielder]')];
    const ballLayer=el('ballLayer');const travel=svgEl('circle',{cx:plan.ball.x,cy:plan.ball.y,r:8,fill:'#fef4e5',stroke:'#f26726','stroke-width':4});if(plan.target!=='HOLD')ballLayer.append(travel);
    let throwPts=[];if(plan.target!=='HOLD'){throwPts=[plan.positions[plan.fielder]];if(plan.cutoff&&plan.cutoff!==plan.fielder)throwPts.push(plan.positions[plan.cutoff]);throwPts.push(base[plan.target]);}
    const runStart=performance.now();function frame(t){const time=clamp((t-runStart)/duration,0,1);const step=1-Math.pow(1-clamp(time*1.55,0,1),3);
      players.forEach(g=>{const p=g.getAttribute('data-fielder'),a=origin(p),b=plan.positions[p];g.setAttribute('transform',`translate(${(a.x+(b.x-a.x)*step).toFixed(2)} ${(a.y+(b.y-a.y)*step).toFixed(2)})`)});
      if(throwPts.length>=2){if(time<.55)travel.setAttribute('opacity','0');else{travel.setAttribute('opacity','1');const v=clamp((time-.55)/.45,0,1);const segments=throwPts.slice(1).map((p,i)=>len(throwPts[i],p));const total=segments.reduce((a,b)=>a+b,0);let dist=v*total;let point=throwPts[0];for(let i=0;i<segments.length;i++){if(dist<=segments[i]||i===segments.length-1){point=moveToward(throwPts[i],throwPts[i+1],clamp(dist/segments[i],0,1));break;}dist-=segments[i];}travel.setAttribute('cx',point.x);travel.setAttribute('cy',point.y);}}
      if(time<1){state.animation=requestAnimationFrame(frame)}else{state.playing=false;state.animation=null;el('playBtn').textContent='↻ REPLAY THE DEFENSE';}}
    state.animation=requestAnimationFrame(frame);
  }
  function mount(){
    const field=el('defenseField');if(!field)return;el('contactType').value=state.contact;el('ballSpot').value=state.spot;el('fielderSelect').value=state.fielder;el('throwSelect').value=state.throwTo;
    document.querySelectorAll('[data-runner]').forEach(b=>b.addEventListener('click',()=>{const p=b.getAttribute('data-runner');state.runners.has(p)?state.runners.delete(p):state.runners.add(p);refresh()}));
    document.querySelectorAll('[data-outs]').forEach(b=>b.addEventListener('click',()=>{state.outs=+b.getAttribute('data-outs');refresh()}));
    el('contactType').addEventListener('change',e=>{state.contact=e.target.value;if(state.contact==='bunt'&&!state.spot.startsWith('Bunt:')){state.spot='Bunt: middle';state.ball=clone(spotPresets[state.spot]);el('ballSpot').value=state.spot}refresh()});
    el('ballSpot').addEventListener('change',e=>{state.spot=e.target.value;if(spotPresets[state.spot])state.ball=clone(spotPresets[state.spot]);refresh()});
    el('fielderSelect').addEventListener('change',e=>{state.fielder=e.target.value;refresh()});el('throwSelect').addEventListener('change',e=>{state.throwTo=e.target.value;refresh()});
    field.addEventListener('click',e=>{if(e.target.closest?.('.fielder'))return;const pt=field.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const local=pt.matrixTransform(field.getScreenCTM().inverse());if(local.x<88||local.x>912||local.y<80||local.y>750)return;
      // Ignore taps outside the two chalk foul lines (i.e. in foul territory).
      if(local.y>=323 && Math.abs(local.x-500)>735-local.y+5)return;
      // The upper outfield uses a curved fence. No placement beyond its arc.
      const fairPath=el('fairTerritoryOutline');
      if(fairPath && typeof fairPath.isPointInFill==='function' && !fairPath.isPointInFill(local))return;
      state.spot='custom';state.ball={x:clamp(local.x,105,900),y:clamp(local.y,95,780)};el('ballSpot').value='custom';refresh()});
    el('playBtn').addEventListener('click',animatePlay);
    el('resetBtn').addEventListener('click',()=>{state.runners.clear();state.outs=0;state.contact='ground';state.spot='SS hole';state.ball=clone(spotPresets[state.spot]);state.fielder='AUTO';state.throwTo='AUTO';el('contactType').value=state.contact;el('ballSpot').value=state.spot;el('fielderSelect').value=state.fielder;el('throwSelect').value=state.throwTo;refresh()});
    el('quizBtn').addEventListener('click',()=>{const p=order[Math.floor(Math.random()*order.length)];const panel=el('quizPanel');panel.hidden=false;el('quizQuestion').textContent=`Where should ${p} go on this play—and why?`;el('quizAnswer').textContent='';el('revealAnswer').onclick=()=>{el('quizAnswer').textContent=`${p}: ${state.plan.assignment[p]}`;highlightAssignment(p)};panel.scrollIntoView({block:'nearest',behavior:'smooth'});});
    el('fullscreenBtn').addEventListener('click',async()=>{const frame=document.querySelector('.field-frame');try{if(document.fullscreenElement){await document.exitFullscreen()}else if(frame.requestFullscreen){await frame.requestFullscreen()}}catch(e){console.warn('Fullscreen unavailable',e)}});
    refresh();
  }
  window.MorriceDefenseLab={render,mount,stop:stopAnimation};
})();
