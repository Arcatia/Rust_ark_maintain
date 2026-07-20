(() => {
  'use strict';

  const INTRO_DURATION = 11250;
  const WORLD_TARGET = 'world.html#world';
  const IMAGE_SUFFIX = '_01.png';
  const ALIASES = {
    seol: 'seol-gongchan',
    gongchan: 'seol-gongchan',
    hwaryun: 'hwaryeon'
  };

  const FALLBACK_CHARACTERS = [
    { id:'seol-gongchan', name:'설공찬', displayName:'SEOL GONGCHAN', species:'HUMAN', role:'COMMANDER', accent:'#aeb7c2', threat:'COMMAND AUTH', desc:'인간 총사령관. 무너진 세계에서도 질서를 세우려는 인간 지휘관.', quote:'“전선은 감정으로 유지되지 않는다.”' },
    { id:'hwaryeon', name:'화련', displayName:'HWARYEON', species:'PLANT / LOTUS', role:'PREDATORY BLOOM', accent:'#ff4da6', threat:'FATAL BLOOM', desc:'연꽃계 식목인. 아름다운 표면 아래 포식성과 생존 본능을 감춘다.', quote:'“피어나는 건 순서가 없어.”' },
    { id:'ordo', name:'오르도', displayName:'ORDO', species:'INSECT / LOCUST', role:'VANGUARD COMMAND', accent:'#9aa33a', threat:'SWARM COMMAND', desc:'메뚜기계 충인 선봉 지휘관. 절멸보다 점령과 효율을 우선한다.', quote:'“태워 없애면 쓸 자원도 사라진다.”' },
    { id:'zephyr', name:'제피르', displayName:'ZEPHYR', species:'INSECT / DRAGONFLY', role:'SCOUT RECORDER', accent:'#0084a8', threat:'SKY SURVEY', desc:'잠자리계 충인 정찰기록병. 관측과 기록을 정밀 사격으로 연결한다.', quote:'“보이는 것은 이미 늦은 기록이다.”' },
    { id:'hale', name:'헤일', displayName:'HALE', species:'PLANT / HYDRANGEA', role:'STRATEGIST', accent:'#9b8cff', threat:'TACTICAL VARIABLE', desc:'수국계 식목인 전략관. 감정적 복수보다 구조적 해방을 우선하며, 폐허의 보급로와 전선 흐름을 기록한다.', quote:'“허술한 계획은 전쟁보다 먼저 사람을 죽인다.”' },
    { id:'arens', name:'아렌스', displayName:'ARENS', species:'INSECT / ASSASSIN', role:'ASSASSIN', accent:'#4b1d8f', threat:'NOCTURNAL KILL', desc:'암살형 충인. 전면전보다 그림자 속 균열과 침투를 선호한다.', quote:'“등 뒤가 비면 전선도 비는 거야.”' },
    { id:'kael', name:'카엘', displayName:'KAEL', species:'BEAST / WOLF', role:'TRIBE LEADER', accent:'#7e99b8', threat:'MOON INSTINCT', desc:'늑대 수인 부족장. 경계심이 깊지만 동족을 위해 협약도 선택한다.', quote:'“신뢰는 맹세가 아니라 생존으로 증명해.”' },
    { id:'vulcan', name:'발칸', displayName:'VULCAN', species:'BEAST / BULLFIGHT', role:'ARENA IMPACT', accent:'#c9361f', threat:'RED ARENA', desc:'투우장 같은 전장을 몰고 다니는 수인. 충돌 자체를 선언문으로 만든다.', quote:'“비켜. 길은 내가 만든다.”' },
    { id:'harmel', name:'하르멜', displayName:'HARMEL', species:'INSECT / QUEEN BEE', role:'HIVE AUTHORITY', accent:'#e6a51a', threat:'HIVE TOXIN', desc:'장수말벌과 꿀벌의 변이 충인. 나긋한 말투 아래 독침 같은 권위를 숨긴다.', quote:'“달콤한 건 대개 먼저 굳어.”' },
    { id:'pavel', name:'파벨', displayName:'PAVEL', species:'PLANT / OPIUM POPPY', role:'SLEEPING FIELD', accent:'#9b174d', threat:'OPIUM HAZE', desc:'양귀비계 식목인. 흐려지는 감각과 기억의 경계를 사냥터로 삼는다.', quote:'“깨어 있다고 믿는 순간이 제일 깊은 잠이지.”' },
    { id:'bael', name:'바엘', displayName:'BAEL', species:'BEAST / BLACK MAMBA', role:'VENOM TRACKER', accent:'#0f8f4f', threat:'VENOM TRACE', desc:'블랙맘바 수인. 과묵하고 효율적인 추적자이며 독과 체온 감지에 특화되어 있다.', quote:'“도망은 흔적을 길게 만든다.”' }
  ];

  function fromWindowData() {
    const candidates = [
      window.CHARACTERS,
      window.RUST_ARK_CHARACTERS,
      window.characters,
      window.RUSTARK_DATA && window.RUSTARK_DATA.characters,
      window.RUSTARK && window.RUSTARK.characters,
      window.DATA && window.DATA.characters,
      window.APP_DATA && window.APP_DATA.characters
    ];

    return candidates.find(item => Array.isArray(item) && item.length) || FALLBACK_CHARACTERS;
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

  function normalizeId(value) {
    const id = String(value || '').trim().toLowerCase();
    return ALIASES[id] || id;
  }

  function fallbackFor(id) {
    return FALLBACK_CHARACTERS.find(character => character.id === id) || FALLBACK_CHARACTERS[4];
  }

  function getAccent(raw, id) {
    const accent = pick(raw, [
      'accent',
      'theme',
      'themeColor',
      'color',
      'mainColor',
      'main_color',
      'cssColor',
      'colors.accent',
      'colors.main',
      'profile.accent',
      'meta.accent'
    ]);

    return accent ? String(accent) : fallbackFor(id).accent;
  }

  function normalizeCharacter(raw) {
    const id = normalizeId(pick(raw, ['id', 'slug', 'key', 'code'], 'hale'));
    const fallback = fallbackFor(id);

    const name = pick(raw, ['displayName', 'display_name', 'enName', 'englishName', 'nameEn', 'name'], fallback.displayName || fallback.name);
    const krName = pick(raw, ['name', 'krName', 'koName', 'koreanName'], fallback.name || name);

    return {
      id,
      name: String(name).toUpperCase(),
      krName: String(krName),
      species: String(pick(raw, ['species', 'race', 'type', 'profile.species'], fallback.species)),
      role: String(pick(raw, ['role', 'position', 'class', 'job', 'profile.role'], fallback.role)),
      accent: getAccent(raw, id),
      threat: String(pick(raw, ['threat', 'risk', 'danger', 'dangerLevel', 'profile.threat'], fallback.threat)),
      desc: String(pick(raw, ['intro', 'desc', 'description', 'summary', 'profile.summary', 'profile.desc', 'story.summary'], fallback.desc)),
      quote: String(pick(raw, ['quote', 'line', 'tagline', 'catchphrase', 'profile.quote'], fallback.quote)),
      image: `assets/images/${id}/${id}${IMAGE_SUFFIX}`,
      target: WORLD_TARGET
    };
  }

  function buildCharacterMap() {
    const map = new Map();

    FALLBACK_CHARACTERS.forEach(raw => {
      const character = normalizeCharacter(raw);
      map.set(character.id, character);
    });

    fromWindowData().forEach(raw => {
      const character = normalizeCharacter(raw);
      map.set(character.id, { ...(map.get(character.id) || {}), ...character });
    });

    return map;
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

  function mixHex(hex, amount = 0.45) {
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

  function calculateStats(character) {
    const source = `${character.id}:${character.role}:${character.species}`;
    let seed = 0;
    for (const char of source) seed += char.charCodeAt(0);

    return {
      tactic: Math.min(96, 58 + (seed % 35)),
      affinity: Math.min(88, 42 + ((seed * 7) % 41)),
      control: Math.min(90, 48 + ((seed * 11) % 37))
    };
  }

  function selectCharacter() {
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace('#', '');
    const requested = normalizeId(params.get('entry') || params.get('id') || hash || 'hale');
    const map = buildCharacterMap();

    return map.get(requested) || map.get('hale') || Array.from(map.values())[0];
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
    setText('[data-intro-status]', 'VERIFIED');
    setText('[data-intro-threat]', character.threat);
    setText('[data-intro-desc]', character.desc);
    setText('[data-intro-quote]', character.quote);

    const stats = calculateStats(character);
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
      console.warn('[RUST ARK] sessionStorage unavailable', error);
    }
  }

  function goWorld(character) {
    saveWorldEntry(character);
    window.location.href = character.target || WORLD_TARGET;
  }

  function shouldPreviewOnly() {
    const params = new URLSearchParams(window.location.search);
    return params.get('preview') === '1' || params.get('preview') === 'true';
  }

  const character = selectCharacter();
  applyIntro(character);

  const skip = document.querySelector('[data-intro-skip]');
  if (skip) {
    skip.addEventListener('click', () => goWorld(character), { once: true });
  }

  if (!shouldPreviewOnly()) {
    window.setTimeout(() => goWorld(character), INTRO_DURATION);
  }
})();
