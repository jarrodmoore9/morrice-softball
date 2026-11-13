/* Morrice Lady Orioles Softball — no framework, no build step. */
(() => {
  'use strict';
  const SEED = structuredClone(window.MORRICE_CONTENT || {});
  const STORE = 'morrice-softball-editor-preview-v1';
  let data = structuredClone(SEED);
  try {
    const saved = localStorage.getItem(STORE);
    if (saved) data = {...data, ...JSON.parse(saved)};
  } catch (error) { console.warn('Local preview could not load:', error); }
  let activeFilter = 'All';
  const main = document.getElementById('main');
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c)=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeLink = (url) => /^https:\/\//i.test(url||'') ? esc(url) : '#';
  const fmtDate = (date) => {
    if (!date) return 'TBD';
    const d = new Date(String(date).length===10?String(date)+'T12:00:00':date);
    return Number.isFinite(d.getTime()) ? d.toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:'UTC'}) : esc(date);
  };
  const btn = (text, href, type='primary')=>`<a class="btn btn-${type}" href="${href}">${text}</a>`;
  const heading = (eye,title,sub='',pennant=false)=>`<section class="page-hero"><div class="max-layout"><div class="eyebrow kicker-line">${eye}</div><h1 class="section-heading">${title}</h1><p class="lede">${sub}</p>${pennant?'<img class="pennant-small" src="assets/pennant.webp" alt="For Morrice"/>':''}</div></section>`;

  function home(){
    return `<section class="hero"><div class="hero-copy"><div class="eyebrow kicker-line hero-mini">${esc(data.heroEyebrow)}</div><h1><span>ROOTS</span><span class="orange">RUN</span><span class="outline">DEEP.</span></h1><p>${esc(data.heroSubheading)}</p><div class="hero-actions">${btn('ENTER THE DEFENSE LAB ↗','#lab')}${btn('2027 SCHEDULE','#schedule','secondary')}</div></div><div class="hero-graphic"><img class="hero-bird" src="assets/boop.webp" alt="Morrice Lady Orioles Boop head mascot"/><div class="hero-stamp">FOR MORRICE. ALWAYS.</div></div><div class="hero-foot"><span>MORRICE, MICHIGAN / ESTABLISHED IN COMMUNITY</span><span>SCROLL TO EXPLORE ↓</span></div></section>
    <div class="marquee-bar" aria-hidden="true"><div class="marquee-inner"><span>BRICK BY BRICK</span><span>ALL IN</span><span>THE TOWN</span><span>STRENGTH OF THE FLOCK</span></div></div>
    <section class="feature-band"><article class="feature"><span class="num">01 / THE SEASON</span><div><h3>EVERY GAME.<br/>EVERY INNING.</h3><p>Fixtures, opponents, results, and what comes next.</p></div><a href="#schedule">VIEW SCHEDULE ↗</a></article><article class="feature"><span class="num">02 / THE FLOCK</span><div><h3>THE NAME ON<br/>THE FRONT.</h3><p>Meet the Lady Orioles representing Morrice.</p></div><a href="#roster">MEET THE TEAM ↗</a></article><article class="feature"><span class="num">03 / THE WORK</span><div><h3>BUILT, NOT<br/>GIVEN.</h3><p>Player development, resources, and the defensive playbook.</p></div><a href="#toolbox">OPEN THE TOOLBOX ↗</a></article></section>
    <section class="section"><div class="max-layout section-intro"><div><div class="eyebrow kicker-line">BUILT ON BATS</div><h2 class="section-heading">THE STANDARD<br/><em>IS THE STANDARD.</em></h2></div><p>${esc(data.programIntroduction)} <br/><br/>Every rep. Every detail. Every person in the flock.</p></div><div class="card-grid">${[
      ['B','BRICK BY BRICK','We build the habits before we chase the results.'],['A','ALL IN','Competitive effort, toughness, and commitment every day.'],['T','THE TOWN','We wear Morrice across our chest for a reason.']
    ].map(([n,t,p])=>`<article class="editorial-card"><div class="top"><span class="card-eyebrow">BATS / ${n}</span><h3>${t}</h3><p>${p}</p></div><div class="card-foot">THE ORIOLE WAY <span>↗</span></div></article>`).join('')}</div><div class="home-s-line"><span>STRENGTH OF THE FLOCK</span><p>We get better together. We win together. We own the standard together.</p></div></section>
    <section class="showcase"><div class="showcase-copy"><div class="eyebrow kicker-line" style="color:#ab3c13">INTERACTIVE PLAYER DEVELOPMENT</div><h2 class="section-heading">THE<br/><em>DEFENSE</em><br/>LAB.</h2><p class="lede">Put runners on base. Choose the outs. Tap where the ball lands. Watch all nine defenders move—and see the reason behind the decision.</p><p style="font-size:13px;max-width:540px;color:#65635e">A coach-adjustable teaching model based on our defensive priorities, not a substitute for reading the live play.</p>${btn('RUN A PLAY ↗','#lab')}</div><div class="showcase-image"><img src="assets/boop-mono.webp" alt="Morrice Orioles silhouette"/><span class="watermark">READ. REACT.</span></div></section>
    <section class="section"><div class="max-layout section-intro"><div><div class="eyebrow kicker-line">AROUND THE PROGRAM</div><h2 class="section-heading">THE <em>LATEST.</em></h2></div><p>Updates from the dugout, the diamond, and the town.</p></div><div class="card-grid">${(data.announcements||[]).slice(0,3).map((a,i)=>`<article class="editorial-card"><div class="top"><div class="card-eyebrow">${esc(a.category||'Program')} / ${esc(a.date||'')}</div><h3>${esc(a.title)}</h3><p>${esc(a.description||'')}</p></div><div class="card-foot">MORRICE SOFTBALL<span>${String(i+1).padStart(2,'0')}</span></div></article>`).join('')}</div><div style="margin-top:25px">${btn('FOLLOW ON INSTAGRAM ↗',safeLink(data.instagram),'secondary')}</div></section>`;
  }
  function schedule(){
    const games = Array.isArray(data.games)? [...data.games]:[];
    games.sort((a,b)=>String(a.date).localeCompare(String(b.date)));
    return heading('THE 2027 CAMPAIGN','2027 <em>SCHEDULE.</em>','Every date is an opportunity. Results will appear when they are confirmed.',true)+`<section class="section"><div class="max-layout"><div class="section-intro"><div><div class="eyebrow kicker-line">VARSITY / JUNIOR VARSITY</div><h2 class="section-heading">UP NEXT.</h2></div><p>Times and locations are subject to school confirmation. Check official school communications for changes.</p></div>${games.length ? `<div class="schedule-list">${games.map(g=>`<article class="schedule-row"><div class="schedule-date">${fmtDate(g.date)}</div><div class="schedule-opponent">${g.home==='away'?'AT':'VS'} ${esc(g.opponent||'TBD')}<small>${esc(g.level||'Varsity')} · ${esc(g.location||'Location TBA')}</small></div><div class="schedule-meta">${esc(g.time||'TBD')} · ${g.home==='away'?'AWAY':'HOME'}</div><div class="schedule-result">${esc(g.result || (g.status==='postponed'?'POSTPONED':'UPCOMING'))}</div></article>`).join('')}</div>`:`<div class="empty-state"><div class="eyebrow">SEASON ${esc(data.season)}</div><h3>THE SCHEDULE IS COMING.</h3><p>${esc(data.scheduleNote)}</p>${btn('FOLLOW FOR UPDATES ↗',safeLink(data.instagram),'secondary')}</div>`}<div class="roster-privacy">Want to update opponents, dates, or scores? Open <a href="#manage" style="color:var(--orange);text-decoration:underline">Manage Content</a> or send the new information to ChatGPT for an updated content file.</div></div></section>`;
  }
  function roster(){
    const people = Array.isArray(data.roster)?data.roster:[];
    return heading('THE FLOCK / THE PEOPLE','OUR <em>ROSTER.</em>','A program is only as strong as the people who wear its name.')+`<section class="section"><div class="max-layout"><div class="eyebrow kicker-line">${esc(data.season)} / MORRICE SOFTBALL</div><h2 class="section-heading">LADY ORIOLES.</h2>${people.length?`<div class="roster-grid">${people.map(p=>`<article class="player-card"><div class="player-num">${esc(p.number||'—')}</div><div><div class="pos">${esc(p.position||'SOFTBALL')}</div><h3>${esc(p.name||'Player')}</h3><p>${esc(p.grade||'')}</p></div></article>`).join('')}</div>`:`<div class="empty-state"><div class="eyebrow">THE FLOCK / ${esc(data.season)}</div><h3>ROSTER ANNOUNCEMENT AHEAD.</h3><p>${esc(data.rosterNote)}</p></div>`}<div class="roster-privacy">Player information is public-facing. Publish names, photos, numbers, and details only with appropriate school/parental permission.</div></div></section>`;
  }
  function toolbox(){
    const categories=['All',...new Set((data.toolbox||[]).map(t=>t.category).filter(Boolean))];
    const shown=(data.toolbox||[]).filter(t=>activeFilter==='All'||t.category===activeFilter);
    const activeId=window.location.hash.split('/')[1];
    const active=(data.toolbox||[]).find(t=>t.id===activeId);
    return heading('THE DEVELOPMENT DEPARTMENT','THE <em>TOOLBOX.</em>','No shortcuts. No secret formulas. Just resources and repetitions that actually make players better.',true)+`<section class="section"><div class="max-layout"><div class="section-intro"><div><div class="eyebrow kicker-line">COACHING RESOURCES</div><h2 class="section-heading">STEAL FROM<br/><em>THE BEST.</em></h2></div><p>Start with fundamentals. Build your softball IQ. Add speed and competition when the routine play is sound.</p></div><div class="filter-pills">${categories.map(c=>`<button class="pill ${c===activeFilter?'active':''}" type="button" data-tool-filter="${esc(c)}">${esc(c)}</button>`).join('')}</div><div class="card-grid">${shown.map((t,i)=>`<article class="toolbox-card"><div class="serial">THE TOOLBOX / ${String(i+1).padStart(2,'0')} / ${esc(t.category)}</div><h3>${esc(t.title)}</h3><p>${esc(t.description)}</p><div class="toolbox-bottom"><span>${esc(t.subtitle)}</span><button type="button" data-tool-open="${esc(t.id)}">OPEN ↗</button></div></article>`).join('')}</div>${active?`<section class="toolbox-detail" id="toolbox-detail"><button type="button" class="close" aria-label="Close resource" data-tool-close>✕</button><span class="eyebrow">${esc(active.category)} / PLAYER DEVELOPMENT</span><h3>${esc(active.title)}</h3><p>${esc(active.description)}</p><ol>${(active.bullets||[]).map(b=>`<li>${esc(b)}</li>`).join('')}</ol><a class="btn btn-primary" href="https://www.youtube.com/results?search_query=${encodeURIComponent(active.videoQuery||active.title+' softball')}" target="_blank" rel="noopener noreferrer">FIND VIDEO EXAMPLES ↗</a><p style="font-size:12px;color:#666">Video link opens a YouTube search, not a certified technique or guaranteed match.</p></section>`:''}</div></section>`;
  }
  function records(){
    return window.MorriceRecords?.render()||heading('PROGRAM ARCHIVE','THE <em>RECORD BOOK.</em>','Records are loading.',true);
  }
  function about(){
    const vals=[['B','BRICK BY BRICK','Process-focused improvement. Every rep and every detail matter.'],['A','ALL IN','Relentless competitive effort and confidence without excuses.'],['T','THE TOWN','Represent the school and community that raised us.'],['S','STRENGTH OF THE FLOCK','Everything we say and do should make this team stronger.']];
    return heading('THE PROGRAM','FOR <em>MORRICE.</em>','Small town. Deep roots. A standard bigger than any single season.',true)+`<section class="section"><div class="max-layout about-grid"><div class="about-graphic"><img src="assets/pennant.webp" alt="For Morrice pennant"/></div><div><div class="eyebrow kicker-line">THE ORIOLE IDENTITY</div><h2 class="section-heading">OUR NAME.<br/><em>OUR STANDARD.</em></h2><p class="lede">${esc(data.programIntroduction)}</p><p style="color:var(--muted)">${esc(data.coachMessage)}</p><div class="values-grid">${vals.map(v=>`<div class="value-item"><strong>${v[0]} — ${v[1]}</strong><p>${v[2]}</p></div>`).join('')}</div></div></div></section><section class="section panel-light"><div class="max-layout"><div class="eyebrow kicker-line">HERITAGE MARKS</div><h2 class="section-heading">THEN.<br/><em>NOW.</em><br/>ALWAYS.</h2><p class="lede">The Boop head leads the current program. Our vintage marks and old-school lettering belong to Morrice's visual history.</p><div class="heritage-grid"><img src="assets/boop.webp" alt="Morrice Boop mascot"/><img src="assets/vintage-bird.webp" alt="Vintage Morrice Orioles bird mark"/><img src="assets/morrice-m.webp" alt="Morrice letter M logo"/><img src="assets/modern-mark.webp" alt="Alternate modern mark"/></div></div></section>`;
  }
  function manager(){
    return heading('CONTENT CONTROL / NO REBUILD','MANAGE <em>THE SITE.</em>','Edit text, games, and roster in your browser. Export one small content file to publish—no need to touch layout or game logic.')+`<section class="section"><div class="max-layout"><div class="public-note"><strong>IMPORTANT:</strong> This is a free static website, not a password-protected CMS. Changes saved here are a local preview on this device. To make them public, download <code>content.js</code> and replace <code>data/content.js</code> on your hosting service. Don't enter private player information or passwords.</div><div class="manager-grid" style="margin-top:25px"><div class="manager-panel"><h3>Program copy</h3><label for="editSeason">Season</label><input id="editSeason" value="${esc(data.season)}"/><label for="editMotto">Motto</label><input id="editMotto" value="${esc(data.motto)}"/><label for="editSubheading">Homepage description</label><textarea id="editSubheading">${esc(data.heroSubheading)}</textarea><label for="editProgramIntro">Program introduction</label><textarea id="editProgramIntro">${esc(data.programIntroduction)}</textarea><label for="editInstagram">Instagram link</label><input id="editInstagram" value="${esc(data.instagram)}"/><div class="manager-actions"><button type="button" class="btn btn-secondary" id="saveCopy">SAVE LOCAL PREVIEW</button></div></div><div class="manager-panel"><h3>Add game</h3><div class="row-two"><div><label for="newDate">Date</label><input type="date" id="newDate"/></div><div><label for="newTime">Time</label><input id="newTime" placeholder="4:00 PM"/></div></div><label for="newOpponent">Opponent</label><input id="newOpponent" placeholder="School name"/><div class="row-two"><div><label for="newHome">Home / Away</label><select id="newHome"><option value="home">Home</option><option value="away">Away</option></select></div><div><label for="newLevel">Level</label><select id="newLevel"><option>Varsity</option><option>Junior Varsity</option><option>Doubleheader</option></select></div></div><label for="newLocation">Location</label><input id="newLocation" placeholder="Morrice Softball Field"/><div class="manager-actions"><button type="button" class="btn btn-primary" id="addGame">+ ADD GAME</button></div><table class="manager-table"><thead><tr><th>Date</th><th>Opponent</th><th>Score / W-L</th><th></th></tr></thead><tbody>${(data.games||[]).map((g,i)=>`<tr><td>${esc(g.date)}</td><td>${esc(g.opponent)}</td><td><input aria-label="Result for ${esc(g.opponent)}" data-game-result="${i}" value="${esc(g.result||'')}" placeholder="W 5–2" style="min-width:95px;width:110px;padding:5px"/></td><td><button data-delete-game="${i}" type="button">REMOVE</button></td></tr>`).join('')}</tbody></table></div><div class="manager-panel"><h3>Add player</h3><div class="row-two"><div><label for="newNumber">Number</label><input id="newNumber" placeholder="12"/></div><div><label for="newPosition">Position</label><input id="newPosition" placeholder="SS / 2B"/></div></div><label for="newName">Name</label><input id="newName" placeholder="Player's public name"/><label for="newGrade">Year / grade</label><input id="newGrade" placeholder="Senior"/><div class="manager-actions"><button type="button" class="btn btn-primary" id="addPlayer">+ ADD PLAYER</button></div><table class="manager-table"><thead><tr><th>#</th><th>Name</th><th></th></tr></thead><tbody>${(data.roster||[]).map((p,i)=>`<tr><td>${esc(p.number)}</td><td>${esc(p.name)}</td><td><button data-delete-player="${i}" type="button">REMOVE</button></td></tr>`).join('')}</tbody></table></div><div class="manager-panel"><h3>Export + publish</h3><p class="manager-note">When your local changes are ready, use Export to download the one file the site reads. Existing design, animation, and game logic stay untouched.</p><div class="manager-actions"><button class="btn btn-primary" id="exportContent">DOWNLOAD CONTENT.JS ↓</button><button class="btn btn-secondary" id="resetContent">RESET PREVIEW</button></div><p class="manager-note">To update directly through ChatGPT, simply send the changed schedule, roster, or news and request a new <code>data/content.js</code> for this website.</p><p class="manager-note">For live spreadsheet-driven updates, optional published Google Sheets CSV feeds can be entered in the content file as <code>sheets.gamesCsv</code> and <code>sheets.rosterCsv</code>. See README for column names and privacy notes.</p><div id="managerStatus" class="manager-status" role="status" aria-live="polite"></div></div></div></div></section>`;
  }
  function render(){
    const route=(location.hash.replace(/^#/,'').split('/')[0]||'home');
    if (!['home','schedule','roster','toolbox','lab','about','records','manage'].includes(route)) {location.hash='#home';return;}
    document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('active',a.getAttribute('data-nav')===route));
    const menu=document.getElementById('mobileNav');menu.classList.remove('open');document.getElementById('menuToggle').setAttribute('aria-expanded','false');
    document.getElementById('headerIG').href=safeLink(data.instagram);
    document.getElementById('footerIG').href=safeLink(data.instagram);
    let html='';
    if (route==='home')html=home();
    if (route==='schedule')html=schedule();
    if (route==='roster')html=roster();
    if (route==='toolbox')html=toolbox();
    if (route==='about')html=about();
    if (route==='records')html=records();
    if (route==='manage')html=manager();
    if (route==='lab')html=window.MorriceDefenseLab?.render()||'<p>Defense Lab could not load.</p>';
    main.innerHTML=html;
    if(route==='lab')window.MorriceDefenseLab?.mount();
    if(route==='records')window.MorriceRecords?.mount();
    if(route==='toolbox')wireToolbox();
    if(route==='manage')wireManager();
    document.title=`${({home:'Morrice Softball',schedule:'Schedule',roster:'Roster',toolbox:'The Toolbox',lab:'Defense Lab',about:'Our Program',records:'Records',manage:'Manage Content'})[route]} | Morrice Lady Orioles`;
    if (route!=='toolbox'||!location.hash.includes('/')) window.scrollTo({top:0,behavior:'instant'});
    if(route==='toolbox'&&location.hash.includes('/'))setTimeout(()=>document.getElementById('toolbox-detail')?.scrollIntoView({block:'start'}),80);
  }
  function wireToolbox(){
    document.querySelectorAll('[data-tool-filter]').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.getAttribute('data-tool-filter');render()}));
    document.querySelectorAll('[data-tool-open]').forEach(b=>b.addEventListener('click',()=>{location.hash='#toolbox/'+encodeURIComponent(b.getAttribute('data-tool-open'));render()}));
    document.querySelector('[data-tool-close]')?.addEventListener('click',()=>{location.hash='#toolbox';render()});
  }
  function stash(){try{localStorage.setItem(STORE,JSON.stringify(data));return true;}catch(e){console.warn('Browser preview storage unavailable',e);return false;}}
  function wireManager(){
    const el=(id)=>document.getElementById(id);
    const update=(msg)=>{const s=el('managerStatus');if(s)s.textContent=msg;};
    el('saveCopy')?.addEventListener('click',()=>{data.season=el('editSeason').value.trim();data.motto=el('editMotto').value.trim();data.heroSubheading=el('editSubheading').value.trim();data.programIntroduction=el('editProgramIntro').value.trim();data.instagram=el('editInstagram').value.trim();stash();update('Local preview saved. Export content.js to publish for everyone.');});
    el('addGame')?.addEventListener('click',()=>{const opponent=el('newOpponent').value.trim();const date=el('newDate').value;if(!opponent||!date){update('Please enter both a game date and opponent.');return;}data.games.push({date,opponent,time:el('newTime').value.trim(),home:el('newHome').value,level:el('newLevel').value,location:el('newLocation').value.trim(),status:'upcoming',result:''});stash();render();});
    el('addPlayer')?.addEventListener('click',()=>{const name=el('newName').value.trim();if(!name){update('Please enter a player name approved for public posting.');return;}data.roster.push({number:el('newNumber').value.trim(),name,position:el('newPosition').value.trim(),grade:el('newGrade').value.trim()});stash();render();});
    document.querySelectorAll('[data-game-result]').forEach(input=>input.addEventListener('change',()=>{const i=+input.getAttribute('data-game-result');if(data.games[i]){data.games[i].result=input.value.trim();stash();update('Score saved in the local preview. Export to publish.')}}));
    document.querySelectorAll('[data-delete-game]').forEach(b=>b.addEventListener('click',()=>{data.games.splice(+b.getAttribute('data-delete-game'),1);stash();render()}));
    document.querySelectorAll('[data-delete-player]').forEach(b=>b.addEventListener('click',()=>{data.roster.splice(+b.getAttribute('data-delete-player'),1);stash();render()}));
    el('exportContent')?.addEventListener('click',()=>{const text='/* Morrice Softball public content. Update without rebuilding the website. */\nwindow.MORRICE_CONTENT = '+JSON.stringify(data,null,2)+';\n';const blob=new Blob([text],{type:'text/javascript'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download='content.js';a.click();setTimeout(()=>URL.revokeObjectURL(u),500);update('Downloaded content.js — replace the file in data/ on your hosting account to publish.');});
    el('resetContent')?.addEventListener('click',()=>{if(!confirm('Clear all local preview edits on this device?'))return;localStorage.removeItem(STORE);data=structuredClone(SEED);render();});
  }
  // Optional public Google Sheet CSV feed: published spreadsheets ONLY.
  // Games columns: date,opponent,time,home,level,location,result,status
  // Roster columns: number,name,position,grade
  const parseCSV=(str)=>{
    const records=[];let row=[],cell='',quoted=false;
    for(let i=0;i<str.length;i++){const c=str[i];if(c==='"'){if(quoted&&str[i+1]==='"'){cell+='"';i++}else quoted=!quoted}else if(c===','&&!quoted){row.push(cell);cell=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&str[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))records.push(row);row=[];cell=''}else cell+=c}
    row.push(cell);if(row.some(x=>x.trim()))records.push(row);
    const cols=(records.shift()||[]).map(c=>c.trim().toLowerCase());return records.map(row=>Object.fromEntries(cols.map((c,i)=>[c,(row[i]||'').trim()])));
  };
  async function loadFeeds(){
    const sheets=data.sheets||{};
    for(const [key,dest] of [['gamesCsv','games'],['rosterCsv','roster']]){
      const url=sheets[key];
      if(!url||!/^https:\/\//.test(url))continue;
      try{const r=await fetch(url);if(!r.ok)throw new Error('Feed returned '+r.status);const text=await r.text();data[dest]=parseCSV(text);if(location.hash.replace(/^#/,'').split('/')[0]=== (dest==='games'?'schedule':'roster'))render();}catch(e){console.warn('Public sheet not available',key,e)}
    }
  }
  document.getElementById('menuToggle')?.addEventListener('click',()=>{const m=document.getElementById('mobileNav');const open=m.classList.toggle('open');document.getElementById('menuToggle').setAttribute('aria-expanded',String(open));});
  window.addEventListener('hashchange',render);
  document.getElementById('copyrightYear').textContent=String(new Date().getFullYear());
  render();loadFeeds();
})();
