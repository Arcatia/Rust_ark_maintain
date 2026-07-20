(() => {
  'use strict';

  const INTRO_DURATION = 11250;
  const WORLD_TARGET = 'world.html#world';
  const DEFAULT_ENTRY = 'hale';
  const FALLBACK_IMAGE_SUFFIX = '_01.png';

  const ALIASES = {
    seol: 'seol-gongchan',
    gongchan: 'seol-gongchan',
    seol_gongchan: 'seol-gongchan',
    hwaryun: 'hwaryeon',
    hwar: 'hwaryeon',
    parvel: 'pavel',
    pavel: 'pavel'
  };

  const FALLBACK_CHARACTERS = [
    { id: 'seol-gongchan', enName: 'SEOL GONGCHAN', krName: '설공찬', type: 'HUMAN / COMMANDER', species: 'HUMAN', role: 'COMMANDER', accent: '#b8c2d3', danger: 'A+', status: 'ACTIVE', affirm: 'COMMAND VERIFIED', clearance: 'A-7 / HUMAN NODE', scan: 'TACTICAL SCAN COMPLETE', archiveId: 'RA-H-01-GONGCHAN', mainImage: 'assets/images/seol_gongchan/seol_gongchan_01.jpg', summary: '인간 대항군 총사령관.', quote: '"이건 처벌이 아니라 방역이다."', metrics: { threat: 8, stability: 9, affinity: 2, control: 10 } },
    { id: 'hwaryeon', enName: 'HWARYEON', krName: '화련', type: 'PLANT / LOTUS', species: 'PLANT', role: 'LOTUS', accent: '#e68aa6', danger: 'B+', status: 'ACTIVE', affirm: 'OBSERVED', clearance: 'B-4 / BLOOM NODE', scan: 'EMOTIONAL SCAN PARTIAL', archiveId: 'RA-P-02-HWARYEON', mainImage: 'assets/images/hwaryeon/hwaryeon_01.jpg', summary: '연꽃 기반의 식물족 군락 소속 포식자.', quote: '"아아~ 예쁘다아~ 먹어도 돼?"', metrics: { threat: 9, stability: 3, affinity: 7, control: 2 } },
    { id: 'ordo', enName: 'ORDO', krName: '오르도', type: 'INSECT / LOCUST', species: 'INSECT', role: 'LOCUST', accent: '#7f8f22', danger: 'A', status: 'UNSTABLE', affirm: 'UNSTABLE CONFIRMED', clearance: 'A-3 / SWARM ALERT', scan: 'PATTERN BROKEN', archiveId: 'RA-I-03-ORDO', mainImage: 'assets/images/ordo/ordo_01.jpg', summary: '황충 군단 제1선봉대 지휘관.', quote: '"절멸은 낭비입니다. 쓸모 있는 것들은 길들여야죠."', metrics: { threat: 7, stability: 8, affinity: 4, control: 9 } },
    { id: 'zephyr', enName: 'ZEPHYR', krName: '제피르', type: 'INSECT / DRAGONFLY', species: 'INSECT', role: 'DRAGONFLY', accent: '#0084a8', danger: 'B+', status: 'ACTIVE', affirm: 'FIELD VERIFIED', clearance: 'B-6 / RECON NODE', scan: 'AERIAL SCAN COMPLETE', archiveId: 'RA-I-04-ZEPHYR', mainImage: 'assets/images/zephyr/zephyr_01.png', summary: '충인 진영 제1공중정찰대 제1관측반 반장.', quote: '"하늘은 거짓말을 하지 않아. 기록도 마찬가지고."', metrics: { threat: 8.5, stability: 9.5, affinity: 6.5, control: 9 } },
    { id: 'hale', enName: 'HALE', krName: '헤일', type: 'PLANT / HYDRANGEA', species: 'PLANT', role: 'HYDRANGEA', accent: '#9b8cff', danger: 'A', status: 'ACTIVE', affirm: 'VERIFIED', clearance: 'A-7 / STRATEGY NODE', scan: 'BIO SIGNAL COMPLETE', archiveId: 'RA-P-05-HALE', mainImage: 'assets/images/hale/hale_01.png', summary: '식물 해방군 소속 전략관.', quote: '"좋은데요. 실패할 부분이 너무 잘 보여서."', metrics: { threat: 8, stability: 6, affinity: 4, control: 10 } },
    { id: 'arens', enName: 'ARENS', krName: '아렌스', type: 'INSECT / ASSASSIN', species: 'INSECT', role: 'ASSASSIN', accent: '#d37c1f', danger: 'A+', status: 'CLASSIFIED', affirm: 'REDACTED', clearance: 'BLACK / COVERT NODE', scan: 'SIGNATURE MASKED', archiveId: 'RA-I-06-ARENS', mainImage: 'assets/images/arens/arens_01.png', summary: '암살자형 충인.', quote: '"비명은 짧게 부탁드립니다."', metrics: { threat: 9, stability: 8, affinity: 1, control: 8 } },
    { id: 'kael', enName: 'KAEL', krName: '카엘', type: 'BEAST / WOLF', species: 'BEAST', role: 'WOLF', accent: '#6f8398', danger: 'A', status: 'ACTIVE', affirm: 'CONFIRMED', clearance: 'A-5 / PACK NODE', scan: 'TRACKING COMPLETE', archiveId: 'RA-B-07-KAEL', mainImage: 'assets/images/kael/kael_01.png', summary: '잿빛발톱 부족의 현 족장.', quote: '"나의 송곳니와 발톱은 오직 부족을 위협하는 자에게만 향한다."', metrics: { threat: 8, stability: 6, affinity: 4, control: 9 } },
    { id: 'vulcan', enName: 'VULCAN', krName: '발칸', type: 'BEAST / BULLFIGHT', species: 'BEAST', role: 'BULLFIGHT', accent: '#c9361f', danger: 'A+', status: 'VOLATILE', affirm: 'IMPACT VERIFIED', clearance: 'A-9 / BREACH NODE', scan: 'KINETIC SCAN COMPLETE', archiveId: 'RA-B-08-VULCAN', mainImage: 'assets/images/vulcan/vulcan_01.png', summary: '적각단의 수장.', quote: '"네놈들의 피로, 이 땅의 모든 것을 다시 붉게 물들여주마."', metrics: { threat: 9, stability: 2, affinity: 3, control: 1 } },
    { id: 'harmel', enName: 'HARMEL', krName: '하르멜', type: 'INSECT / QUEEN BEE', species: 'INSECT', role: 'QUEEN BEE', accent: '#d99a1e', danger: 'S', status: 'MUTATED', affirm: 'MUTATION CONFIRMED', clearance: 'S-1 / HIVE CROWN', scan: 'TOXIN SCAN COMPLETE', archiveId: 'RA-I-09-HARMEL', mainImage: 'assets/images/harmel/harmel_01.png', summary: '말벌과 꿀벌의 특성을 모두 지닌 변이체 군주.', quote: '"나의 낙원에 온 걸 환영해. 여기서 너는… 가장 달콤한 꿈을 꾸게 될 거야."', metrics: { threat: 9, stability: 4, affinity: 8, control: 10 } },
    { id: 'pavel', enName: 'PAVEL', krName: '파벨', type: 'PLANT / OPIUM POPPY', species: 'PLANT', role: 'OPIUM POPPY', accent: '#9b174d', danger: 'A', status: 'ACTIVE', affirm: 'CAUTION VERIFIED', clearance: 'A-6 / SEDATION NODE', scan: 'NARCOTIC SCAN COMPLETE', archiveId: 'RA-P-10-PAVEL', mainImage: 'assets/images/parvel/parvel_01.png', summary: '향기를 알아챘을 땐, 이미 그의 꽃밭 안이었다.', quote: '"어디까지 버틸 수 있는지… 궁금해졌거든."', metrics: { threat: 6, stability: 9, affinity: 3, control: 10 } },
    { id: 'bael', enName: 'BAEL', krName: '바엘', type: 'BEAST / BLACK MAMBA', species: 'BEAST', role: 'BLACK MAMBA', accent: '#0f8f4f', danger: 'S', status: 'ACTIVE', affirm: 'BLACKLISTED', clearance: 'S-2 / VENOM NODE', scan: 'NEUROTOXIN SCAN COMPLETE', archiveId: 'RA-B-11-BAEL', mainImage: 'assets/images/bael/bael_01.png', summary: '그의 존재를 알아챘다면, 이미 그의 그림자 안이다.', quote: '"살아남아봐. 끝까지.."', metrics: { threat: 10, stability: 7, affinity: 2, control: 6 } }
  ];

  const DATA_KEYS = ['CHARACTERS', 'RUST_ARK_CHARACTERS', 'RUSTARK_CHARACTERS'];

  function getGlobalArray(name) {
    try {
      return Function(`try { return (typeof ${name} !== "undefined" && Array.isArray(${name})) ? ${name} : null; } catch (_) { return null; }`)();
    } catch (_) {
      return null;
    }
  }

  function getCharactersFromData() {
    for (const key of DATA_KEYS) {
      const value = getGlobalArray(key);
      if (value && value.length) return value;
    }

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

    return FALLBACK_CHARACTERS;
  }

  function normalizeId(value) {
    const id = String(value || '').trim().toLowerCase();
    return ALIASES[id] || id;
  }

  function pick(obj, keys, fallback = '') {
    for (const key of keys) {
      const value = key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
      if (value !== undefined && value !== null && String(value).trim() !== '') return value;
    }
    return fallback;
  }

  function findFallback(id) {
    return FALLBACK_CHARACTERS.find(character => character.id === id) || FALLBACK_CHARACTERS.find(character => character.id === DEFAULT_ENTRY) || FALLBACK_CHARACTERS[0];
  }

  function getFirstGalleryImage(raw) {
    if (!Array.isArray(raw.gallery)) return '';
    const item = raw.gallery.find(entry => entry && entry.type !== 'video' && (entry.src || entry.thumb));
    return item ? (item.src || item.thumb || '') : '';
  }

  function fallbackImageFromId(id) {
    const safeId = id === 'seol-gongchan' ? 'seol_gongchan' : id;
    return `assets/images/${safeId}/${safeId}${FALLBACK_IMAGE_SUFFIX}`;
  }

  function normalizeCharacter(raw) {
    const id = normalizeId(pick(raw, ['id', 'slug', 'key', 'code'], DEFAULT_ENTRY));
    const fallback = findFallback(id);
    const metrics = raw.metrics || fallback.metrics || {};

    return {
      id,
      displayName: pick(raw, ['enName', 'displayName', 'display_name', 'nameEn', 'englishName', 'name'], fallback.enName || fallback.displayName || fallback.name || id),
      krName: pick(raw, ['krName', 'koName', 'koreanName', 'name'], fallback.krName || ''),
      type: pick(raw, ['type', 'class', 'identityFields.1.1'], fallback.type || ''),
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
      image: pick(raw, ['mainImage', 'introImage', 'image', 'portrait'], getFirstGalleryImage(raw) || fallback.mainImage || fallbackImageFromId(id)),
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
    const hash = window.location.hash.replace(/^#/, '');
    return normalizeId(fromQuery || hash || DEFAULT_ENTRY);
  }

  function hexToRgb(color) {
    const value = String(color || '').trim();
    if (/^rgb/i.test(value)) {
      const matched = value.match(/\d+(?:\.\d+)?/g);
      if (matched && matched.length >= 3) return matched.slice(0, 3).map(Number);
    }

    const clean = value.replace('#', '');
    if (clean.length === 3) {
      return clean.split('').map(char => parseInt(char + char, 16));
    }
    if (clean.length >= 6) {
      return [parseInt(clean.slice(0, 2), 16), parseInt(clean.slice(2, 4), 16), parseInt(clean.slice(4, 6), 16)];
    }
    return [57, 255, 136];
  }

  function mixColor(color, amount = 0.55) {
    const [r, g, b] = hexToRgb(color);
    const mix = value => Math.round(value + (255 - value) * amount);
    return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
  }

  function cssUrl(value) {
    return `url("${String(value).replace(/"/g, '%22')}")`;
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach(node => {
      node.textContent = value == null ? '' : String(value);
    });
  }

  function setStat(selector, value) {
    const node = document.querySelector(selector);
    if (!node) return;

    const percent = Math.max(0, Math.min(100, Math.round(Number(value || 0) * 10)));
    node.style.setProperty('--w', `${percent}%`);

    const label = node.querySelector('b');
    if (label) label.textContent = String(value);
  }

  function applyRootVars(character) {
    const main = character.accent || '#39ff88';
    const sub = mixColor(main, 0.58);
    const accentText = mixColor(main, 0.72);
    const image = cssUrl(character.image);
    const targets = [document.documentElement, document.querySelector('.ra-intro')].filter(Boolean);

    targets.forEach(target => {
      target.style.setProperty('--main', main);
      target.style.setProperty('--accent', main);
      target.style.setProperty('--sub', sub);
      target.style.setProperty('--accent-text', accentText);
      target.style.setProperty('--intro-image', image);
    });
  }

  function applyIntro(character) {
    applyRootVars(character);

    const intro = document.querySelector('.ra-intro');
    const board = document.querySelector('.ra-board');
    if (intro) intro.dataset.entry = character.id;
    if (board) board.dataset.badge = character.type || `${character.species} / ${character.role}`;

    const nameText = String(character.enName || character.displayName || character.id || '').toUpperCase();
    const typeText = character.type || `${character.species || 'UNKNOWN'} / ${character.role || 'UNKNOWN'}`;
    const speciesText = typeText || character.species || 'UNKNOWN';
    const roleText = character.role || character.affiliation || 'UNKNOWN';

    setText('[data-intro-loading]', `LOADING ${character.id.toUpperCase()} ARCHIVE`);
    setText('[data-intro-log-1]', 'VERIFYING IMAGE FILE : 01');
    setText('[data-intro-log-2]', `SCANNING ${typeText}`);
    setText('[data-intro-log-3]', `RESTORING DOSSIER : ${nameText}`);
    setText('[data-intro-log-4]', `OPENING WORLD NODE : ${character.id}`);

    setText('[data-intro-eyebrow]', character.archiveId || 'CHARACTER FILE / WORLD ENTRY');
    setText('[data-intro-name]', nameText);
    setText('[data-intro-species]', speciesText);
    setText('[data-intro-role]', roleText);
    setText('[data-intro-status]', character.status || character.affirm || 'VERIFIED');
    setText('[data-intro-threat]', character.danger || 'VERIFIED');
    setText('[data-intro-desc]', character.summary || 'NO SUMMARY DATA');
    setText('[data-intro-quote]', character.quote || '');

    setStat('[data-stat="tactic"]', character.metrics.threat);
    setStat('[data-stat="affinity"]', character.metrics.affinity);
    setStat('[data-stat="control"]', character.metrics.control);
  }

  function saveWorldEntry(character) {
    const payload = {
      id: character.id,
      accent: character.accent,
      name: character.enName || character.displayName || character.id,
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
    window.location.href = WORLD_TARGET;
  }

  function shouldPreviewOnly() {
    const params = new URLSearchParams(window.location.search);
    return ['1', 'true', 'yes'].includes(String(params.get('preview')).toLowerCase());
  }

  function boot() {
    const map = buildCharacterMap();
    const requested = getEntryId();
    const character = map.get(requested) || map.get(DEFAULT_ENTRY) || Array.from(map.values())[0];

    if (!map.has(requested)) {
      console.warn(`[RUST ARK INTRO] entry '${requested}' not found. fallback '${character.id}' used.`);
    }

    applyIntro(character);

    const skip = document.querySelector('[data-intro-skip]');
    if (skip) {
      skip.addEventListener('click', () => goWorld(character), { once: true });
    }

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
