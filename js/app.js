const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const state={filter:'ALL',galleryFilter:'ALL',tab:'PROFILE',activeImage:null,worldRelation:'seol-gongchan',track:0,lastRouteKey:''};
const view=$('#view'), audio=$('#bgm'), tracks=$('#tracks'), play=$('#play'), bar=$('#bar'), vol=$('#vol');
const esc=(v='')=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const char=id=>CHARACTERS.find(c=>c.id===id)||CHARACTERS[0];

function mediaItem(raw){
  if(!raw) return null;
  if(typeof raw === 'string') return { type:'image', src:raw, thumb:raw, title:'Image Archive' };
  const type = raw.type === 'video' ? 'video' : 'image';
  return {
    type,
    src: raw.src || raw.url || '',
    thumb: raw.thumb || raw.poster || raw.src || '',
    title: raw.title || (type === 'video' ? 'Motion Archive' : 'Image Archive')
  };
}
function galleryItems(c){ return (c.gallery || []).map(mediaItem).filter(item => item && item.src); }
function mediaLabel(item, index, total){ return `${item.type === 'video' ? 'MOV' : 'IMG'} ${String(index + 1).padStart(2,'0')} / ${total}`; }
function mediaModalData(item){ return `data-modal-type="${esc(item.type)}" data-modal-src="${esc(item.src)}" data-modal-thumb="${esc(item.thumb)}" data-modal-title="${esc(item.title)}"`; }
const relsFor=id=>RELATIONS.filter(r=>r.from===id||r.to===id);
function setAccent(c){document.documentElement.style.setProperty('--accent',c?.accent||'#ff85b4')}
function relationTypeLabel(t){return {ALLY:'협력',WATCH:'감시',HOSTILE:'적대',TRADE:'거래',PROTECT:'보호',UNKNOWN:'미확인'}[t]||t}
function markTitle(text,sub=''){
  const isWorldLogo = text === WORLD.title && WORLD.logo;
  const cls = text === WORLD.title ? ' world-title-mark' : '';
  const titleNode = isWorldLogo
    ? `<img class="title-logo-img" src="${esc(WORLD.logo)}" alt="${esc(text)}"><h1 class="sr-only">${esc(text)}</h1>`
    : `<h1 data-title="${esc(text)}">${esc(text)}</h1>`;
  return `<div class="title-row${cls}"><i class="rotor"></i><div><p class="system-label">${esc(sub)}</p>${titleNode}</div></div>`;
}

function setRouteMotion(routeKey){
  const shouldAnimate = state.lastRouteKey !== routeKey;
  state.lastRouteKey = routeKey;
  const routeType = routeKey.startsWith('character/') ? ' route-character' : ` route-${routeKey}`;
  view.className = shouldAnimate ? `view route-enter${routeType}` : 'view';
  if (shouldAnimate) {
    view.setAttribute('data-access', routeKey.toUpperCase());
  }
}

function relationFlow(subjectId,{compact=false}={}){const subject=char(subjectId); const list=relsFor(subjectId); setAccent(subject); return `<section class="relation-console ${compact?'compact':''}" style="--subject:${subject.accent}"><div class="relation-head"><div>${markTitle(`${subject.displayName} RELATION FLOW`,'RELATION NETWORK')}</div><a href="#character/${subject.id}">OPEN FULL FILE</a></div><div class="relation-layout"><aside class="relation-core"><div class="core-node"><img src="${subject.mainImage}" alt="${esc(subject.displayName)}"><strong>${esc(subject.displayName)}</strong><span>${esc(subject.type)}</span></div></aside><div class="relation-list">${list.length?list.map(r=>{const f=char(r.from),t=char(r.to); const activeFrom=r.from===subjectId; return `<article class="relation-card ${r.type.toLowerCase()}" style="--from:${f.accent};--to:${t.accent}"><div class="flow-line"><b>${esc(f.displayName)}</b><i>→</i><b>${esc(t.displayName)}</b></div><div class="rel-meta"><span>${esc(r.type)} / ${esc(relationTypeLabel(r.type))}</span><span>INTENSITY ${r.intensity}/5</span></div><strong class="rel-label">${esc(r.label)}</strong><p>${esc(r.note)}</p></article>`}).join(''):`<article class="relation-card"><strong class="rel-label">NO LINKED RECORD</strong><p>아직 등록된 관계 기록이 없습니다.</p></article>`}</div></div></section>`}

function timelineMarkup(){
  return WORLD.timeline.map((raw,i)=>{
    const parts = String(raw).split(':');
    const code = (parts.shift() || '').trim();
    const text = parts.join(':').trim();
    const phase = ['CONFLICT','CONTROL','OUTBREAK','RECOVERY'][i] || 'ARCHIVE';
    const scan = ['00-01','00-02','2089','A-7'][i] || String(i+1).padStart(2,'0');
    return `<article class="timeline-node">
      <div class="timeline-stamp"><small>PHASE ${String(i+1).padStart(2,'0')}</small><strong>${esc(code)}</strong></div>
      <div class="timeline-pulse"><i></i></div>
      <div class="timeline-body">
        <span>${phase} / LOG ${scan}</span>
        <p>${esc(text || raw)}</p>
      </div>
    </article>`;
  }).join('');
}

function world(){
  const c=char(state.worldRelation);
  setAccent(c);
  setRouteMotion('world');
  view.innerHTML=`
    <section class="panel world">
      <div class="head">
        ${markTitle(WORLD.title,'WORLD MAP')}
        <div class="file-class">WORLD FILE // 2089</div>
      </div>

      <div class="hero">
        <p>${esc(WORLD.subtitle)}</p>
        <h2>${esc(WORLD.tagline)}</h2>
        <span>${esc(WORLD.summary)}</span>
      </div>

      <section class="world-section">
        <p class="panel-title">SPECIES INDEX</p>
        <div class="faction-grid">
          ${WORLD.factions.map(f=>`
            <a class="faction-card" href="#characters" data-species-jump="${esc(f.name)}">
              <strong>${esc(f.name)}</strong>
              <small>${esc(f.label)}</small>
              <span>${esc(f.text)}</span>
            </a>
          `).join('')}
        </div>
      </section>

      <section class="world-section split-section">
        <div>
          <p class="panel-title">TIMELINE</p>
          <div class="timeline-list">
            ${timelineMarkup()}
          </div>
        </div>
        <div>
          <p class="panel-title">CHARACTER MATRIX</p>
          <div class="matrix-grid">
            ${CHARACTERS.map(x=>`<a href="#character/${x.id}" style="--chip:${x.accent}"><strong>${esc(x.displayName)}</strong><span>${esc(x.type)}</span></a>`).join('')}
          </div>
        </div>
      </section>

      <section class="world-relations">
        <div class="relation-selector">
          <p class="panel-title">RELATION PREVIEW / SELECT SUBJECT</p>
          <div>${CHARACTERS.map(x=>`<button data-world-rel="${x.id}" style="--chip:${x.accent}" class="${x.id===state.worldRelation?'active':''}">${esc(x.displayName)}</button>`).join('')}</div>
        </div>
        <div id="worldRelationBox">${relationFlow(state.worldRelation,{compact:true})}</div>
      </section>
    </section>`;
  $$('[data-world-rel]').forEach(b=>b.onclick=()=>{
    state.worldRelation=b.dataset.worldRel;
    $('#worldRelationBox').innerHTML=relationFlow(state.worldRelation,{compact:true});
    $$('[data-world-rel]').forEach(x=>x.classList.toggle('active',x.dataset.worldRel===state.worldRelation));
  });
  $$('[data-species-jump]').forEach(a=>a.addEventListener('click',()=>{
    state.filter=a.dataset.speciesJump;
  }));
}
function characters(animateKey='characters'){setRouteMotion(animateKey); setAccent({accent:'#ff85b4'}); const visible=state.filter==='ALL'?CHARACTERS:CHARACTERS.filter(c=>c.species===state.filter); view.innerHTML=`<section class="panel"><div class="head"><div>${markTitle('BIO RECORDS','CHARACTER DATABASE')}</div><div class="filters">${['ALL','HUMAN','PLANT','INSECT','BEAST'].map(x=>`<button data-filter="${x}" class="${state.filter===x?'active':''}">${x}</button>`).join('')}</div></div><div class="card-grid">${visible.map(c=>`<a class="char-card" href="#character/${c.id}" style="--card:${c.accent}"><img src="${c.mainImage}"><b>${esc(c.displayName)}</b><small>${esc(c.type)}</small><span>${esc(c.creator)}</span></a>`).join('')}</div></section>`; $$('[data-filter]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;characters('characters')})}
function gallery(){
  const active=state.galleryFilter==='ALL'?null:char(state.galleryFilter);
  setAccent(active||{accent:'#ff85b4'});
  setRouteMotion('gallery');
  const media=CHARACTERS.flatMap(c=>galleryItems(c).map((item,i)=>({c,item,i,total:galleryItems(c).length})));
  const visible=active?media.filter(x=>x.c.id===active.id):media;
  const countLabel=active?`${galleryItems(active).length} MEDIA`:`${media.length} TOTAL MEDIA`;
  view.innerHTML=`<section class="panel"><div class="head"><div>${markTitle('GLOBAL GALLERY',`MEDIA ARCHIVE / ${countLabel}`)}</div><div class="file-class">${active?active.displayName:'ALL SUBJECTS'}</div></div><section class="gallery-filter"><p class="panel-title">SUBJECT FILTER</p><div><button data-gal="ALL" class="${state.galleryFilter==='ALL'?'active':''}">ALL</button>${CHARACTERS.map(c=>`<button data-gal="${c.id}" style="--chip:${c.accent}" class="${state.galleryFilter===c.id?'active':''}">${esc(c.displayName)} <small>${galleryItems(c).length}</small></button>`).join('')}</div></section><div class="gallery-grid">${visible.map(({c,item,i,total})=>`<article class="gallery-card ${item.type==='video'?'video-card':''}" style="--card:${c.accent}" ${mediaModalData(item)}><div class="media-thumb"><img src="${esc(item.thumb)}" alt="${esc(item.title)}"><span class="media-badge">${item.type==='video'?'VIDEO':'IMAGE'}</span></div><p><b>${esc(c.displayName)}</b><span>${mediaLabel(item,i,total)} · ${esc(item.title)}</span></p></article>`).join('')}</div></section>`;
  $$('[data-gal]').forEach(b=>b.onclick=()=>{state.galleryFilter=b.dataset.gal;setAccent(state.galleryFilter==='ALL'?{accent:'#ff85b4'}:char(state.galleryFilter));galleryNoMotion()});
  $$('[data-modal-src]').forEach(x=>x.onclick=()=>lightboxMedia({type:x.dataset.modalType,src:x.dataset.modalSrc,thumb:x.dataset.modalThumb,title:x.dataset.modalTitle}));
}
function galleryNoMotion(){
  const old=state.lastRouteKey; state.lastRouteKey='gallery'; gallery(); state.lastRouteKey='gallery';
}
function galleryBlock(c){
  const list=galleryItems(c);
  const selected=list.find(item=>item.src===state.activeImage)||list[0];
  return `<section class="gallery-tab"><div class="focus">${selected?`<button class="focus-open ${selected.type==='video'?'video-focus':''}" type="button" ${mediaModalData(selected)} aria-label="Open expanded gallery media"><img src="${esc(selected.thumb)}" alt="${esc(c.displayName)} gallery media"><span class="media-badge large">${selected.type==='video'?'PLAY VIDEO':'EXPAND IMAGE'}</span></button>`:'<div class="empty-gallery">NO MEDIA REGISTERED</div>'}</div><div class="thumbs">${list.map((item,i)=>`<button data-img="${esc(item.src)}" class="${selected&&selected.src===item.src?'active':''}"><img src="${esc(item.thumb)}" alt="${esc(c.displayName)} thumbnail ${i+1}"><span>${item.type==='video'?'MOV':'IMG'} ${String(i+1).padStart(2,'0')}</span></button>`).join('')}</div></section>`
}

function statValue(c,key){
  const map={THREAT:'threat',STABILITY:'stability',AFFINITY:'affinity',CONTROL:'control'};
  const metricKey=map[key];
  if(c.metrics && typeof c.metrics[metricKey] === 'number') return c.metrics[metricKey];
  const threat={S:9,'A+':8,A:7,'B+':5,B:4,C:3}[c.danger]||5;
  if(key==='THREAT')return threat;
  if(key==='STABILITY'){if(c.species==='HUMAN')return 8;if(c.role.includes('ASSASSIN')||c.role.includes('LOCUST'))return 4;if(c.role.includes('HYDRANGEA'))return 7;if(c.role.includes('QUEEN'))return 6;return 5;}
  if(key==='AFFINITY'){if(c.id==='hale')return 4;if(c.species==='PLANT')return 6;if(c.species==='BEAST')return 5;if(c.species==='HUMAN')return 2;return 3;}
  if(key==='CONTROL'){if(c.danger==='S')return 3;if(c.danger==='A+'||c.danger==='A')return 5;return 7;}
  return 5;
}
function identityRows(c){
  const rows=c.identityFields||[
    ['ID',c.archiveId||`RA-${c.id.toUpperCase()}`],['CLASS',c.type],['CREATOR',c.creator],['FACTION',c.affiliation],['STATUS',c.status],['AFFIRM',c.affirm||'UNVERIFIED'],['CLEARANCE',c.clearance||'A-7'],['SCAN',c.scan||'PENDING']
  ];
  return rows.map(([k,v])=>`<p><span>${esc(k)}</span><strong>${esc(v)}</strong></p>`).join('');
}
function statUnit(label,value,type='bar'){
  return `<article class="stat-unit ${type}"><div><span>${esc(label)}</span><strong>${value}/10</strong></div><div class="stat-marks">${Array.from({length:10},(_,i)=>`<i class="${i<value?'on':''}"></i>`).join('')}</div></article>`;
}
function statusStrip(c){
  return `<section class="status-strip">
    ${statUnit('THREAT',statValue(c,'THREAT'),'square')}
    ${statUnit('STABILITY',statValue(c,'STABILITY'),'bar')}
    ${statUnit('AFFINITY',statValue(c,'AFFINITY'),'diamond')}
    ${statUnit('CONTROL',statValue(c,'CONTROL'),'bar')}
  </section>`;
}
function profileDashboard(c){
  const badges=c.profileBadges||[
    `AFFIRM : ${c.affirm||'UNVERIFIED'}`,
    `CLEARANCE : ${c.clearance||'A-7'}`,
    `SCAN : ${c.scan||'PENDING'}`
  ];
  return `<section class="profile-dashboard">
    <div class="profile-core info-panel">
      <p class="panel-title">PROFILE / BIO SIGNAL</p>
      <div class="profile-badges">
        ${badges.map(x=>`<span>${esc(x)}</span>`).join('')}
      </div>
      <ul>${(c.profile||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
      <p>${esc(c.summary||'')}</p>
    </div>
    <aside class="profile-stat-card">
      <p class="panel-title">STATUS METRICS</p>
      ${statusStrip(c)}
    </aside>
  </section>`;
}
function charPage(id='hale'){const c=char(id); setAccent(c); if(!galleryItems(c).some(item=>item.src===state.activeImage)) state.activeImage=(galleryItems(c)[0]||{}).src; setRouteMotion(`character/${c.id}`); view.innerHTML=`<section class="panel dossier"><div class="head"><div>${markTitle(`${c.enName} / ${c.krName}`,'SUBJECT')}</div><div class="file-class">CLASS ${c.danger} // ${esc(c.affirm||'UNVERIFIED')}</div></div><div class="mini-nav">${CHARACTERS.map(x=>`<a href="#character/${x.id}" class="${x.id===c.id?'active':''}" style="--chip:${x.accent}">${esc(x.displayName)}</a>`).join('')}</div><div class="dossier-grid"><section class="portrait"><img src="${c.mainImage}"></section><aside class="identity"><b>RUST ARK</b>${identityRows(c)}</aside></div>${statusStrip(c)}<blockquote>${esc(c.quote)}</blockquote><div class="tabs">${['PROFILE','STORY','RELATION','RECORD','GALLERY'].map(t=>`<button data-tab="${t}" class="${state.tab===t?'active':''}">${t}</button>`).join('')}</div><div class="tabbox">${tab(c)}</div></section>`; $$('[data-tab]').forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab; $$('[data-tab]').forEach(x=>x.classList.toggle('active', x.dataset.tab===state.tab)); $('.tabbox').innerHTML=tab(c); bindInner(c)}); bindInner(c)}
function tab(c){if(state.tab==='STORY')return `<section class="info-panel"><p class="panel-title">STORY FILE</p><p>${esc(c.story)}</p></section>`; if(state.tab==='RELATION')return relationFlow(c.id); if(state.tab==='RECORD')return `<section class="info-panel"><p class="panel-title">ARCHIVE RECORD</p>${c.record.map((x,i)=>`<article class="log"><b>LOG ${String(i+1).padStart(2,'0')}</b><span>${esc(x)}</span></article>`).join('')}</section>`; if(state.tab==='GALLERY')return galleryBlock(c); return profileDashboard(c)}
function bindInner(c){
  $$('[data-img]').forEach(b=>b.onclick=()=>{state.activeImage=b.dataset.img; $('.tabbox').innerHTML=galleryBlock(c); bindInner(c)});
  $$('[data-modal-src]').forEach(b=>b.onclick=()=>lightboxMedia({type:b.dataset.modalType,src:b.dataset.modalSrc,thumb:b.dataset.modalThumb,title:b.dataset.modalTitle}));
}
function lightboxMedia(item){
  const media=mediaItem(item);
  const b=document.createElement('div');
  b.className='lightbox';
  const body = media.type === 'video'
    ? `<video controls playsinline poster="${esc(media.thumb)}"><source src="${esc(media.src)}" type="video/mp4">이 브라우저는 video 태그를 지원하지 않습니다.</video>`
    : `<img src="${esc(media.src)}" alt="expanded archive image">`;
  b.innerHTML=`<div class="lightbox-dialog media-dialog"><div class="lightbox-head"><span>${media.type === 'video' ? 'MOTION ARCHIVE PREVIEW' : 'IMAGE ARCHIVE PREVIEW'} / ${esc(media.title)}</span><button type="button">CLOSE</button></div><div class="lightbox-stage">${body}</div></div>`;
  b.onclick=e=>{if(e.target===b||e.target.tagName==='BUTTON')b.remove()};
  document.body.appendChild(b);
}

function render(){const [r,p]=(location.hash||'#world').slice(1).split('/'); $$('nav a').forEach(a=>a.classList.toggle('active',a.dataset.nav===r||(r==='character'&&a.dataset.nav==='characters'))); if(r==='characters')characters(); else if(r==='gallery')gallery(); else if(r==='character')charPage(p); else world(); requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'auto'}))}
function musicInit(){tracks.innerHTML=BGM_TRACKS.map((t,i)=>`<option value="${i}">${esc(t.title)}</option>`).join(''); loadTrack(0,false)}
function loadTrack(i,auto=!audio.paused){state.track=(i+BGM_TRACKS.length)%BGM_TRACKS.length; const t=BGM_TRACKS[state.track]; audio.src=t.src; $('#trackTitle').textContent=t.title; $('#trackMood').textContent=t.mood; tracks.value=state.track; if(auto)audio.play().catch(()=>{})}
play.onclick=()=>audio.paused?audio.play().catch(()=>{}):audio.pause(); audio.onplay=()=>play.textContent='Ⅱ'; audio.onpause=()=>play.textContent='▶'; $('#next').onclick=()=>loadTrack(state.track+1,true); $('#prev').onclick=()=>loadTrack(state.track-1,true); tracks.onchange=e=>loadTrack(Number(e.target.value),true); vol.oninput=e=>audio.volume=Number(e.target.value); bar.oninput=e=>{if(audio.duration) audio.currentTime=audio.duration*Number(e.target.value)/1000}; audio.ontimeupdate=()=>{if(audio.duration)bar.value=Math.floor(audio.currentTime/audio.duration*1000)}; audio.onended=()=>loadTrack(state.track+1,true); audio.volume=.45; musicInit(); window.onhashchange=render; window.addEventListener('load', render); render();
