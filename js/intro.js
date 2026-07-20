(() => {
  'use strict';

  const INTRO_DURATION = 11250;
  const WORLD_TARGET = 'world.html#world';
  const IMAGE_INDEX = '01';

  const FALLBACK_ACCENTS = {
    'seol-gongchan': '#aeb7c2',
    'hwaryeon': '#ff4da6',
    'ordo': '#9aa33a',
    'zephyr': '#0084a8',
    'hale': '#9b8cff',
    'arens': '#4b1d8f',
    'kael': '#7e99b8',
    'vulcan': '#c9361f',
    'harmel': '#e6a51a',
    'pavel': '#9b174d',
    'bael': '#0f8f4f'
  };

  const SAMPLE_DATA = [
    {
      id: 'hale',
      name: '헤일',
      displayName: 'HALE',
      species: 'PLANT / HYDRANGEA',
      role: 'STRATEGIST',
      accent: '#9b8cff',
      threat: 'TACTICAL VARIABLE',
      summary: '수국계 식목인 전략관. 감정적 복수보다 구조적 해방을 우선하며, 폐허의 보급로와 전선 흐름을 기록한다.',
      quote: '“허술한 계획은 전쟁보다 먼저 사람을 죽인다.”'
    }
  ];

  function dataCandidates() {
    const candidates = [];

    // window에 노출된 데이터
    candidates.push(
      window.CHARACTERS,
      window.RUST_ARK_CHARACTERS,
      window.characters,
      window.RUSTARK_CHARACTERS,
      window.RUSTARK_DATA && window.RUSTARK_DATA.characters,
      window.RUSTARK && window.RUSTARK.characters,
      window.RUST_ARK && window.RUST_ARK.characters,
      window.DATA && window.DATA.characters,
      window.APP_DATA && window.APP_DATA.characters,
      window.RUSTARK_DATA,
      window.DATA
    );

    // 기존 data.js가 const CHARACTERS = [...] 처럼 선언된 경우.
    // const/let 전역은 window.CHARACTERS로는 안 잡히지만, 다음 스크립트에서 식별자로는 접근 가능하다.
    try { if (typeof CHARACTERS !== 'undefined') candidates.push(CHARACTERS); } catch (error) {}
    try { if (typeof RUST_ARK_CHARACTERS !== 'undefined') candidates.push(RUST_ARK_CHARACTERS); } catch (error) {}
    try { if (typeof RUSTARK_CHARACTERS !== 'undefined') candidates.push(RUSTARK_CHARACTERS); } catch (error) {}
    try { if (typeof DATA !== 'undefined') candidates.push(DATA, DATA && DATA.characters, DATA && DATA.CHARACTERS); } catch (error) {}
    try { if (typeof RUSTARK_DATA !== 'undefined') candidates.push(RUSTARK_DATA, RUSTARK_DATA && RUSTARK_DATA.characters); } catch (error) {}
    try { if (typeof APP_DATA !== 'undefined') candidates.push(APP_DATA, APP_DATA && APP_DATA.characters); } catch (error) {}
     console.warn(CHARACTERS);
    return candidates;
  }

  function getCharactersFromDataJs() {
    for (const candidate of dataCandidates()) {
      if (Array.isArray(candidate) && candidate.length) return candidate;
      if (candidate && Array.isArray(candidate.CHARACTERS)) return candidate.CHARACTERS;
      if (candidate && Array.isArray(candidate.characters)) return candidate.characters;
    }
    console.warn('[RUST ARK INTRO] data.js 캐릭터 배열을 찾지 못해 SAMPLE_DATA를 사용합니다.');
    return SAMPLE_DATA;
  }

  function normalizeId(value) {
    const id = String(value || '').trim().toLowerCase();
    return ALIASES[id] || id;
  }

  function pick(obj, paths, fallback = '') {
    for (const path of paths) {
      const value = path.split('.').reduce((acc, key) => {
        if (acc && Object.prototype.hasOwnProperty.call(acc, key)) return acc[key];
        return undefined;
      }, obj);
      if (value !== undefined && value !== null && String(value).trim() !== '') return value;
    }
    return fallback;
  }

  function firstArrayText(value) {
    if (Array.isArray(value)) {
      const found = value.find(item => typeof item === 'string' && item.trim());
      if (found) return found;
      const obj = value.find(item => item && typeof item === 'object');
      if (obj) return pick(obj, ['text', 'desc', 'description', 'summary', 'content', 'body'], '');
    }
    return '';
  }

  function findRawCharacter(id) {
    const list = getCharactersFromDataJs();
    const found = list.find(item => normalizeId(pick(item, ['id', 'slug', 'key', 'code'], '')) === id);
    if (found) return found;

    console.warn(`[RUST ARK INTRO] entry=${id} 캐릭터를 data.js에서 찾지 못해 hale 또는 첫 번째 캐릭터를 사용합니다.`);
    return list.find(item => normalizeId(pick(item, ['id', 'slug', 'key', 'code'], '')) === 'hale') || list[0];
  }

  function fallbackDisplayName(id, raw) {
    const name = pick(raw, ['displayName', 'display_name', 'enName', 'englishName', 'nameEn', 'title.en', 'name'], id);
    return String(name).toUpperCase();
  }

  function getSpecies(raw) {
    const species = pick(raw, [
      'species', 'race', 'type', 'category', 'profile.species', 'profile.race', 'meta.species'
    ], 'UNKNOWN');
    const subtype = pick(raw, ['subtype', 'speciesDetail', 'kind', 'profile.subtype'], '');
    if (subtype && !String(species).includes(String(subtype))) return `${species} / ${subtype}`;
    return String(species);
  }

  function getRole(raw) {
    return String(pick(raw, [
      'role', 'position', 'class', 'job', 'title', 'profile.role', 'profile.position', 'meta.role'
    ], 'UNKNOWN'));
  }

  function getAccent(raw, id) {
    return String(pick(raw, [
      'accent', 'theme', 'themeColor', 'color', 'mainColor', 'main_color', 'cssColor',
      'colors.accent', 'colors.main', 'profile.accent', 'profile.color', 'meta.accent'
    ], FALLBACK_ACCENTS[id] || '#39ff88'));
  }

  function getDescription(raw) {
    const direct = pick(raw, [
      'intro', 'desc', 'description', 'summary', 'short', 'bio',
      'profile.summary', 'profile.desc', 'profile.description',
      'story.summary', 'story.intro', 'identity', 'identityField'
    ], '');
    if (direct) return String(direct);

    const fromFeatures = firstArrayText(raw.features || raw.traits || raw.keywords || raw.records);
    if (fromFeatures) return String(fromFeatures);

    return 'data.js에 소개문을 추가하면 이 영역에 자동 출력됩니다.';
  }

  function getQuote(raw) {
    return String(pick(raw, [
      'quote', 'line', 'tagline', 'catchphrase', 'profile.quote', 'dialogue.sample', 'sampleLine'
    ], '“WORLD ARCHIVE READY.”'));
  }

  function getThreat(raw) {
    return String(pick(raw, [
      'threat', 'risk', 'danger', 'dangerLevel', 'profile.threat', 'meta.threat'
    ], 'TACTICAL VARIABLE'));
  }

  function getStatus(raw) {
    return String(pick(raw, ['status', 'state', 'profile.status', 'meta.status'], 'VERIFIED')).toUpperCase();
  }

  function getImage(id, raw) {
    // 요청사항: 사진은 각 캐릭터 01번으로 고정.
    // data.js의 image/mainImage/gallery가 있어도 인트로에서는 이 규칙을 우선한다.
    return `assets/images/${id}/${id}_${IMAGE_INDEX}.png`;
  }

  function normalizeCharacter(raw) {
    const id = normalizeId(pick(raw, ['id', 'slug', 'key', 'code'], 'hale'));
    return {
      id,
      name: fallbackDisplayName(id, raw),
      krName: String(pick(raw, ['name', 'krName', 'koName', 'koreanName', 'title.ko'], id)),
      species: getSpecies(raw),
      role: getRole(raw),
      accent: getAccent(raw, id),
      threat: getThreat(raw),
      status: getStatus(raw),
      desc: getDescription(raw),
      quote: getQuote(raw),
      image: getImage(id, raw),
      target: WORLD_TARGET,
      raw
    };
  }

  function selectedId() {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace('#', '');
    return normalizeId(params.get('entry') || params.get('id') || hash || 'hale');
  }

  function selectCharacter() {
    const requested = selectedId();
    const raw = findRawCharacter(requested);
    return normalizeCharacter(raw || SAMPLE_DATA[0]);
  }

  function hexToRgb(hex) {
    const clean = String(hex || '').replace('#', '').trim();
    if (clean.length === 3) {
      return [
        parseInt(clean[0] + clean[0], 16),
        parseInt(clean[1] + clean[1], 16),
        parseInt(clean[2] + clean[2], 16)
      ];
    }
    if (clean.length >= 6) {
      return [
        parseInt(clean.slice(0, 2), 16),
        parseInt(clean.slice(2, 4), 16),
        parseInt(clean.slice(4, 6), 16)
      ];
    }
    return [57, 255, 136];
  }

  function mixHex(hex, amount = 0.58) {
    const [r, g, b] = hexToRgb(hex);
    const mix = value => Math.round(value + (255 - value) * amount);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  }

  function setText(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
  }

  function setStat(selector, percent) {
    const node = document.querySelector(selector);
    if (!node) return;
    const value = Math.max(1, Math.min(100, Number(percent) || 50));
    node.style.setProperty('--w', `${value}%`);
    const label = node.querySelector('b');
    if (label) label.textContent = String(value);
  }

  function readStats(character) {
    const raw = character.raw || {};
    const tactic = pick(raw, ['stats.tactic', 'stat.tactic', 'tactic', 'ability.tactic'], '');
    const affinity = pick(raw, ['stats.affinity', 'stat.affinity', 'affinity', 'relationScore'], '');
    const control = pick(raw, ['stats.control', 'stat.control', 'control', 'ability.control'], '');

    if (tactic || affinity || control) {
      return {
        tactic: Number(tactic) || 70,
        affinity: Number(affinity) || 60,
        control: Number(control) || 65
      };
    }

    const source = `${character.id}:${character.role}:${character.species}`;
    let seed = 0;
    for (const char of source) seed += char.charCodeAt(0);
    return {
      tactic: Math.min(96, 58 + (seed % 35)),
      affinity: Math.min(88, 42 + ((seed * 7) % 41)),
      control: Math.min(90, 48 + ((seed * 11) % 37))
    };
  }

  function applyIntro(character) {
    const root = document.documentElement;
    const intro = document.querySelector('.ra-intro');
    const board = document.querySelector('.ra-board');

    root.style.setProperty('--main', character.accent);
    root.style.setProperty('--accent', character.accent);
    root.style.setProperty('--sub', mixHex(character.accent, 0.58));
    root.style.setProperty('--accent-text', mixHex(character.accent, 0.72));
    root.style.setProperty('--intro-image', `url("${character.image}")`);

    if (intro) intro.dataset.entry = character.id;
    if (board) board.dataset.badge = `${character.species} / ${character.role}`;

    setText('[data-intro-loading]', `LOADING ${character.id.toUpperCase()} ARCHIVE`);
    setText('[data-intro-log-1]', 'VERIFYING IMAGE FILE : 01');
    setText('[data-intro-log-2]', `SCANNING ${character.species}`);
    setText('[data-intro-log-3]', `RESTORING DOSSIER : ${character.name}`);
    setText('[data-intro-log-4]', 'OPENING WORLD ACCESS GATE');

    setText('[data-intro-eyebrow]', 'CHARACTER FILE / WORLD ENTRY');
    setText('[data-intro-name]', character.name);
    setText('[data-intro-species]', character.species);
    setText('[data-intro-role]', character.role);
    setText('[data-intro-status]', character.status);
    setText('[data-intro-threat]', character.threat);
    setText('[data-intro-desc]', character.desc);
    setText('[data-intro-quote]', character.quote);

    const stats = readStats(character);
    setStat('[data-stat="tactic"]', stats.tactic);
    setStat('[data-stat="affinity"]', stats.affinity);
    setStat('[data-stat="control"]', stats.control);
  }

  function saveWorldEntry(character) {
    const payload = {
      id: character.id,
      accent: character.accent,
      name: character.name,
      mode: 'world-relation'
    };
    try {
      sessionStorage.setItem('rustark-entry', JSON.stringify(payload));
      sessionStorage.setItem('rustark-world-relation', character.id);
      sessionStorage.setItem('rustark-world-accent', character.accent);
    } catch (error) {
      console.warn('[RUST ARK INTRO] sessionStorage unavailable', error);
    }
  }

  function goWorld(character) {
    saveWorldEntry(character);
    window.location.href = character.target;
  }

  function shouldPreviewOnly() {
    const params = new URLSearchParams(window.location.search);
    return params.get('preview') === '1' || params.get('preview') === 'true';
  }

  function boot() {
    const character = selectCharacter();
    applyIntro(character);

    const skip = document.querySelector('[data-intro-skip]');
    if (skip) skip.addEventListener('click', () => goWorld(character), { once: true });

    if (!shouldPreviewOnly()) {
      window.setTimeout(() => goWorld(character), INTRO_DURATION);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
