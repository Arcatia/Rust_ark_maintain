(() => {
  'use strict';

  const INTRO_DURATION = 11250;
  const WORLD_TARGET = 'world.html#world';
  const DEFAULT_ENTRY = 'hale';

  const ALIASES = {
    seol: 'seol-gongchan',
    gongchan: 'seol-gongchan',
    seol_gongchan: 'seol-gongchan',
    hwaryun: 'hwaryeon',
    hwar: 'hwaryeon',
    parvel: 'pavel'
  };

  const FALLBACK_CHARACTERS = [
    { id: 'hale', enName: 'HALE', krName: '헤일', type: 'PLANT / HYDRANGEA', species: 'PLANT', role: 'HYDRANGEA', accent: '#9b8cff', danger: 'A', status: 'ACTIVE', affirm: 'VERIFIED', clearance: 'A-7 / STRATEGY NODE', scan: 'BIO SIGNAL COMPLETE', archiveId: 'RA-P-05-HALE', mainImage: 'assets/images/hale/hale_01.png', summary: '식물 해방군 소속 전략관.', quote: '"좋은데요. 실패할 부분이 너무 잘 보여서."', metrics: { threat: 8, stability: 6, affinity: 4, control: 10 } }
  ];

  function getCharactersFromData() {
    // 핵심 수정: window.CHARACTERS가 아니라 data.js의 `const CHARACTERS = [...]`를 직접 읽는다.
    try {
      if (typeof CHARACTERS !== 'undefined' && Array.isArray(CHARACTERS) && CHARACTERS.length) return CHARACTERS;
    } catch (_) {}

    try {
      if (typeof RUST_ARK_CHARACTERS !== 'undefined' && Array.isArray(RUST_ARK_CHARACTERS) && RUST_ARK_CHARACTERS.length) return RUST_ARK_CHARACTERS;
    } catch (_) {}

    try {
      if (typeof RUSTARK_CHARACTERS !== 'undefined' && Array.isArray(RUSTARK_CHARACTERS) && RUSTARK_CHARACTERS.length) return RUSTARK_CHARACTERS;
    } catch (_) {}

    const windowCandidates = [
      window.CHARACTERS,
      window.RUST_ARK_CHARACTERS,
      window.RUSTARK_CHARACTERS,
      window.RUSTARK_DATA && window.RUSTARK_DATA.characters,
      window.RUSTARK && window.RUSTARK.characters,
      window.DATA && window.DATA.characters,
      window.APP_DATA && window.APP_DATA.characters
    ];

    for (const value of windowCandidates) {
      if (Array.isArray(value) && value.length) return value;
    }

    console.warn('[RUST ARK INTRO] data.js의 CHARACTERS를 찾지 못해 fallback을 사용합니다. script 로드 순서를 확인하세요: data.js → intro.js');
    return FALLBACK_CHARACTERS;
  }

  function normalizeId(value) {
    const id = String(value || '').trim().toLowerCase();
    return ALIASES[id] || id;
  }

  function pick(obj, keys, fallback = '') {
    for (const key of keys) {
      const value = key.split('.').reduce((acc, part) => {
        if (acc && Object.prototype.hasOwnProperty.call(acc, part)) return acc[part];
        return undefined;
      }, obj);

      if (value !== undefined && value !== null && String(value).trim() !== '') return value;
    }
    return fallback;
  }

  function firstGalleryImage(raw) {
    if (!Array.isArray(raw.gallery)) return '';
    const found = raw.gallery.find(item => item && item.type !== 'video' && (item.src || item.thumb));
    return found ? (found.src || found.thumb || '') : '';
  }

  function image01FromId(id) {
    // 최후 fallback 전용. 실제로는 data.js의 mainImage를 우선 사용한다.
    const folder = id === 'seol-gongchan' ? 'seol_gongchan' : id;
    return `assets/images/${folder}/${folder}_01.png`;
  }

  function absoluteUrl(path) {
    const raw = String(path || '').trim();
    if (!raw) return '';
    if (/^(data:|https?:|blob:)/i.test(raw)) return raw;

    // 핵심 수정: CSS 변수 안 url()의 상대경로가 css/ 기준으로 꼬이지 않도록
    // HTML 문서 기준 절대 URL로 바꿔 넣는다.
    return new URL(raw, document.baseURI).href;
  }

  function cssUrl(path) {
    const url = absoluteUrl(path);
    return `url("${url.replace(/"/g, '%22')}")`;
  }

  function normalizeCharacter(raw) {
    const id = normalizeId(pick(raw, ['id', 'slug', 'key', 'code'], DEFAULT_ENTRY));
    const fallback = FALLBACK_CHARACTERS.find(character => character.id === id) || FALLBACK_CHARACTERS[0];
    const metrics = raw.metrics || fallback.metrics || {};

    return {
      id,
      enName: pick(raw, ['enName', 'displayName', 'display_name', 'nameEn', 'englishName', 'name'], fallback.enName || id).toString().toUpperCase(),
      krName: pick(raw, ['krName', 'koName', 'koreanName', 'name'], fallback.krName || ''),
      type: pick(raw, ['type', 'class'], fallback.type || ''),
      species: pick(raw, ['species', 'race'], fallback.species || ''),
      role: pick(raw, ['role', 'job', 'position'], fallback.role || ''),
      accent: pick(raw, ['accent', 'theme', 'themeColor', 'color', 'mainColor', 'colors.accent', 'colors.main'], fallback.accent || '#39ff88'),
      danger: pick(raw, ['danger', 'threat', 'risk'], fallback.danger || 'VERIFIED'),
      status: pick(raw, ['status'], fallback.status || 'ACTIVE'),
      affirm: pick(raw, ['affirm'], fallback.affirm || 'VERIFIED'),
      clearance: pick(raw, ['clearance'], fallback.clearance || ''),
      scan: pick(raw, ['scan'], fallback.scan || 'SCAN COMPLETE'),
      archiveId: pick(raw, ['archiveId', 'archiveID', 'idCode'], fallback.archiveId || id.toUpperCase()),
      affiliation: pick(raw, ['affiliation', 'faction'], fallback.affiliation || ''),
      summary: pick(raw, ['summary', 'intro', 'desc', 'description'], fallback.summary || ''),
      quote: pick(raw, ['quote', 'line', 'tagline'], fallback.quote || ''),
      // data.js의 mainImage가 01번 파일을 정확히 들고 있으므로 최우선 사용.
      image: pick(raw, ['mainImage', 'introImage', 'image', 'portrait'], firstGalleryImage(raw) || fallback.mainImage || image01FromId(id)),
      metrics: {
        threat: Number(metrics.threat ?? fallback.metrics?.threat ?? 5),
        stability: Number(metrics.stability ?? fallback.metrics?.stability ?? 5),
        affinity: Number(metrics.affinity ?? fallback.metrics?.affinity ?? 5),
        control: Number(metrics.control ?? fallback.metrics?.control ?? 5)
      }
    };
  }

  function buildCharacterMap() {
    const map = new Map();

    FALLBACK_CHARACTERS.forEach(raw => {
      const character = normalizeCharacter(raw);
      map.set(character.id, character);
    });

    getCharactersFromData().forEach(raw => {
      const character = normalizeCharacter(raw);
      map.set(character.id, { ...(map.get(character.id) || {}), ...character });
    });

    return map;
  }

  function getEntryId() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('entry') || params.get('id') || params.get('character');
    const fromHash = window.location.hash.replace(/^#/, '');
    return normalizeId(fromQuery || fromHash || DEFAULT_ENTRY);
  }

  function hexToRgb(color) {
    const value = String(color || '').trim();
    if (/^rgb/i.test(value)) {
      const matched = value.match(/\d+(?:\.\d+)?/g);
      if (matched && matched.length >= 3) return matched.slice(0, 3).map(Number);
    }

    const clean = value.replace('#', '');
    if (clean.length === 3) return clean.split('').map(char => parseInt(char + char, 16));
    if (clean.length >= 6) return [parseInt(clean.slice(0, 2), 16), parseInt(clean.slice(2, 4), 16), parseInt(clean.slice(4, 6), 16)];
    return [57, 255, 136];
  }

  function mixColor(color, amount = 0.55) {
    const [r, g, b] = hexToRgb(color);
    const mix = value => Math.round(value + (255 - value) * amount);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach(node => {
      node.textContent = value == null ? '' : String(value);
    });
  }

  function metricToPercent(value) {
    return Math.max(0, Math.min(100, Math.round(Number(value || 0) * 10)));
  }

  function setStat(selector, metricValue) {
    const node = document.querySelector(selector);
    if (!node) return;

    const percent = metricToPercent(metricValue);
    node.style.setProperty('--w', `${percent}%`);

    const label = node.querySelector('b');
    if (label) label.textContent = String(metricValue);
  }

  function applyCssVars(character) {
    const main = character.accent || '#39ff88';
    const sub = mixColor(main, 0.58);
    const accentText = mixColor(main, 0.72);
    const image = cssUrl(character.image);

    // CSS에 .ra-intro { --intro-image: ... }가 있어서 :root만 세팅하면 덮인다.
    // 그래서 html과 .ra-intro 둘 다에 직접 박아 둔다.
    [document.documentElement, document.querySelector('.ra-intro')].filter(Boolean).forEach(target => {
      target.style.setProperty('--main', main);
      target.style.setProperty('--accent', main);
      target.style.setProperty('--sub', sub);
      target.style.setProperty('--accent-text', accentText);
      target.style.setProperty('--intro-image', image);
    });

    const portrait = document.querySelector('.ra-portrait');
    if (portrait) {
      // 최종 방어선: CSS 변수 해석이 브라우저/경로에서 꼬여도 직접 backgroundImage를 덮는다.
      portrait.style.backgroundImage = image;
    }
  }

  function applyIntro(character) {
    applyCssVars(character);

    const intro = document.querySelector('.ra-intro');
    const board = document.querySelector('.ra-board');
    if (intro) intro.dataset.entry = character.id;
    if (board) board.dataset.badge = character.type || `${character.species} / ${character.role}`;

    setText('[data-intro-loading]', `LOADING ${character.id.toUpperCase()} ARCHIVE`);
    setText('[data-intro-log-1]', 'VERIFYING IMAGE FILE : 01');
    setText('[data-intro-log-2]', character.scan || `SCANNING ${character.species}`);
    setText('[data-intro-log-3]', `RESTORING DOSSIER : ${character.enName}`);
    setText('[data-intro-log-4]', 'OPENING WORLD ACCESS GATE');

    setText('[data-intro-eyebrow]', character.clearance || 'CHARACTER FILE / WORLD ENTRY');
    setText('[data-intro-name]', character.enName);
    setText('[data-intro-species]', character.type || character.species);
    setText('[data-intro-role]', character.role || character.affiliation || 'UNKNOWN');
    setText('[data-intro-status]', character.status || character.affirm || 'VERIFIED');
    setText('[data-intro-threat]', character.danger || 'UNKNOWN');
    setText('[data-intro-desc]', character.summary || character.affiliation || 'NO SUMMARY DATA.');
    setText('[data-intro-quote]', character.quote || '“WORLD ARCHIVE READY.”');

    setStat('[data-stat="tactic"]', character.metrics.control);
    setStat('[data-stat="affinity"]', character.metrics.affinity);
    setStat('[data-stat="control"]', character.metrics.stability);
  }

  function saveWorldEntry(character) {
    const payload = {
      id: character.id,
      accent: character.accent,
      name: character.enName,
      mode: 'world-relation'
    };

    try {
      sessionStorage.setItem('rustark-entry', JSON.stringify(payload));
      sessionStorage.setItem('rustark-world-relation', character.id);
      sessionStorage.setItem('rustark-world-accent', character.accent);
    } catch (error) {
      console.warn('[RUST ARK INTRO] sessionStorage 저장 실패', error);
    }
  }

  function goWorld(character) {
    saveWorldEntry(character);
    window.location.href = WORLD_TARGET;
  }

  function previewOnly() {
    const params = new URLSearchParams(window.location.search);
    return params.get('preview') === '1' || params.get('preview') === 'true';
  }

  const characterMap = buildCharacterMap();
  const entryId = getEntryId();
  const character = characterMap.get(entryId) || characterMap.get(DEFAULT_ENTRY) || Array.from(characterMap.values())[0];

  if (!characterMap.has(entryId)) {
    console.warn(`[RUST ARK INTRO] entry "${entryId}"를 찾지 못해 "${character.id}"로 대체합니다.`);
  }

  applyIntro(character);

  const skip = document.querySelector('[data-intro-skip]');
  if (skip) skip.addEventListener('click', () => goWorld(character), { once: true });

  if (!previewOnly()) {
    window.setTimeout(() => goWorld(character), INTRO_DURATION);
  }
})();
