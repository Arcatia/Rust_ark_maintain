const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const state={filter:'ALL',galleryFilter:'ALL',tab:'PROFILE',activeImage:null,worldRelation:'seol-gongchan',track:0,lastRouteKey:'',relationSubjectFilter:'ALL',relationTypeFilter:'ALL',relationViewMode:'CIRCULAR'};
const view=$('#view'), audio=$('#bgm'), tracks=$('#tracks'), play=$('#play'), bar=$('#bar'), vol=$('#vol');
const updateBarBg=el=>{const min=el.min||0,max=el.max||100,val=el.value,percent=(val-min)/(max-min)*100; el.style.background=`linear-gradient(to right,var(--accent) 0%,var(--accent) ${percent}%,rgba(126,159,196,.12) ${percent}%,rgba(126,159,196,.12) 100%)`};
const esc=(v='')=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const char=id=>CHARACTERS.find(c=>c.id===id)||CHARACTERS[0];
const renderMainImage=(src,alt='',className='')=>{
  if(!src)return `<div class="empty-slot-placeholder ${className}">EMPTY SLOT</div>`;
  return `<img src="${esc(src)}" alt="${esc(alt)}" class="${className}">`;
};

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

function relationFlow(subjectId,{compact=false}={}){const subject=char(subjectId); const list=relsFor(subjectId); setAccent(subject); return `<section class="relation-console ${compact?'compact':''}" style="--subject:${subject.accent}"><div class="relation-head"><div>${markTitle(`${subject.displayName} RELATION FLOW`,'RELATION NETWORK')}</div><a href="#character/${subject.id}">OPEN FULL FILE</a></div><div class="relation-layout"><aside class="relation-core"><div class="core-node">${renderMainImage(subject.mainImage,subject.displayName)}<strong>${esc(subject.displayName)}</strong><span>${esc(subject.type)}</span></div></aside><div class="relation-list">${list.length?list.map(r=>{const f=char(r.from),t=char(r.to); const activeFrom=r.from===subjectId; return `<article class="relation-card ${r.type.toLowerCase()}" style="--from:${f.accent};--to:${t.accent}"><div class="flow-line"><b>${esc(f.displayName)}</b><i>→</i><b>${esc(t.displayName)}</b></div><div class="rel-meta"><span>${esc(r.type)} / ${esc(relationTypeLabel(r.type))}</span><span>INTENSITY ${r.intensity}/5</span></div><strong class="rel-label">${esc(r.label)}</strong><p>${esc(r.note)}</p></article>`}).join(''):`<article class="relation-card"><strong class="rel-label">NO LINKED RECORD</strong><p>아직 등록된 관계 기록이 없습니다.</p></article>`}</div></div></section>`}

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
        <h2>${esc(WORLD.tagline).replace('자연을 지배', '<span class="hero-hl">자연을 지배</span>').replace('전쟁에서 승리', '<span class="hero-hl">전쟁에서 승리</span>').replace('아니라,', '아니라,<br>')}</h2>
        <span style="display:block; line-height:1.7;">${esc(WORLD.summary).replace('통제했다.', '통제했다.<br>')}</span>
      </div>

      <section class="world-section">
        <p class="panel-title">SPECIES INDEX</p>
        <div class="faction-grid">
          ${WORLD.factions.map(f=>{
            const fColor = { HUMAN: '#5d85ad', PLANT: '#4ea885', BEAST: '#b89759', INSECT: '#8e7cc3' }[f.name] || '#5d85ad';
            return `
            <a class="faction-card" href="#characters" data-species-jump="${esc(f.name)}" style="background: color-mix(in srgb, ${fColor} 6%, rgba(5,11,21,.4)); border: none; --card-color: ${fColor}; transition: all 0.3s ease;">
              <strong style="color: ${fColor};">${esc(f.name)}</strong>
              <small style="color: color-mix(in srgb, ${fColor} 75%, #8db7ef);">${esc(f.label)}</small>
              <span>${esc(f.text)}</span>
            </a>
          `;}).join('')}
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
function characters(animateKey='characters'){setRouteMotion(animateKey); setAccent({accent:'#ff85b4'}); const visible=state.filter==='ALL'?CHARACTERS:CHARACTERS.filter(c=>c.species===state.filter); view.innerHTML=`<section class="panel"><div class="head"><div>${markTitle('BIO RECORDS','CHARACTER DATABASE')}</div><div class="filters">${['ALL','HUMAN','PLANT','INSECT','BEAST'].map(x=>`<button data-filter="${x}" class="${state.filter===x?'active':''}">${x}</button>`).join('')}</div></div><div class="card-grid">${visible.map(c=>`<a class="char-card" href="#character/${c.id}" style="--card:${c.accent}">${renderMainImage(c.mainImage,c.displayName)}<b>${esc(c.displayName)}</b><small>${esc(c.type)}</small><span>${esc(c.creator)}</span></a>`).join('')}</div></section>`; $$('[data-filter]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;characters('characters')})}
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
  if(key==='STABILITY'){if(c.species==='HUMAN')return 8;if(c.role.includes('BUTTERFLY')||c.role.includes('ASSASSIN')||c.role.includes('LOCUST'))return 4;if(c.role.includes('HYDRANGEA'))return 7;if(c.role.includes('QUEEN'))return 6;return 5;}
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
function charPage(id='hale'){const c=char(id); setAccent(c); if(!galleryItems(c).some(item=>item.src===state.activeImage)) state.activeImage=(galleryItems(c)[0]||{}).src; setRouteMotion(`character/${c.id}`); view.innerHTML=`<section class="panel dossier"><div class="head"><div>${markTitle(`${c.enName} / ${c.krName}`,'SUBJECT')}</div><div class="file-class">CLASS ${c.danger} // ${esc(c.affirm||'UNVERIFIED')}</div></div><div class="mini-nav">${CHARACTERS.map(x=>`<a href="#character/${x.id}" class="${x.id===c.id?'active':''}" style="--chip:${x.accent}">${esc(x.displayName)}</a>`).join('')}</div><div class="dossier-grid"><section class="portrait">${renderMainImage(c.mainImage,c.displayName)}</section><aside class="identity"><b>RUST ARK</b>${identityRows(c)}</aside></div>${statusStrip(c)}<blockquote>${esc(c.quote)}</blockquote><div class="tabs">${['PROFILE','STORY','RELATION','RECORD','GALLERY'].map(t=>`<button data-tab="${t}" class="${state.tab===t?'active':''}">${t}</button>`).join('')}</div><div class="tabbox">${tab(c)}</div></section>`; $$('[data-tab]').forEach(b=>b.onclick=()=>{state.tab=b.dataset.tab; $$('[data-tab]').forEach(x=>x.classList.toggle('active', x.dataset.tab===state.tab)); $('.tabbox').innerHTML=tab(c); bindInner(c)}); bindInner(c)}
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

function describeAnnularSector(cx, cy, innerR, outerR, startAngle, endAngle) {
  let diff = endAngle - startAngle;
  if (diff < 0) diff += 2 * Math.PI;

  const x1 = cx + outerR * Math.cos(startAngle);
  const y1 = cy + outerR * Math.sin(startAngle);
  const x2 = cx + outerR * Math.cos(endAngle);
  const y2 = cy + outerR * Math.sin(endAngle);

  const x3 = cx + innerR * Math.cos(endAngle);
  const y3 = cy + innerR * Math.sin(endAngle);
  const x4 = cx + innerR * Math.cos(startAngle);
  const y4 = cy + innerR * Math.sin(startAngle);

  const largeArcFlag = diff > Math.PI ? 1 : 0;

  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} ` +
         `A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} ` +
         `L ${x3.toFixed(1)} ${y3.toFixed(1)} ` +
         `A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x4.toFixed(1)} ${y4.toFixed(1)} Z`;
}

function renderCircularDiagram(list, subFilter='ALL'){
  const circularOrder = [
    'seol-gongchan', // 설공찬 (상단 12시)
    'hwaryeon',      // 화련
    'hale',          // 헤일
    'pavel',         // 파벨
    'kael',          // 카엘
    'vulcan',        // 발칸
    'bael',          // 바엘
    'ordo',          // 오르도
    'harmel',        // 하르멜
    'zephyr',        // 제피르
    'arens'          // 아렌스
  ];
  const total = circularOrder.length;
  const centerX = 400, centerY = 400, radius = 260;
  
  const charNodes = circularOrder.map((id, i) => {
    const c = char(id);
    const angle = (i / total) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { ...c, x, y, angle };
  });

  const nodeMap = Object.fromEntries(charNodes.map(n => [n.id, n]));

  // 4 Faction Sectors
  const factions = [
    { id: 'HUMAN', name: 'HUMAN (인간)', color: '#5d85ad', indices: [0] },
    { id: 'PLANT', name: 'PLANT (식목인)', color: '#4ea885', indices: [1, 2, 3] },
    { id: 'BEAST', name: 'BEAST (수인)', color: '#b89759', indices: [4, 5, 6] },
    { id: 'INSECT', name: 'INSECT (충인)', color: '#8274b3', indices: [7, 8, 9, 10] }
  ];

  const step = (2 * Math.PI) / total;
  const innerR = 195, outerR = 325;

  const sectorsSvg = factions.map(f => {
    const minIdx = Math.min(...f.indices);
    const maxIdx = Math.max(...f.indices);

    const startAngle = (minIdx / total) * 2 * Math.PI - Math.PI / 2 - step / 2;
    const endAngle = (maxIdx / total) * 2 * Math.PI - Math.PI / 2 + step / 2;

    const pathD = describeAnnularSector(centerX, centerY, innerR, outerR, startAngle, endAngle);

    const midAngle = (startAngle + endAngle) / 2;
    const lx = centerX + 165 * Math.cos(midAngle);
    const ly = centerY + 165 * Math.sin(midAngle);

    return `<g class="rel-sector" data-faction="${f.id}">
      <path d="${pathD}" fill="${f.color}" fill-opacity="0.09" stroke="${f.color}" stroke-width="1.2" stroke-opacity="0.3" style="transition: all 0.35s ease;" />
      <text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="central" fill="${f.color}" font-size="14" font-weight="bold" letter-spacing="1.5" opacity="0.75" style="pointer-events:none">${f.name}</text>
    </g>`;
  }).join('');

  const typeColors = {
    HOSTILE: '#b55374',
    ALLY: '#4ea885',
    WATCH: '#b89759',
    PROTECT: '#5d85ad'
  };

  const selectedConnectedIds = new Set();
  if (subFilter !== 'ALL') {
    selectedConnectedIds.add(subFilter);
    RELATIONS.forEach(r => {
      if (r.type === 'TRADE' || r.type === 'UNKNOWN') return;
      if (r.from === subFilter) selectedConnectedIds.add(r.to);
      if (r.to === subFilter) selectedConnectedIds.add(r.from);
    });
  }

  const pairMap = new Map();
  list.forEach((r, idx) => {
    if (r.type === 'TRADE' || r.type === 'UNKNOWN') return;
    const pairKey = [r.from, r.to].sort().join('--');
    if (!pairMap.has(pairKey)) {
      pairMap.set(pairKey, { ...r, originalIdx: idx });
    } else if (subFilter !== 'ALL' && r.from === subFilter) {
      pairMap.set(pairKey, { ...r, originalIdx: idx });
    }
  });

  const linesSvg = Array.from(pairMap.values()).map((r, idx) => {
    const f = nodeMap[r.from];
    const t = nodeMap[r.to];
    if (!f || !t) return '';
    const color = typeColors[r.type] || '#ff85b4';

    // Stop lines at circle outer boundary (radius 30px)
    const dx = t.x - f.x;
    const dy = t.y - f.y;
    const dist = Math.hypot(dx, dy) || 1;
    const rOffset = 30;

    const fx = f.x + (dx / dist) * rOffset;
    const fy = f.y + (dy / dist) * rOffset;
    const tx = t.x - (dx / dist) * rOffset;
    const ty = t.y - (dy / dist) * rOffset;

    let angleDiff = Math.abs(f.angle - t.angle);
    if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;

    const pullRatio = 0.55 * Math.pow(Math.sin(angleDiff / 2), 1.8);
    const mx = (f.x + t.x) / 2;
    const my = (f.y + t.y) / 2;
    const cx = mx * (1 - pullRatio) + centerX * pullRatio;
    const cy = my * (1 - pullRatio) + centerY * pullRatio;

    const isConnectedToSub = (subFilter !== 'ALL') && (r.from === subFilter || r.to === subFilter);
    const initialOpacity = isConnectedToSub ? '0.85' : '0';
    const isDashed = r.type === 'HOSTILE' || r.type === 'WATCH';
    const dashAttr = isDashed ? ' stroke-dasharray="5 4"' : '';

    return `<path class="rel-link-path" data-from="${f.id}" data-to="${t.id}" data-rel-type="${r.type}" data-rel-index="${idx}"
      d="M ${fx.toFixed(1)} ${fy.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${tx.toFixed(1)} ${ty.toFixed(1)}"
      stroke="${color}" stroke-width="${isConnectedToSub ? '1.8' : '1.2'}"${dashAttr} fill="none" opacity="${initialOpacity}"
      style="transition: opacity 0.35s ease, stroke-width 0.25s ease;" />`;
  }).join('');

  const nodesSvg = charNodes.map(n => {
    const labelRadius = radius + 48;
    const labelX = centerX + labelRadius * Math.cos(n.angle);
    const labelY = centerY + labelRadius * Math.sin(n.angle);
    const textAnchor = Math.abs(n.x - centerX) < 20 ? 'middle' : (n.x > centerX ? 'start' : 'end');
    
    const isSelected = subFilter === n.id;
    const isConnected = selectedConnectedIds.has(n.id);
    
    let opacityVal = '1';
    if (subFilter !== 'ALL') {
      if (isSelected) opacityVal = '1';
      else if (isConnected) opacityVal = '0.85';
      else opacityVal = '0.2';
    }

    const scaleVal = isSelected ? '1.32' : '1';
    const radiusR = isSelected ? '34' : '28';
    const strokeW = isSelected ? '4.5' : '3';

    return `<g class="rel-node ${isSelected ? 'active-node' : ''}" data-node-id="${n.id}" style="cursor:pointer; opacity: ${opacityVal}; transform-origin: ${n.x.toFixed(1)}px ${n.y.toFixed(1)}px; transform: scale(${scaleVal}); transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.35s ease;">
      <circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${radiusR}" fill="#07101b" stroke="${n.accent}" stroke-width="${strokeW}" style="filter: drop-shadow(0 0 ${isSelected ? '12px' : '5px'} ${n.accent}); transition: all 0.3s" />
      <clipPath id="clip-${n.id}">
        <circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${isSelected ? '31' : '25'}" />
      </clipPath>
      <image href="${esc(n.mainImage)}" x="${(n.x - (isSelected ? 31 : 25)).toFixed(1)}" y="${(n.y - (isSelected ? 31 : 25)).toFixed(1)}" width="${isSelected ? 62 : 50}" height="${isSelected ? 62 : 50}" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip-${n.id})" />
      <text x="${labelX.toFixed(1)}" y="${(labelY + 4).toFixed(1)}" text-anchor="${textAnchor}" fill="${n.accent}" font-size="${isSelected ? '14' : '12'}" font-weight="${isSelected ? '900' : 'bold'}" letter-spacing="1.5">${esc(n.krName || n.displayName)}</text>
    </g>`;
  }).join('');

  return `<div class="circular-wrapper" style="position:relative; width:100%; margin-top:20px;">
    <div class="rel-map-legend" style="position:absolute; top:0; left:0; z-index:10; background:rgba(5,11,21,0.85); border:1px solid var(--soft); backdrop-filter:blur(8px); padding:12px 14px; border-radius:4px; font-size:11px; display:flex; flex-direction:column; gap:7px; pointer-events:none; box-shadow:0 8px 24px rgba(0,0,0,0.5);">
      <span style="color:var(--blue); font-size:10px; letter-spacing:0.2em; font-weight:bold; margin-bottom:2px;">COLOR LEGEND</span>
      <span style="display:flex; align-items:center; gap:8px; color:var(--text);"><i style="width:16px; height:0; border-top:2px dashed #b55374; display:inline-block; flex-shrink:0;"></i> HOSTILE (적대 / 제거)</span>
      <span style="display:flex; align-items:center; gap:8px; color:var(--text);"><i style="width:16px; height:0; border-top:2px solid #4ea885; display:inline-block; flex-shrink:0;"></i> ALLY (협력 / 신뢰 / 우호)</span>
      <span style="display:flex; align-items:center; gap:8px; color:var(--text);"><i style="width:16px; height:0; border-top:2px dashed #b89759; display:inline-block; flex-shrink:0;"></i> WATCH (경계 / 관찰 / 흥미)</span>
      <span style="display:flex; align-items:center; gap:8px; color:var(--text);"><i style="width:16px; height:0; border-top:2px solid #5d85ad; display:inline-block; flex-shrink:0;"></i> PROTECT (보호 / 은인)</span>
    </div>

    <div class="circular-container" style="position:relative; width:100%; max-width:840px; margin:0 auto">
      <svg viewBox="0 0 800 800" style="width:100%; height:auto; overflow:visible">
        <circle cx="400" cy="400" r="260" fill="none" stroke="rgba(126,159,196,0.15)" stroke-width="1" stroke-dasharray="6 6" />
        <circle cx="400" cy="400" r="140" fill="none" stroke="rgba(126,159,196,0.06)" stroke-width="1" />
        <g class="rel-sectors-group">${sectorsSvg}</g>
        <g class="rel-lines-group">${linesSvg}</g>
        <g class="rel-nodes-group">${nodesSvg}</g>
      </svg>
      <div id="relHoverInfo" class="rel-hover-card" style="margin-top:20px; height:240px; border:1px solid var(--soft); background:rgba(5,11,21,0.85); padding:16px; text-align:center; transition:all 0.3s; border-radius:4px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:center; align-items:center;">
        <span style="color:var(--muted); font-size:12px; letter-spacing:0.18em">💡 캐릭터 얼굴 노드를 마우스로 가리키거나 클릭하면 연결된 관계 선과 상세 내역이 나타납니다.</span>
      </div>
    </div>
  </div>`;
}

function relationsPage(animateKey='relations'){
  setRouteMotion(animateKey);
  setAccent({accent:'#ff85b4'});
  const subFilter = state.relationSubjectFilter || 'ALL';
  const typeFilter = state.relationTypeFilter || 'ALL';
  const viewMode = state.relationViewMode || 'CIRCULAR';

  let list = RELATIONS;
  if(subFilter !== 'ALL') {
    list = list.filter(r => r.from === subFilter || r.to === subFilter);
  }
  if(typeFilter !== 'ALL') {
    list = list.filter(r => r.type === typeFilter);
  }

  const types = ['ALL', 'ALLY', 'WATCH', 'HOSTILE', 'PROTECT'];

  const contentMarkup = viewMode === 'CIRCULAR'
    ? renderCircularDiagram(RELATIONS, subFilter)
    : `<div class="relation-list" style="margin-top:24px">
        ${list.length ? list.map(r => {
          const f = char(r.from), t = char(r.to);
          return `<article class="relation-card ${r.type.toLowerCase()}" style="--from:${f.accent};--to:${t.accent}">
            <div class="flow-line">
              <a href="#character/${f.id}" style="color:var(--text);font-weight:bold"><b>${esc(f.displayName)}</b></a>
              <i>→</i>
              <a href="#character/${t.id}" style="color:var(--text);font-weight:bold"><b>${esc(t.displayName)}</b></a>
            </div>
            <div class="rel-meta">
              <span>${esc(r.type)} / ${esc(relationTypeLabel(r.type))}</span>
              <span>INTENSITY ${r.intensity}/5</span>
            </div>
            <strong class="rel-label">${esc(r.label)}</strong>
            <p>${esc(r.note)}</p>
          </article>`;
        }).join('') : `<article class="relation-card"><strong class="rel-label">NO MATCHING RELATION RECORD</strong><p>선택한 조건에 해당하는 관계 기록이 없습니다.</p></article>`}
      </div>`;

  const filtersMarkup = viewMode === 'CARD' ? `
    <section class="gallery-filter" style="margin-top:12px">
      <p class="panel-title">SUBJECT FILTER</p>
      <div>
        <button data-rel-sub="ALL" class="${subFilter==='ALL'?'active':''}">ALL</button>
        ${CHARACTERS.map(c=>`<button data-rel-sub="${c.id}" style="--chip:${c.accent}" class="${subFilter===c.id?'active':''}">${esc(c.displayName)}</button>`).join('')}
      </div>
    </section>

    <section class="gallery-filter" style="margin-top:12px">
      <p class="panel-title">RELATION TYPE</p>
      <div>
        ${types.map(t=>`<button data-rel-type="${t}" class="${typeFilter===t?'active':''}">${t} ${t!=='ALL'?`(${relationTypeLabel(t)})`:''}</button>`).join('')}
      </div>
    </section>` : '';

  view.innerHTML = `<section class="panel">
    <div class="head">
      <div>${markTitle('RELATION NETWORK', 'SPECIES INTERACTION MATRIX')}</div>
      <div class="file-class">RELATION ARCHIVE // ${RELATIONS.length} TOTAL LINKS</div>
    </div>

    <section class="gallery-filter">
      <p class="panel-title">VIEW LAYOUT MODE</p>
      <div>
        <button data-rel-view="CIRCULAR" class="${viewMode==='CIRCULAR'?'active':''}">CIRCULAR MAP (원형 배치 관계도)</button>
        <button data-rel-view="CARD" class="${viewMode==='CARD'?'active':''}">CARD LIST (카드 목록)</button>
      </div>
    </section>
    
    ${filtersMarkup}

    ${contentMarkup}
  </section>`;

  $$('[data-rel-view]').forEach(b => b.onclick = () => {
    state.relationViewMode = b.dataset.relView;
    relationsPage('relations');
  });
  $$('[data-rel-sub]').forEach(b => b.onclick = () => {
    state.relationSubjectFilter = b.dataset.relSub;
    relationsPage('relations');
  });
  $$('[data-rel-type]').forEach(b => b.onclick = () => {
    state.relationTypeFilter = b.dataset.relType;
    relationsPage('relations');
  });

  if (viewMode === 'CIRCULAR') {
    bindCircularEvents(RELATIONS);
  }
}

function bindCircularEvents(allRelations) {
  const hoverCard = $('#relHoverInfo');
  
  const buildHoverHtml = (c, rels, titleSuffix) => {
    return `<div style="width:100%; height:100%; display:flex; flex-direction:column; text-align:left;">
      <strong style="color:${c.accent}; font-size:14px; display:block; margin-bottom:8px; flex-shrink:0;">${esc(c.displayName)} (${esc(c.type)}) ${titleSuffix} (${rels.length}건)</strong>
      <div class="rel-hover-scroll" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:6px; overflow-y:auto; flex:1; padding-right:6px;">
        ${rels.map(r => {
          const partnerId = r.from === c.id ? r.to : r.from;
          const partner = char(partnerId);
          const isOutgoing = r.from === c.id;
          return `<div style="border:1px solid var(--soft); background:rgba(3,8,16,0.65); padding:6px 10px; border-radius:4px; font-size:12px; line-height:1.4;">
            <span style="color:${c.accent}; font-weight:bold">${esc(c.krName || c.displayName)}</span> 
            <span style="color:var(--accent); margin:0 4px">${isOutgoing ? '➔' : '⬅'}</span> 
            <span style="color:${partner.accent}; font-weight:bold">${esc(partner.krName || partner.displayName)}</span> 
            <b style="color:var(--text); margin-left:6px;">[${esc(r.type)} / ${esc(r.label)}]</b>
            <p style="margin:2px 0 0; color:var(--muted); font-size:11px; word-break:keep-all;">${esc(r.note)}</p>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  };

  const activeSub = state.relationSubjectFilter || 'ALL';
  if (activeSub !== 'ALL') {
    const subConnectedIds = new Set([activeSub]);
    allRelations.forEach(r => {
      if (r.type === 'TRADE' || r.type === 'UNKNOWN') return;
      if (r.from === activeSub) subConnectedIds.add(r.to);
      if (r.to === activeSub) subConnectedIds.add(r.from);
    });

    $$('.rel-link-path').forEach(path => {
      const isConnectedToSub = path.dataset.from === activeSub || path.dataset.to === activeSub;
      path.style.opacity = isConnectedToSub ? '0.85' : '0';
      path.style.strokeWidth = isConnectedToSub ? '1.8' : '1.2';
    });

    $$('.rel-node').forEach(n => {
      const nodeId = n.dataset.nodeId;
      if (nodeId === activeSub) {
        n.style.opacity = '1';
        n.style.transform = 'scale(1.32)';
      } else if (subConnectedIds.has(nodeId)) {
        n.style.opacity = '0.85';
        n.style.transform = 'scale(1)';
      } else {
        n.style.opacity = '0.2';
        n.style.transform = 'scale(1)';
      }
    });

    const c = char(activeSub);
    const rels = allRelations.filter(r => r.from === activeSub && r.type !== 'TRADE' && r.type !== 'UNKNOWN');
    if (rels.length) {
      hoverCard.innerHTML = buildHoverHtml(c, rels, '선택 관계망');
    }
  } else {
    $$('.rel-link-path').forEach(path => {
      path.style.opacity = '0';
    });
    $$('.rel-node').forEach(n => {
      n.style.opacity = '1';
      n.style.transform = 'scale(1)';
    });
  }

  $$('.rel-node').forEach(node => {
    const id = node.dataset.nodeId;
    const c = char(id);

    node.addEventListener('mouseenter', () => {
      // Do NOT modify relation lines on mouse hover (lines are shown ONLY when selected)
      node.style.transform = 'scale(1.32)';
      node.style.opacity = '1';
    });

    node.addEventListener('mouseleave', () => {
      const currentSub = state.relationSubjectFilter || 'ALL';
      const subConnectedIds = new Set();
      if (currentSub !== 'ALL') {
        subConnectedIds.add(currentSub);
        allRelations.forEach(r => {
          if (r.type === 'TRADE' || r.type === 'UNKNOWN') return;
          if (r.from === currentSub) subConnectedIds.add(r.to);
          if (r.to === currentSub) subConnectedIds.add(r.from);
        });
      }

      $$('.rel-node').forEach(n => {
        const nodeId = n.dataset.nodeId;
        if (currentSub !== 'ALL') {
          if (nodeId === currentSub) {
            n.style.opacity = '1';
            n.style.transform = 'scale(1.32)';
          } else if (subConnectedIds.has(nodeId)) {
            n.style.opacity = '0.85';
            n.style.transform = 'scale(1)';
          } else {
            n.style.opacity = '0.2';
            n.style.transform = 'scale(1)';
          }
        } else {
          n.style.opacity = '1';
          n.style.transform = 'scale(1)';
        }
      });
    });

    node.addEventListener('click', () => {
      if (state.relationSubjectFilter === id) {
        state.relationSubjectFilter = 'ALL';
      } else {
        state.relationSubjectFilter = id;
      }
      relationsPage('relations');
    });
  });
}

function render(){
  const [r,p]=(location.hash||'#world').slice(1).split('/');
  $$('nav a').forEach(a=>a.classList.toggle('active',a.dataset.nav===r||(r==='character'&&a.dataset.nav==='characters')));
  if(r==='characters')characters();
  else if(r==='relations')relationsPage();
  else if(r==='gallery')gallery();
  else if(r==='character')charPage(p);
  else world();
  requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'auto'}));
}
function musicInit(){tracks.innerHTML=BGM_TRACKS.map((t,i)=>`<option value="${i}">${esc(t.title)}</option>`).join(''); loadTrack(0,true); updateBarBg(vol); updateBarBg(bar);}
function loadTrack(i,auto=!audio.paused){
  state.track=(i+BGM_TRACKS.length)%BGM_TRACKS.length;
  const t=BGM_TRACKS[state.track];
  audio.src=t.src;
  $('#trackTitle').textContent=t.title;
  $('#trackMood').textContent=t.mood;
  tracks.value=state.track;
  bar.value=0;
  updateBarBg(bar);
  if(auto){
    const p = audio.play();
    if(p !== undefined){
      p.catch(()=>{
        const playOnUserInteraction = (e)=>{
          if(e && e.target && e.target.closest('#musicDock')){
            document.removeEventListener('click', playOnUserInteraction);
            document.removeEventListener('touchend', playOnUserInteraction);
            document.removeEventListener('keydown', playOnUserInteraction);
            return;
          }
          audio.play().then(()=>{
            document.removeEventListener('click', playOnUserInteraction);
            document.removeEventListener('touchend', playOnUserInteraction);
            document.removeEventListener('keydown', playOnUserInteraction);
          }).catch(()=>{});
        };
        document.addEventListener('click', playOnUserInteraction);
        document.addEventListener('touchend', playOnUserInteraction);
        document.addEventListener('keydown', playOnUserInteraction);
      });
    }
  }
}
play.onclick=()=>audio.paused?audio.play().catch(()=>{}):audio.pause(); audio.onplay=()=>play.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="20" height="20" fill="currentColor"><path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/></svg>`; audio.onpause=()=>play.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="20" height="20" fill="currentColor"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg>`; $('#next').onclick=()=>loadTrack(state.track+1,true); $('#prev').onclick=()=>loadTrack(state.track-1,true); tracks.onchange=e=>loadTrack(Number(e.target.value),true); vol.oninput=e=>{audio.volume=Number(e.target.value); updateBarBg(vol);}; bar.oninput=e=>{if(audio.duration) { audio.currentTime=audio.duration*Number(e.target.value)/1000; updateBarBg(bar); }}; audio.ontimeupdate=()=>{if(audio.duration) { bar.value=Math.floor(audio.currentTime/audio.duration*1000); updateBarBg(bar); }}; audio.onended=()=>loadTrack(state.track+1,true); audio.volume=.45; musicInit(); window.onhashchange=render; window.addEventListener('load', render); render();


// Collapsible BGM dock for both desktop and mobile.
(function initMusicCollapse(){
  const dock = document.getElementById('musicDock');
  const toggle = document.getElementById('musicCollapse');
  if (!dock || !toggle) return;
  const mq = window.matchMedia('(max-width: 650px)');

  const setState = (collapsed) => {
    dock.classList.toggle('is-collapsed', collapsed);
    document.body.classList.toggle('player-collapsed', collapsed);
    document.body.classList.toggle('player-expanded', !collapsed);
    toggle.setAttribute('aria-expanded', String(!collapsed));
    toggle.textContent = collapsed ? '▴' : '▾';
    toggle.setAttribute('aria-label', collapsed ? 'BGM player expand' : 'BGM player collapse');
  };

  const sync = () => {
    if (!dock.dataset.touched) {
      setState(mq.matches);
    } else {
      setState(dock.classList.contains('is-collapsed'));
    }
  };

  toggle.addEventListener('click', () => {
    dock.dataset.touched = '1';
    setState(!dock.classList.contains('is-collapsed'));
  });

  mq.addEventListener?.('change', sync);
  window.addEventListener('resize', sync);
  sync();
})();
