/*
  MORRICE PROGRAM HQ — no framework, no paid services, no external backend.
  Historical statistics: window.MORRICE_RECORDS_DB (source PDF, through 2026).
  Curated educational material: data/program-data.js.
  This module never writes identifiable athlete data to a remote service.
*/
(() => {
  'use strict';
  const db = window.MORRICE_RECORDS_DB || {records:[],seasons:[],tournament:[],summary:{}};
  const pack = window.MORRICE_PROGRAM_DATA || {situations:[],pitch:[],positions:[],factory:[],vaultMilestones:[],media:[]};
  const href = 'assets/Morrice_Softball_Records.pdf#page=';
  const esc = val => String(val ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm = v => String(v||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const el = id => document.getElementById(id);
  const pages = [
    ['chasing','CHASING HISTORY','The next name in the record book','Legacy / Records'],
    ['situation','SITUATION ROOM','Think before the ball is hit','Defense / IQ'],
    ['gameday','GAMEDAY HQ','Every opponent. Every inning.','Season / Live desk'],
    ['vault','THE VAULT','A town, a team, a history','Heritage / Archive'],
    ['pitchlab','THE PITCH LAB','Call it with a purpose','Pitching / IQ'],
    ['flock','THE FLOCK','The people behind the jersey','Culture / Media'],
    ['playbook','PLAYER PLAYBOOK','Nine positions. One standard.','Defense / Positions'],
    ['factory','ORIOLE FACTORY','Work that wins on Tuesday','Development / Training']
  ];
  let s={quiz:0,quizChoice:null,quizCount:0,quizCorrect:0,quizSeconds:null,quizTimer:null,
    chaseMetric:'Stolen Bases, Career',chaseQuery:'',vaultDecade:'All',pitch:0,pitchChoice:null,
    position:'SS',factoryDay:'A'};
  const statOptions=[
    ['Stolen Bases, Career','Career stolen bases'],['Stolen Bases, Season','Single-season stolen bases'],
    ['Batting Average, Season','Season batting average'],['Hits, Career','Career hits'],
    ['Home Runs, Career','Career home runs'],['Home Runs, Season','Season home runs'],
    ['Runs Batted In, Career','Career RBI'],['Base on Balls, Career','Career walks'],
    ['Wins, Career','Career pitching wins'],['Strikeouts, Career','Career pitching strikeouts']
  ];
  let workoutDone={};
  try { workoutDone=JSON.parse(localStorage.getItem('morrice-factory-checks-v1')||'{}')||{}; }catch(_){workoutDone={};}
  const closeTimer=()=>{if(s.quizTimer){clearInterval(s.quizTimer);s.quizTimer=null;}};
  const docLink=(page,label='SOURCE')=>`<a class="hq-source" href="${href}${Number(page)||1}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗ P.${Number(page)||1}</a>`;
  const head=(eye,title,sub)=>`<header class="hq-head"><div class="hq-container"><div class="hq-eyebrow">${esc(eye)} / MORRICE LADY ORIOLES</div><h1>${esc(title)}<span>.</span></h1><p>${esc(sub)}</p><div class="hq-head-underline"></div></div></header>`;
  const nav=(active)=>`<nav class="hq-subnav" aria-label="Program HQ pages"><a href="#hub" class="${active==='hub'?'on':''}">HQ HOME</a>${pages.map(p=>`<a href="#${p[0]}" class="${active===p[0]?'on':''}">${esc(p[1])}</a>`).join('')}</nav>`;
  const shell=(active,content)=>`<div class="hq-scope">${nav(active)}${content}</div>`;
  const button=(t,url,secondary=false)=>`<a class="hq-btn${secondary?' secondary':''}" href="${url}">${esc(t)} <span aria-hidden="true">↗</span></a>`;
  const note=t=>`<div class="hq-note">${t}</div>`;
  const logo=(path='assets/boop.webp',cls='')=>`<img src="${path}" class="${cls}" alt="Morrice Lady Orioles mark"/>`;
  const metricRecords=()=>db.records.filter(r=>r.metric===s.chaseMetric&&r.group!=='Team'&&r.name&&/^\d+(?:\.\d+)?$/.test(String(r.value).replace(/^\./,'0.')))
    .sort((a,b)=>Number(b.value)-Number(a.value));
  const leaderRows=()=>{const rows=metricRecords();const q=norm(s.chaseQuery);return q?rows.filter(r=>norm([r.name,r.metric,r.year,r.detail].join(' ')).includes(q)):rows;};
  const profile=(name)=>{const rows=db.records.filter(r=>norm(r.name)===norm(name));return {name,rows};};
  function hub(){return shell('hub',`${head('THE NEXT CHAPTER','PROGRAM HQ','Eight ways to know the game, honor the past, and build the next generation.')}
    <section class="hq-container hq-pad"><div class="hq-intro"><div><span class="hq-tag">THE ORIOLE STANDARD</span><h2>A SITE THAT <em>DOES SOMETHING.</em></h2></div><p>Not just scores and schedules. A working home for the players, alumni, coaches, and community who carry the name MORRICE.</p></div>
    <div class="hq-featuregrid">${pages.map((p,i)=>`<a class="hq-feature" href="#${p[0]}"><span class="hq-feature-number">${String(i+1).padStart(2,'0')} / 08</span><div class="hq-feature-rule"></div><div class="hq-feature-copy"><small>${esc(p[3])}</small><h3>${esc(p[1])}</h3><p>${esc(p[2])}</p></div><span class="hq-feature-arrow">↗</span></a>`).join('')}</div>
    <section class="hq-brandbar"><div>${logo('assets/pennant.webp','hq-pennant')}<div><span>ROOTS RUN DEEP.</span><strong>THE NEXT CHAPTER IS OURS.</strong></div></div>${button('EXPLORE THE RECORDS','#records',true)}</section></section>`);}
  function chase(){
    const last=db.records.find(r=>r.metric==='Stolen Bases, Career'&&r.name==='Layla Johnson');
    const current=[
      ['Layla Johnson','Stolen Bases, Career','Career stolen bases'],
      ['Belle Hoy','Base on Balls, Career','Career walks'],
      ['Kaylin Brewer','Batting Average, Season','Season batting average']
    ].map(([name,metric,label])=>({name,metric,label,r:db.records.find(r=>r.name===name&&r.metric===metric)})).filter(x=>x.r);
    const feature=current.map(x=>{
      const leaders=db.records.filter(r=>r.metric===x.metric&&/^\.?\d+(\.\d+)?$/.test(String(r.value))).sort((a,b)=>Number(b.value)-Number(a.value));
      const top=leaders[0],value=Number(x.r.value),maximum=Math.max(value,Number(top?.value||1));
      return `<article class="hq-chase-card"><span class="hq-tag">${esc(x.label)}</span><h3>${esc(x.name)}</h3><div class="hq-chase-value"><strong>${esc(x.r.value)}</strong><span>as listed in the source</span></div><div class="hq-progress"><span style="width:${Math.min(100,Math.max(3,value/maximum*100))}%"></span></div><div class="hq-record-benchmark"><span>HISTORICAL LISTED LEADER</span><b>${esc(top?.name||'—')} · ${esc(top?.value||'—')}</b></div>${docLink(x.r.page,'PLAYER RECORD')}</article>`;
    }).join('');
    return shell('chasing',`${head('RECORDS / LEGACY','CHASING HISTORY','Every number has a name. Every name has a story.')}
      <div class="hq-container hq-pad"><div class="hq-section-title"><span class="hq-tag">THROUGH THE 2026 RECORD BOOK</span><h2>THE NAMES <em>COMING UP.</em></h2><p>These comparisons use only figures printed in the supplied record book. Some older career totals are explicitly incomplete. They are not live 2027 statistics.</p></div>
      <div class="hq-three">${feature||'<p>No featured current-player figures were found in the record book.</p>'}</div>
      <section class="hq-results-section"><div class="hq-section-title"><span class="hq-tag">THE ALL-TIME BOARD</span><h2>STACK UP <em>THE NUMBERS.</em></h2></div>
      <div class="hq-filterbar"><label>STATISTIC<select id="hq-metric">${statOptions.map(([v,t])=>`<option value="${esc(v)}" ${s.chaseMetric===v?'selected':''}>${esc(t)}</option>`).join('')}</select></label><label>FIND AN ATHLETE<input type="search" id="hq-chase-search" placeholder="Search names or seasons…" value="${esc(s.chaseQuery)}" /></label></div>
      <div id="hq-chase-results">${chaseResults()}</div></section>
      ${note('Historical comparison ≠ a certified complete all-time ranking. Entries and spelling come from the source, which contains incomplete totals and possible duplicates. '+docLink(1,'VIEW RECORD BOOK'))}
      ${button('OPEN FULL RECORD DATABASE','#records')}</div>`);
  }
  function chaseResults(){const rows=leaderRows().slice(0,45);return `<div class="hq-table-scroll"><table class="hq-table"><thead><tr><th>#</th><th>ATHLETE</th><th>MARK</th><th>SEASON(S)</th><th>BOOK</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td class="hq-rank">${i+1}</td><td class="hq-athlete">${esc(r.name)}</td><td class="hq-mark">${esc(r.value)}</td><td>${esc(r.year||'—')}${r.flags?.length?' *':''}</td><td>${docLink(r.page)}</td></tr>`).join('')||'<tr><td colspan="5">No listed records match. Try a different name or statistic.</td></tr>'}</tbody></table></div><p class="hq-small">${leaderRows().length} matching source entries · displayed first ${Math.min(45,leaderRows().length)} · ${esc(s.chaseMetric)}</p>`;}
  const places={P:[410,360],C:[410,524],'1B':[548,351],'2B':[477,280],SS:[340,280],'3B':[273,351],LF:[230,170],CF:[410,105],RF:[590,170],HOME:[410,510]};
  function fieldGraphic(q,show=false,interactive=false){
    const runnerList=q.runners==='Loaded'?['1st','2nd','3rd']:q.runners==='Empty'?[]:q.runners.split(' + ');
    const rMap={'1st':[555,365],'2nd':[410,220],'3rd':[265,365]};
    const fx=places[q.fielder]||places.SS,tx=places[q.target]||null;
    return `<svg class="hq-diamond" viewBox="0 0 820 560" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Softball field diagram showing ${esc(q.fielder)} and ${esc(q.target)}">
      <defs><pattern id="hqGrass" width="58" height="58" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="58" height="58" fill="#284b32"/><rect width="29" height="58" fill="#31583b"/></pattern><clipPath id="hqFieldClip"><path d="M410 510 L55 155 Q410 -85 765 155 Z"/></clipPath><marker id="hqArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#fff4e4"/></marker></defs>
      <rect width="820" height="560" fill="#111b15"/>
      <g clip-path="url(#hqFieldClip)"><path d="M410 510 L55 155 Q410 -85 765 155 Z" fill="url(#hqGrass)"/><path d="M410 510 L136 236 Q410 28 684 236 Z" fill="#ac7956"/></g>
      <path d="M410 510 L55 155 M410 510 L765 155" fill="none" stroke="#f8f5ea" stroke-width="3"/><path d="M55 155 Q410 -85 765 155" fill="none" stroke="#a6bd9f" stroke-width="3"/>
      <path d="M410 510 L555 365 L410 220 L265 365 Z" fill="none" stroke="#f4d9b7" stroke-width="1.8"/>
      <circle cx="410" cy="360" r="17" stroke="#f4d9b7" stroke-dasharray="4 4" fill="none"/>
      ${[[555,365],[410,220],[265,365]].map(([x,y])=>`<rect x="${x-6}" y="${y-6}" width="12" height="12" transform="rotate(45 ${x} ${y})" fill="#fff"/>`).join('')}
      <path d="M399 505 L421 505 L416 520 L410 525 L404 520Z" fill="#fff"/>
      ${Object.entries(places).filter(([p])=>p!=='HOME').map(([p,xy])=>`<g><circle cx="${xy[0]}" cy="${xy[1]}" r="16" fill="${show&&p===q.fielder?'#ff812d':'#171b18'}" stroke="${show&&p===q.fielder?'#fff':'#e0e8dd'}" stroke-width="2.5"/><text x="${xy[0]}" y="${xy[1]+4.5}" text-anchor="middle" fill="${show&&p===q.fielder?'#111':'#fff'}" font-family="Arial" font-weight="bold" font-size="13">${p}</text></g>`).join('')}
      ${runnerList.map(p=>rMap[p]?`<circle cx="${rMap[p][0]+16}" cy="${rMap[p][1]-18}" r="10" fill="#ffcc79" stroke="#181818" stroke-width="3"/>`:'').join('')}
      ${show&&tx&&q.target!==q.fielder?`<line class="hq-reveal-line" x1="${fx[0]}" y1="${fx[1]}" x2="${tx[0]}" y2="${tx[1]}" stroke="#fff4e4" stroke-width="4" stroke-dasharray="12 8" marker-end="url(#hqArrow)"/>`:''}
      <rect x="15" y="13" width="${show?350:252}" height="37" rx="4" fill="#121917" opacity=".92"/><text x="28" y="37" fill="#f8eee3" font-family="Arial" font-weight="bold" font-size="14">${show?esc(q.fielder+' → '+q.target+' / COACH READ'):'MORRICE / FIELD READ'}</text>
      <text x="410" y="551" fill="#f6d9be" font-family="Arial" font-size="13" letter-spacing="2" text-anchor="middle">FASTPITCH DEFENSE / NOT TO SCALE</text>
    </svg>`;
  }
  function situation(){const q=pack.situations[s.quiz]||pack.situations[0];if(!q)return shell('situation',note('Coaching situations are not loaded.'));
    const complete=s.quizChoice!==null,correct=complete&&s.quizChoice===q.answer;
    return shell('situation',`${head('THE TOOLBOX / DEFENSIVE INTELLIGENCE','SITUATION ROOM','The game is faster when you already know the answer.')}
    <section class="hq-container hq-pad"><div class="hq-situation-header"><div><span class="hq-tag">REP ${String(s.quiz+1).padStart(2,'0')} / ${pack.situations.length} · ${esc(q.category)}</span><h2>${esc(q.tag)}</h2></div><div class="hq-mini-score"><b>${s.quizCorrect} / ${s.quizCount}</b><small>CORRECT READS</small></div></div>
    <div class="hq-situation-grid"><div class="hq-board"><div class="hq-board-top"><span>SCOUT THE SITUATION</span><span>${q.outs} OUT${q.outs===1?'':'S'} · RUNNERS: ${esc(q.runners.toUpperCase())}</span></div>${fieldGraphic(q,complete)}<div class="hq-board-bottom"><span>${esc(q.type.toUpperCase())}</span><span>${esc(q.spot.toUpperCase())}</span></div></div>
    <div class="hq-answer-card"><div class="hq-tag">COACH'S CHALLENGE</div><h3>${esc(q.question)}</h3><div class="hq-choices">${q.choices.map((c,i)=>`<button type="button" data-hq-choice="${i}" class="${complete&&i===q.answer?'correct':''} ${complete&&s.quizChoice===i&&i!==q.answer?'incorrect':''}" ${complete?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${esc(c)}</button>`).join('')}</div>
      ${!complete?`<div class="hq-quiz-actions"><button type="button" class="hq-quiet-btn" id="hq-timer">START 10-SECOND CLOCK</button><span id="hq-seconds" aria-live="polite">READY</span></div>`:`<div class="hq-answer"><span class="hq-tag">${correct?'✓ CORRECT READ':'THE COACH’S READ'}</span><p>${esc(q.why)}</p><strong>${esc(q.standard)}</strong></div>`}
      <div class="hq-situation-actions"><button id="hq-next" type="button" class="hq-orange-button">${complete?'NEXT SITUATION':'SKIP / NEXT'} ↗</button><a href="#lab" class="hq-inline-link">OPEN FULL DEFENSE LAB ↗</a></div></div></div>
      ${note('A coach-selected teaching example—not a live rules engine. Real calls depend on ball depth, runner speed, arm strength, outfield alignment, and timing. Take the sure out; EAT IT when there is no play.')}
    </section>`);
  }
  function gameday(data){const games=Array.isArray(data?.games)?[...data.games]:[];
    const now=new Date();const toDate=g=>{const x=String(g.date||'');const d=new Date((x.length===10?x+'T12:00:00':x));return Number.isNaN(+d)?null:d;};
    games.sort((a,b)=>(+toDate(a)||0)-(+toDate(b)||0));
    const next=games.find(g=>{const d=toDate(g);return d&&d.getTime()>=now.getTime()-86400000&&!g.result&&g.status!=='final'});
    const recent=games.filter(g=>g.result).slice(-5).reverse();
    const dateTag=(g)=>{const d=toDate(g);return d?d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'}):'TBA';};
    const scoreboard=next?`<div class="hq-game-top"><span>NEXT UP / ${esc(data.season||'2027')}</span><span>${esc(next.level||'VARSITY')}</span></div><div class="hq-match"><div class="hq-team">${logo()}<h3>MORRICE</h3><small>LADY ORIOLES</small></div><div class="hq-vs"><span>VS</span><small>${esc(dateTag(next))}</small></div><div class="hq-team"><div class="hq-opponent-mark">${esc(String(next.opponent||'OPPONENT').slice(0,1).toUpperCase())}</div><h3>${esc(next.opponent||'TBA')}</h3><small>${next.home==='away'?'AWAY':'HOME'}</small></div></div><div class="hq-game-info"><span>${esc(next.time||'TIME TBA')}</span><span>${esc(next.location||'LOCATION TBA')}</span></div>`:`<div class="hq-game-top"><span>2027 / GAMEDAY HQ</span><span>AWAITING SCHEDULE</span></div><div class="hq-match"><div class="hq-team">${logo()}<h3>MORRICE</h3><small>LADY ORIOLES</small></div><div class="hq-vs"><span>VS</span><small>UP NEXT</small></div><div class="hq-team"><div class="hq-opponent-mark">?</div><h3>TO BE ANNOUNCED</h3><small>THE NEXT CHALLENGE</small></div></div><div class="hq-game-info"><span>DATE TBA</span><span>OPPONENT TBA</span></div>`;
    return shell('gameday',`${head('THE 2027 CAMPAIGN','GAMEDAY HQ','Every game has a story. This is where the next one begins.')}
    <section class="hq-container hq-pad"><div class="hq-game-banner">${scoreboard}<div class="hq-matchline">THIS IS OUR TOWN. <span>THIS IS OUR FIELD.</span></div></div>
      <div class="hq-two"><div class="hq-info-panel"><span class="hq-tag">PROGRAM SCOREBOARD</span><h2>LAST FIVE <em>RESULTS.</em></h2>${recent.length?recent.map(g=>`<div class="hq-recent"><strong>${esc(g.opponent)}</strong><span>${esc(dateTag(g))}</span><b>${esc(g.result)}</b></div>`).join(''):'<p>No 2027 results have been entered yet. Scores added to the Schedule will appear here automatically.</p>'}${button('FULL SCHEDULE','#schedule')}</div>
      <div class="hq-info-panel"><span class="hq-tag">THE TOWN / THE FLOCK</span><h2>FOLLOW THE <em>BIRDS.</em></h2><p>Opponent details, results, and the next matchup draw from the same public schedule file—no second spreadsheet to maintain.</p>${button('MORRICE INSTAGRAM','https://www.instagram.com/morriceoriolessoftball/',true)}${button('EDIT SCHEDULE','#manage',true)}</div></div>
      ${note('Only schedule entries you publish appear here. No scores, game locations, or opponent branding have been invented.')}</section>`);
  }
  function vault(){const all=db.seasons||[];const choices=['All',...new Set(all.map(x=>String(x.year).match(/\d{4}/)?.[0]).filter(Boolean).map(y=>String(Math.floor(+y/10)*10)+'s'))].sort().reverse();
    const rows=all.filter(x=>s.vaultDecade==='All'||String(x.year).startsWith(s.vaultDecade.slice(0,3)));
    const milestones=pack.vaultMilestones||[];
    return shell('vault',`${head('HERITAGE / DOCUMENTED HISTORY','THE VAULT','The records of a small town. The history of a big tradition.')}
    <section class="hq-container hq-pad"><div class="hq-legacy-hero"><div><span class="hq-tag">THE PROGRAM LEDGER</span><h2>BUILT BEFORE US.<br/><em>CARRIED BY US.</em></h2><p>The original 20-page record book traces Morrice softball from 1974 through 2026, with an earlier 1951/52 entry. Explore the seasons and tournament milestones without losing the original source.</p>${docLink(1,'OPEN ORIGINAL RECORD BOOK')}</div>${logo('assets/vintage-bird.webp','hq-legacy-bird')}</div>
    <div class="hq-milestones">${milestones.map(x=>`<article class="hq-milestone"><span>${esc(x.year)}</span><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p>${docLink(x.page)}</article>`).join('')}</div>
    <section class="hq-results-section"><div class="hq-section-title"><span class="hq-tag">SEASON BY SEASON</span><h2>THE LONG <em>GAME.</em></h2></div><div class="hq-filterbar"><label>DECADE<select id="hq-vault-decade">${choices.map(c=>`<option ${c===s.vaultDecade?'selected':''}>${esc(c)}</option>`).join('')}</select></label><div class="hq-filter-copy">Original season totals, coaches and leagues as printed. Blank records remain blank.</div></div>
      <div class="hq-table-scroll"><table class="hq-table"><thead><tr><th>YEAR</th><th>OVERALL</th><th>LEAGUE</th><th>COACH</th><th>CONFERENCE</th><th>BOOK</th></tr></thead><tbody>${rows.map(x=>`<tr><td class="hq-mark">${esc(x.year)}</td><td class="hq-athlete">${esc(x.overall||x.status||'—')}</td><td>${esc(x.conferenceRecord||'—')}</td><td>${esc(x.coach||'—')}</td><td>${esc(x.league||'—')}</td><td>${docLink(x.page)}</td></tr>`).join('')}</tbody></table></div></section>
      <div class="hq-footer-action">${button('EXPLORE TOURNAMENT RESULTS','#records')} ${button('CHASING HISTORY','#chasing',true)}</div>
      ${note('Historical outcomes are transcribed from the supplied book. The documented 1993 and 1995 state runner-up finishes are program milestones; this page does not treat all tournament blanks as wins or losses.')}</section>`);
  }
  function pitchlab(){const q=pack.pitch[s.pitch];const complete=s.pitchChoice!==null,correct=complete&&s.pitchChoice===q.answer;
    return shell('pitchlab',`${head('THE TOOLBOX / PITCH SEQUENCING','THE PITCH LAB','One fastball. One changeup. A purpose behind every call.')}
    <section class="hq-container hq-pad"><div class="hq-pitch-grid"><div class="hq-pitch-display"><div class="hq-board-top"><span>THE COUNT</span><span>SCENARIO ${s.pitch+1} / ${pack.pitch.length}</span></div><div class="hq-big-count">${esc(q.count)}</div><div class="hq-pitch-sub">${esc(q.hitter)}</div><div class="hq-strikezone"><div class="hq-zonegrid">${Array.from({length:9},(_,i)=>`<div class="${complete?'hq-zone-finished':''}"></div>`).join('')}</div><span>STRIKE ZONE / COACH'S VIEW</span></div><div class="hq-pitch-footer"><span>FASTBALL / CHANGEUP SYSTEM</span><span>COMMAND FIRST</span></div></div>
    <div class="hq-answer-card"><span class="hq-tag">MAKE THE CALL</span><h2>${esc(q.prompt)}</h2><div class="hq-choices">${q.choices.map((v,i)=>`<button type="button" data-hq-pitch="${i}" class="${complete&&i===q.answer?'correct':''} ${complete&&s.pitchChoice===i&&i!==q.answer?'incorrect':''}" ${complete?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${esc(v)}</button>`).join('')}</div>
      ${complete?`<div class="hq-answer"><span class="hq-tag">${correct?'GOOD STRATEGIC READ':'CONSIDER THIS CALL'}</span><p>${esc(q.why)}</p><strong>${esc(q.principle)}</strong><div class="hq-pitch-location">LOCATION IDEA: ${esc(q.zone)}</div></div>`:''}
      <div class="hq-situation-actions"><button type="button" id="hq-pitch-next" class="hq-orange-button">${complete?'NEXT COUNT':'SKIP COUNT'} ↗</button><a href="#playbook" class="hq-inline-link">POSITION PLAYBOOK ↗</a></div></div></div>
      ${note('Practice exercise only: there is no universally correct pitch for a count. Actual calls must consider command, catcher ability, hitter tendencies, game situation, and the pitcher’s available pitches.')}</section>`);
  }
  function flock(){const gallery=(pack.media||[]).filter(x=>/^assets\/[-_./\w]+\.(webp|png|jpg|jpeg)$/i.test(x.src||''));
    return shell('flock',`${head('PROGRAM CULTURE / PHOTOGRAPHY','THE FLOCK','The uniform changes. The name across the front stays.')}
    <section class="hq-container hq-pad"><div class="hq-flock-hero"><div class="hq-flock-art">${logo('assets/pennant.webp','hq-flock-pennant')}</div><div class="hq-flock-copy"><span class="hq-tag">FOR MORRICE / ALWAYS</span><h2>MORE THAN <em>THE SCORE.</em></h2><p>Photos, memories, introductions, and the faces of the program belong here—curated from team-approved images, not stock photos or AI-generated players.</p>${button('FOLLOW THE ORIOLES','https://www.instagram.com/morriceoriolessoftball/')}</div></div>
      <div class="hq-section-title"><span class="hq-tag">PHOTO CHAPTERS</span><h2>FROM THE <em>DUGOUT.</em></h2></div>
      ${gallery.length?`<div class="hq-gallery">${gallery.map(x=>`<figure><img src="${esc(x.src)}" alt="${esc(x.alt||x.caption||'Morrice softball image')}" loading="lazy"/><figcaption><strong>${esc(x.title||'FOR MORRICE')}</strong><p>${esc(x.caption||'')}</p></figcaption></figure>`).join('')}</div>`:`<div class="hq-gallery-placeholder"><div class="hq-gallery-stamp">M</div><div><span class="hq-tag">THE NEXT CHAPTER</span><h3>THE PHOTO ARCHIVE IS READY.</h3><p>Add approved game, senior, and team photos to the website’s assets folder and list them in <code>data/program-data.js</code>. Until then, this page uses genuine Morrice brand graphics rather than placeholder people.</p></div>${logo('assets/boop-mono.webp','hq-gallery-bird')}</div>`}
      <div class="hq-three hq-gallery-themes">${[['01','GAME DAY','The moments between the lines.'],['02','PLAYER STORIES','Introductions, milestones, and senior tributes.'],['03','ROOTS','Photos and memories from generations of Orioles.']].map(x=>`<div><span>${x[0]}</span><h3>${x[1]}</h3><p>${x[2]}</p></div>`).join('')}</div></section>`);
  }
  function playbook(){const p=pack.positions.find(x=>x.code===s.position)||pack.positions[0];
    return shell('playbook',`${head('DEFENSIVE FUNDAMENTALS / NINE JOBS','PLAYER PLAYBOOK','Know your job. Know your teammate’s job. Make the routine play elite.')}
    <section class="hq-container hq-pad"><div class="hq-position-selector" role="group" aria-label="Choose position">${pack.positions.map(x=>`<button type="button" data-hq-position="${esc(x.code)}" class="${s.position===x.code?'active':''}"><strong>${esc(x.code)}</strong><small>${esc(x.name)}</small></button>`).join('')}</div>
      <div class="hq-playbook-grid"><div class="hq-playbook-field">${fieldGraphic({fielder:p.code,runners:'Empty',target:'HOLD'},false)}<div class="hq-spotlight">${esc(p.code)} <span>${esc(p.name)}</span></div></div>
      <div class="hq-position-card"><span class="hq-tag">IF YOU FORGET EVERYTHING → DO THIS</span><h2>${esc(p.rule)}</h2><div class="hq-position-detail"><small>BEFORE THE PITCH</small><p>${esc(p.before)}</p></div><div class="hq-position-detail"><small>PRIMARY + BACKUP READ</small><p>${esc(p.primary)}</p></div><div class="hq-position-detail"><small>THE MISTAKE TO ELIMINATE</small><p>${esc(p.mistake)}</p></div><div class="hq-coach-stamp">${esc(p.reminder)}</div></div></div>
      <div class="hq-footer-action">${button('RUN THE DEFENSE LAB','#lab')} ${button('TAKE A SITUATION ROOM REP','#situation',true)}</div>
      ${note('These are concise Morrice system reminders. For game-specific bunt rotations, relays, backups, tags and forces, follow the coach’s installed coverage rather than a one-size-fits-all diagram.')}</section>`);
  }
  function factory(){const w=pack.factory.find(x=>x.id===s.factoryDay)||pack.factory[0];const total=w.moves.length;const count=w.moves.filter((m,i)=>workoutDone[w.id+':'+i]).length;
    return shell('factory',`${head('PLAYER DEVELOPMENT / THE WORK','ORIOLE FACTORY','Strength. Mobility. Explosion. The work between the games.')}
    <section class="hq-container hq-pad"><div class="hq-program-intro"><div><span class="hq-tag">REPEATABLE / THREE DAYS A WEEK</span><h2>THE WORK <em>IS THE WORK.</em></h2><p>Simple movements with dumbbells, bands, medicine balls and bodyweight. Clean form comes before heavy weight or speed. Start with a coach-approved load.</p></div><div class="hq-training-seal">BATS<small>BRICK BY BRICK</small></div></div>
      <div class="hq-day-switch" role="group" aria-label="Choose workout day">${pack.factory.map(x=>`<button type="button" data-hq-day="${x.id}" class="${s.factoryDay===x.id?'active':''}">${esc(x.title)}</button>`).join('')}</div>
      <section class="hq-workout"><div class="hq-workout-head"><div><span class="hq-tag">${esc(w.title)}</span><h3>${esc(w.theme)}</h3></div><div class="hq-workout-progress"><strong>${count}/${total}</strong><span>CHECKED THIS DEVICE</span></div></div><div class="hq-progress"><span id="hq-workout-bar" style="width:${count/total*100}%"></span></div>
      <div class="hq-exercise-list">${w.moves.map((m,i)=>`<label class="hq-exercise ${workoutDone[w.id+':'+i]?'done':''}"><input type="checkbox" data-hq-exercise="${w.id+':'+i}" ${workoutDone[w.id+':'+i]?'checked':''}/><span class="hq-exercise-no">${String(i+1).padStart(2,'0')}</span><span class="hq-exercise-info"><strong>${esc(m[0])}</strong><small>${esc(m[1])}</small></span><b>${esc(m[2])}</b></label>`).join('')}</div>
      <div class="hq-workout-actions"><button id="hq-reset-workout" type="button" class="hq-quiet-btn">RESET THIS DAY</button><button id="hq-print-workout" type="button" class="hq-quiet-btn">PRINT THIS SESSION ↗</button></div></section>
      ${note('Checklist progress is saved only in this browser; it is not submitted to a coach or synced across devices. Coaches should supervise lifting and choose safe modifications and loads for each athlete.')}</section>`);
  }
  function render(route,siteData){switch(route){case 'hub':return hub();case 'chasing':return chase();case 'situation':return situation();case 'gameday':return gameday(siteData);case 'vault':return vault();case 'pitchlab':return pitchlab();case 'flock':return flock();case 'playbook':return playbook();case 'factory':return factory();default:return hub();}}
  const rerender=(route,siteData)=>{const main=el('main');if(!main)return;main.innerHTML=render(route,siteData);mount(route,siteData);};
  function mount(route,siteData){
    if(route!=='situation')closeTimer();
    if(route==='chasing'){
      el('hq-metric')?.addEventListener('change',e=>{s.chaseMetric=e.target.value;s.chaseQuery='';rerender('chasing',siteData);});
      el('hq-chase-search')?.addEventListener('input',e=>{s.chaseQuery=e.target.value;const result=el('hq-chase-results');if(result)result.innerHTML=chaseResults();});
    }
    if(route==='situation'){
      document.querySelectorAll('[data-hq-choice]').forEach(b=>b.addEventListener('click',()=>{if(s.quizChoice!==null)return;closeTimer();s.quizChoice=Number(b.dataset.hqChoice);s.quizCount++;if(s.quizChoice===pack.situations[s.quiz].answer)s.quizCorrect++;rerender(route,siteData);}));
      el('hq-next')?.addEventListener('click',()=>{closeTimer();s.quiz=(s.quiz+1)%pack.situations.length;s.quizChoice=null;s.quizSeconds=null;rerender(route,siteData);});
      el('hq-timer')?.addEventListener('click',()=>{closeTimer();let seconds=10;s.quizSeconds=seconds;el('hq-seconds').textContent=seconds+' SEC';s.quizTimer=setInterval(()=>{seconds--;const box=el('hq-seconds');if(!box){closeTimer();return;}box.textContent=seconds>0?seconds+' SEC':'TIME / MAKE A READ';if(seconds<=0)closeTimer();},1000);});
    }
    if(route==='vault')el('hq-vault-decade')?.addEventListener('change',e=>{s.vaultDecade=e.target.value;rerender(route,siteData);});
    if(route==='pitchlab'){
      document.querySelectorAll('[data-hq-pitch]').forEach(b=>b.addEventListener('click',()=>{if(s.pitchChoice!==null)return;s.pitchChoice=Number(b.dataset.hqPitch);rerender(route,siteData);}));
      el('hq-pitch-next')?.addEventListener('click',()=>{s.pitch=(s.pitch+1)%pack.pitch.length;s.pitchChoice=null;rerender(route,siteData);});
    }
    if(route==='playbook')document.querySelectorAll('[data-hq-position]').forEach(b=>b.addEventListener('click',()=>{s.position=b.dataset.hqPosition;rerender(route,siteData);}));
    if(route==='factory'){
      document.querySelectorAll('[data-hq-day]').forEach(b=>b.addEventListener('click',()=>{s.factoryDay=b.dataset.hqDay;rerender(route,siteData);}));
      document.querySelectorAll('[data-hq-exercise]').forEach(b=>b.addEventListener('change',()=>{workoutDone[b.dataset.hqExercise]=b.checked;try{localStorage.setItem('morrice-factory-checks-v1',JSON.stringify(workoutDone))}catch(_){};rerender(route,siteData);}));
      el('hq-reset-workout')?.addEventListener('click',()=>{for(const k of Object.keys(workoutDone)){if(k.startsWith(s.factoryDay+':'))delete workoutDone[k];}try{localStorage.setItem('morrice-factory-checks-v1',JSON.stringify(workoutDone))}catch(_){};rerender(route,siteData);});
      el('hq-print-workout')?.addEventListener('click',()=>{window.print();});
    }
  }
  window.MorriceProgram={render,mount,closeTimer};
})();
