const BGM_TRACKS = [
  { title: 'Signal Boot', mood: 'terminal access', src: 'assets/audio/bgm/rust_ark_01_signal.mp3' },
  { title: 'Aftermath Rain', mood: 'world map', src: 'assets/audio/bgm/rust_ark_02_aftermath.mp3' }
];

// 갤러리는 캐릭터마다 자유롭게 바꿀 수 있습니다.
// 이미지는 PNG만 사용합니다. 영상은 MP4 + poster PNG 조합을 권장합니다.
// 5장이면 galleryPaths('hale', 5), 10장이면 galleryPaths('hale', 10)으로 바꾸면 됩니다.
// 영상은 videoItem('assets/videos/hale/hale_01.mp4', 'assets/videos/hale/hale_01_poster.png', 'Motion Archive')처럼 추가합니다.
const imageItem = (src, title = 'Image Archive') => ({
  type: 'image',
  src,
  thumb: src,
  title
});

const videoItem = (src, thumb, title = 'Motion Archive') => ({
  type: 'video',
  src,
  thumb,
  title
});

const galleryPaths = (id, count = 6, ext = 'png') =>
  Array.from({ length: count }, (_, i) => imageItem(`assets/images/${id}/${id}_${String(i + 1).padStart(2, '0')}.${ext}`, `IMAGE ${String(i + 1).padStart(2, '0')}`));

const WORLD = {
  title: 'RUST ARK',
  logo: 'assets/images/common/rustark-hero-logo.png',
  subtitle: '2089 AFTERMATH / RESTRICTED BIO ARCHIVE',
  tagline: '인간은 자연을 지배한 것이 아니라, 전쟁에서 승리했을 뿐이다.',
  summary: '오래전 인간은 동물, 곤충, 식물과의 종족 전쟁에서 승리하고 수백 년간 세계를 통제했다. 그러나 2089년, 버려진 자연의 후손들은 다시 인간의 질서 밖에서 깨어났다. RUST ARK는 그 재전쟁 이후 남겨진 생체 기록 보관소다.',
  factions: [
    { name:'HUMAN', label:'COMMAND STRUCTURE', text:'승리 이후 세계를 관리해온 인간 중심 질서. 현재는 방어와 통제를 동시에 수행한다.' },
    { name:'PLANT', label:'ROOT NETWORK', text:'느린 성장과 깊은 기억을 무기로 삼는 식목인 세력. 해방과 복원을 명분으로 움직인다.' },
    { name:'INSECT', label:'SWARM DOMAIN', text:'군집, 정찰, 독성, 변이를 기반으로 빠르게 확산하는 충인 세력.' },
    { name:'BEAST', label:'FERAL FRONT', text:'육체성과 본능, 영역성을 전면에 내세우는 수인 세력. 전선의 충격파 역할을 맡는다.' }
  ],
  timeline: [
    'OLD WAR : 인간이 종족 전쟁에서 승리했다.',
    'CONTROL ERA : 자연종은 인간 질서 아래 편입되었다.',
    '2089 : 변이 개체와 해방군 기록이 동시다발적으로 출현했다.',
    'RUST ARK : 훼손된 생체 기록이 제한 등급으로 복원되었다.'
  ]
};

const CHARACTERS = [
  {
    id: 'seol-gongchan',
    displayName: '설공찬',
    enName: 'SEOL GONGCHAN',
    krName: '설공찬',
    type: 'HUMAN / COMMANDER',
    species: 'HUMAN',
    role: 'COMMANDER',
    creator: '@냠냠티비',
    accent: '#b8c2d3',
    affiliation: 'Human Resistance',
    danger: 'A+',
    status: 'ACTIVE',
    affirm: 'COMMAND VERIFIED',
    clearance: 'A-7 / HUMAN NODE',
    scan: 'TACTICAL SCAN COMPLETE',
    origin: 'HUMAN CONTROL ZONE',
    recordDate: '2089.09.21',
    archiveId: 'RA-H-01-GONGCHAN',
    mainImage: 'assets/images/seol_gongchan/seol_gongchan_01.jpg',
    gallery: galleryPaths('seol_gongchan', 3, 'jpg'),
    quote: '보호라는 말로 포장해도, 질서는 결국 누군가의 감시다.',
    metrics: { threat: 8, stability: 8, affinity: 2, control: 9 },
    profileBadges: ['AFFIRM : COMMAND VERIFIED', 'CLEARANCE : A-7 / HUMAN NODE', 'SCAN : TACTICAL COMPLETE'],
    identityFields: [
      ['ID', 'RA-H-01-GONGCHAN'], ['CLASS', 'HUMAN / COMMANDER'], ['CREATOR', '@냠냠티비'], ['FACTION', 'Human Resistance'], ['STATUS', 'ACTIVE'], ['AFFIRM', 'COMMAND VERIFIED'], ['CLEARANCE', 'A-7 / HUMAN NODE'], ['ORIGIN', 'HUMAN CONTROL ZONE'], ['RECORD DATE', '2089.09.21']
    ],
    summary: '무너진 세계에서도 질서를 다시 세우려는 인간 지휘관. 판단이 빠르고 통제력이 강하다.',
    profile: ['인간 대항군 총사령관.', '질서 재건을 명분으로 감시와 보호를 동시에 수행한다.', '협상 상대라면 유능하고 적이라면 번거롭다.'],
    story: '전쟁 이후의 혼란 속에서 인간 세력의 남은 규율을 수습한 지휘관. 그는 생존을 위해 필요한 폭력을 부정하지 않는다.',
    record: ['FIELD NOTE : 의사결정 속도 평균치 초과.', 'RISK : 조직 복구 능력 높음.']
  },
  {
    id: 'hwaryeon', displayName: '화련', enName: 'HWARYEON', krName: '화련', type: 'PLANT / LOTUS', species: 'PLANT', role: 'LOTUS', creator: '@냠냠티비', accent: '#e68aa6', affiliation: 'Plant Liberation Army', danger: 'B+', status: 'ACTIVE', affirm: 'OBSERVED', clearance: 'B-4 / BLOOM NODE', scan: 'EMOTIONAL SCAN PARTIAL', origin: 'WETLAND FRONT', recordDate: '2089.09.18', archiveId: 'RA-P-02-HWARYEON', mainImage: 'assets/images/hwaryeon/hwaryeon_01.jpg', gallery: galleryPaths('hwaryeon', 3, 'jpg'), quote: '활짝 피었다는 건, 이미 물밑에서 다 끝났다는 뜻이야.', metrics: { threat: 5, stability: 6, affinity: 7, control: 5 }, profileBadges: ['AFFIRM : OBSERVED', 'CLEARANCE : B-4 / BLOOM NODE', 'SCAN : PARTIAL'], identityFields: [['ID','RA-P-02-HWARYEON'],['CLASS','PLANT / LOTUS'],['CREATOR','@냠냠티비'],['FACTION','Plant Liberation Army'],['STATUS','ACTIVE'],['AFFIRM','OBSERVED'],['CLEARANCE','B-4 / BLOOM NODE'],['ORIGIN','WETLAND FRONT'],['RECORD DATE','2089.09.18']], summary: '해맑고 장난스러운 연꽃 식목인. 무해한 얼굴로 잔혹한 전장을 통과한다.', profile: ['연꽃 기반 식목인.', '밝은 태도와 전장의 잔혹함이 동시에 관측된다.', '정서 반응이 가볍지만 위험성이 낮다는 뜻은 아니다.'], story: '그는 웃는 얼굴로 늪을 건넌다. 발밑에서 무엇이 썩고 있는지 알면서도 꽃은 피어난다.', record: ['OBSERVATION : 친화적 접근 뒤 급격한 전술 전환.', 'CAUTION : 감정 표현과 위험도 불일치.']
  },
  {
    id: 'ordo', displayName: '오르도', enName: 'ORDO', krName: '오르도', type: 'INSECT / LOCUST', species: 'INSECT', role: 'LOCUST', creator: '@냠냠티비', accent: '#7f8f22', affiliation: 'Swarm Domain', danger: 'A', status: 'UNSTABLE', affirm: 'UNSTABLE CONFIRMED', clearance: 'A-3 / SWARM ALERT', scan: 'PATTERN BROKEN', origin: 'DRY FIELD SECTOR', recordDate: '2089.09.20', archiveId: 'RA-I-03-ORDO', mainImage: 'assets/images/ordo/ordo_01.jpg', gallery: galleryPaths('ordo', 11, 'jpg'), quote: '하나가 지나가면 흔적이 남고, 무리가 지나가면 세계가 바뀐다.', metrics: { threat: 7, stability: 4, affinity: 2, control: 4 }, profileBadges: ['AFFIRM : UNSTABLE CONFIRMED', 'CLEARANCE : A-3 / SWARM ALERT', 'SCAN : BROKEN'], identityFields: [['ID','RA-I-03-ORDO'],['CLASS','INSECT / LOCUST'],['CREATOR','@냠냠티비'],['FACTION','Swarm Domain'],['STATUS','UNSTABLE'],['AFFIRM','UNSTABLE CONFIRMED'],['CLEARANCE','A-3 / SWARM ALERT'],['ORIGIN','DRY FIELD SECTOR'],['RECORD DATE','2089.09.20']], summary: '메뚜기 충인. 집단 이동과 소모전을 상징하는 재난형 개체.', profile: ['메뚜기 기반 충인.', '보급선과 경작지를 직접 위협한다.', '개체보다 군집 단위의 위험성이 높다.'], story: '그가 지나간 자리에 남는 것은 전투의 잔해보다 기근에 가깝다.', record: ['DAMAGE : 경작지 손실 다수.', 'PATTERN : 이동 방향 예측 어려움.']
  },
  {
    id: 'zephyr', displayName: 'Zephyr 제피르', enName: 'ZEPHYR', krName: '제피르', type: 'INSECT / DRAGONFLY', species: 'INSECT', role: 'DRAGONFLY', creator: '@수백사', accent: '#0084a8', affiliation: 'Recon Wing', danger: 'B+', status: 'ACTIVE', affirm: 'FIELD VERIFIED', clearance: 'B-6 / RECON NODE', scan: 'AERIAL SCAN COMPLETE', origin: 'HIGH WIND ROUTE', recordDate: '2089.09.19', archiveId: 'RA-I-04-ZEPHYR', mainImage: 'assets/images/zephyr/zephyr_01.png', gallery: [imageItem('assets/images/zephyr/zephyr_01.png', 'IMAGE 01'), imageItem('assets/images/zephyr/zephyr_02.jpg', 'IMAGE 02'), imageItem('assets/images/zephyr/zephyr_03.png', 'IMAGE 03')], quote: '빠른 자는 진실이 되기 전의 흔적을 본다.', metrics: { threat: 5, stability: 6, affinity: 4, control: 6 }, profileBadges: ['AFFIRM : FIELD VERIFIED', 'CLEARANCE : B-6 / RECON NODE', 'SCAN : AERIAL COMPLETE'], identityFields: [['ID','RA-I-04-ZEPHYR'],['CLASS','INSECT / DRAGONFLY'],['CREATOR','@수백사'],['FACTION','Recon Wing'],['STATUS','ACTIVE'],['AFFIRM','FIELD VERIFIED'],['CLEARANCE','B-6 / RECON NODE'],['ORIGIN','HIGH WIND ROUTE'],['RECORD DATE','2089.09.19']], summary: '왕잠자리 충인 정찰기록병. 빠른 기동성과 관측 기록을 보유한다.', profile: ['정찰 및 기록 담당.', '기동성, 시야, 현장 판단력이 우수하다.', '정보를 전장보다 빠르게 운반한다.'], story: '제피르의 기록은 늘 한 박자 앞서 도착한다. 그래서 그의 보고서는 예언처럼 읽힌다.', record: ['RECON : 고고도 관측 우수.', 'ARCHIVE : 현장 기록 신뢰도 높음.']
  },
  {
    id: 'hale', displayName: 'Hale 헤일', enName: 'HALE', krName: '헤일', type: 'PLANT / HYDRANGEA', species: 'PLANT', role: 'HYDRANGEA', creator: '@릴리브', accent: '#9b8cff', affiliation: 'Plant Liberation Army', danger: 'A', status: 'ACTIVE', affirm: 'VERIFIED', clearance: 'A-7 / STRATEGY NODE', scan: 'BIO SIGNAL COMPLETE', origin: 'HYDRANGEA FRONT', recordDate: '2089.09.21', archiveId: 'RA-P-05-HALE', mainImage: 'assets/images/hale/hale_01.png', gallery: [
      ...galleryPaths('hale', 2, 'png'),
      videoItem('assets/videos/hale/hale_01.mp4', 'assets/videos/hale/hale_01_poster.png', 'MOTION ARCHIVE 01')
    ], quote: '그걸 작전이라고 가져온 거야?', metrics: { threat: 7, stability: 7, affinity: 4, control: 5 }, profileBadges: ['AFFIRM : VERIFIED', 'CLEARANCE : A-7 / STRATEGY NODE', 'SCAN : COMPLETE'], identityFields: [['ID','RA-P-05-HALE'],['CLASS','PLANT / HYDRANGEA'],['CREATOR','@릴리브'],['FACTION','Plant Liberation Army'],['STATUS','ACTIVE'],['AFFIRM','VERIFIED'],['CLEARANCE','A-7 / STRATEGY NODE'],['ORIGIN','HYDRANGEA FRONT'],['RECORD DATE','2089.09.21']], summary: '까칠하고 직설적인 수국 식목인 전략관. 감정보다 구조적 해방을 중시한다.', profile: ['일반 수국 식목인 전략관.', '허술한 계획을 싫어하고 빈정거리는 농담을 자주 사용한다.', '약자와 어린 식물에게 약한 반응을 보인다.'], story: '헤일은 아름다운 꽃처럼 보이지만, 그의 사고는 지도 위의 칼금에 가깝다.', record: ['TACTIC : 보급로 분석 및 차단 전문.', 'PERSONALITY : 냉소적이나 보호 반응 확인.']
  },
  {
    id: 'arens', displayName: 'Arens 아렌스', enName: 'ARENS', krName: '아렌스', type: 'INSECT / ASSASSIN', species: 'INSECT', role: 'ASSASSIN', creator: '@반엽', accent: '#d37c1f', affiliation: 'Covert Swarm', danger: 'A+', status: 'CLASSIFIED', affirm: 'REDACTED', clearance: 'BLACK / COVERT NODE', scan: 'SIGNATURE MASKED', origin: 'UNKNOWN', recordDate: 'REDACTED', archiveId: 'RA-I-06-ARENS', mainImage: 'assets/images/arens/arens_01.png', gallery: galleryPaths('arens', 3, 'png'), quote: '보이지 않는다는 건, 없는 게 아니라 늦었다는 뜻이지.', metrics: { threat: 8, stability: 4, affinity: 2, control: 3 }, profileBadges: ['AFFIRM : REDACTED', 'CLEARANCE : BLACK', 'SCAN : MASKED'], identityFields: [['ID','RA-I-06-ARENS'],['CLASS','INSECT / ASSASSIN'],['CREATOR','@반엽'],['FACTION','Covert Swarm'],['STATUS','CLASSIFIED'],['AFFIRM','REDACTED'],['CLEARANCE','BLACK / COVERT NODE'],['ORIGIN','UNKNOWN'],['RECORD DATE','REDACTED']], summary: '암살자형 충인. 은신과 침투 기록이 대부분 삭제되어 있다.', profile: ['침투 및 암살 담당.', '직접 교전보다 사전 제거에 특화.', '기록 훼손률이 높다.'], story: '아렌스의 이름이 기록에 남는 순간, 이미 누군가는 기록에서 지워져 있다.', record: ['ACCESS : 부분 삭제됨.', 'CAUTION : 근접 감지 실패 사례 다수.']
  },
  {
    id: 'kael', displayName: 'Kael 카엘', enName: 'KAEL', krName: '카엘', type: 'BEAST / WOLF', species: 'BEAST', role: 'WOLF', creator: '@떯기', accent: '#6f8398', affiliation: 'Feral Front', danger: 'A', status: 'ACTIVE', affirm: 'CONFIRMED', clearance: 'A-5 / PACK NODE', scan: 'TRACKING COMPLETE', origin: 'NORTHERN RUINS', recordDate: '2089.09.17', archiveId: 'RA-B-07-KAEL', mainImage: 'assets/images/kael/kael_01.png', gallery: [
      ...galleryPaths('kael', 6, 'png'),
      imageItem('assets/images/kael/kael_07.jpg', 'IMAGE 07'),
      imageItem('assets/images/kael/kael_08.png', 'IMAGE 08')
    ], quote: '무리는 약자를 버리지 않는다. 버리는 건 인간의 방식이지.', metrics: { threat: 7, stability: 5, affinity: 5, control: 6 }, profileBadges: ['AFFIRM : CONFIRMED', 'CLEARANCE : A-5 / PACK NODE', 'SCAN : TRACKING COMPLETE'], identityFields: [['ID','RA-B-07-KAEL'],['CLASS','BEAST / WOLF'],['CREATOR','@떯기'],['FACTION','Feral Front'],['STATUS','ACTIVE'],['AFFIRM','CONFIRMED'],['CLEARANCE','A-5 / PACK NODE'],['ORIGIN','NORTHERN RUINS'],['RECORD DATE','2089.09.17']], summary: '늑대 수인. 무리 의식과 전장 추적 능력이 강한 전선형 개체.', profile: ['늑대 기반 수인.', '영역 추적 및 전장 대응 우수.', '집단 보호 본능 강함.'], story: '카엘에게 전쟁은 영토의 문제가 아니다. 살아남은 무리를 어디까지 데려갈 수 있는가의 문제다.', record: ['TRACKING : 야간 추적 성공률 높음.', 'BOND : 소속 개체 보호 우선.']
  },
  {
    id: 'vulcan', displayName: 'Vulcan 발칸', enName: 'VULCAN', krName: '발칸', type: 'BEAST / BULLFIGHT', species: 'BEAST', role: 'BULLFIGHT', creator: '@밍묭', accent: '#c9361f', affiliation: 'Feral Front', danger: 'A+', status: 'VOLATILE', affirm: 'IMPACT VERIFIED', clearance: 'A-9 / BREACH NODE', scan: 'KINETIC SCAN COMPLETE', origin: 'FRONTLINE BREACH', recordDate: '2089.09.22', archiveId: 'RA-B-08-VULCAN', mainImage: '', gallery: [], quote: '못 막으면 길이 생기는 거고.', metrics: { threat: 8, stability: 4, affinity: 4, control: 3 }, profileBadges: ['AFFIRM : IMPACT VERIFIED', 'CLEARANCE : A-9 / BREACH NODE', 'SCAN : KINETIC COMPLETE'], identityFields: [['ID','RA-B-08-VULCAN'],['CLASS','BEAST / BULLFIGHT'],['CREATOR','@밍묭'],['FACTION','Feral Front'],['STATUS','VOLATILE'],['AFFIRM','IMPACT VERIFIED'],['CLEARANCE','A-9 / BREACH NODE'],['ORIGIN','FRONTLINE BREACH'],['RECORD DATE','2089.09.22']], summary: '투우형 수인. 정면 돌파와 압도적 충격력으로 전선을 연다.', profile: ['돌파형 전투 개체.', '방어선 붕괴에 특화.', '흥분 상태에서 통제 난이도 상승.'], story: '발칸은 협상장을 통과하지 않는다. 문과 벽과 규칙을 함께 부수고 들어온다.', record: ['IMPACT : 방벽 파괴 기록 다수.', 'RISK : 충동 제어 필요.']
  },
  {
    id: 'harmel', displayName: 'Harmel 하르멜', enName: 'HARMEL', krName: '하르멜', type: 'INSECT / QUEEN BEE', species: 'INSECT', role: 'QUEEN BEE', creator: '@햄솔이', accent: '#d99a1e', affiliation: 'Hornet Legion', danger: 'S', status: 'MUTATED', affirm: 'MUTATION CONFIRMED', clearance: 'S-1 / HIVE CROWN', scan: 'TOXIN SCAN COMPLETE', origin: 'NUCLEAR WASTE ZONE', recordDate: '2089.09.23', archiveId: 'RA-I-09-HARMEL', mainImage: 'assets/images/harmel/harmel_01.png', gallery: galleryPaths('harmel', 7, 'png'), quote: '달콤한 건 원래 오래 남지. 독도 마찬가지고.', metrics: { threat: 9, stability: 6, affinity: 3, control: 3 }, profileBadges: ['AFFIRM : MUTATION CONFIRMED', 'CLEARANCE : S-1 / HIVE CROWN', 'SCAN : TOXIN COMPLETE'], identityFields: [['ID','RA-INSECT-MUTANT-QUEEN-031'],['CLASS','INSECT / QUEEN BEE'],['CREATOR','@햄솔이'],['FACTION','Hornet Legion'],['STATUS','MUTATED'],['AFFIRM','MUTATION CONFIRMED'],['CLEARANCE','S-1 / HIVE CROWN'],['ORIGIN','NUCLEAR WASTE ZONE'],['RECORD DATE','2089.09.23']], summary: '장수말벌과 꿀벌의 혼종 변이 여왕벌 개체. 나긋하고 서늘한 말투를 가진다.', profile: ['핵폐기물 변이로 발생한 혼종 충인.', '말벌 군단과 개인주의 사이에서 독자 노선을 취한다.', '혀 돌기 독침화 기록 존재.'], story: '하르멜은 군집의 왕관을 쓴 개인주의자다. 벌집의 법칙을 알면서도 그 안에 갇히지 않는다.', record: ['MUTATION : 고위험 독성 기관 확인.', 'SOCIAL : 군집 지휘 가능성 있음.']
  },
  {
    id: 'pavel', displayName: 'Pavel 파벨', enName: 'PAVEL', krName: '파벨', type: 'PLANT / OPIUM POPPY', species: 'PLANT', role: 'OPIUM POPPY', creator: '@깅루나', accent: '#9b174d', affiliation: 'Plant Liberation Army', danger: 'A', status: 'ACTIVE', affirm: 'CAUTION VERIFIED', clearance: 'A-6 / SEDATION NODE', scan: 'NARCOTIC SCAN COMPLETE', origin: 'RED FIELD SECTOR', recordDate: '2089.09.20', archiveId: 'RA-P-10-PAVEL', mainImage: '', gallery: [], quote: '고통을 지우면, 진실도 같이 흐려지지.', metrics: { threat: 7, stability: 5, affinity: 5, control: 4 }, profileBadges: ['AFFIRM : CAUTION VERIFIED', 'CLEARANCE : A-6 / SEDATION NODE', 'SCAN : NARCOTIC COMPLETE'], identityFields: [['ID','RA-P-10-PAVEL'],['CLASS','PLANT / OPIUM POPPY'],['CREATOR','@깅루나'],['FACTION','Plant Liberation Army'],['STATUS','ACTIVE'],['AFFIRM','CAUTION VERIFIED'],['CLEARANCE','A-6 / SEDATION NODE'],['ORIGIN','RED FIELD SECTOR'],['RECORD DATE','2089.09.20']], summary: '양귀비 식목인. 진통, 환각, 중독성 능력으로 기록된다.', profile: ['양귀비 기반 식목인.', '진정과 혼란 유발 양면성 보유.', '심문 및 전장 후방 교란에 적합.'], story: '파벨의 꽃가루는 상처를 잠재우고 의심도 잠재운다. 그래서 가장 부드러운 위험이다.', record: ['EFFECT : 감각 저하 및 판단 흐림.', 'CAUTION : 장기 노출 금지.']
  },
  {
    id: 'bael', displayName: 'Bael 바엘', enName: 'BAEL', krName: '바엘', type: 'BEAST / BLACK MAMBA', species: 'BEAST', role: 'BLACK MAMBA', creator: '@깅루나', accent: '#0f8f4f', affiliation: 'Feral Front', danger: 'S', status: 'ACTIVE', affirm: 'BLACKLISTED', clearance: 'S-2 / VENOM NODE', scan: 'NEUROTOXIN SCAN COMPLETE', origin: 'SOUTHERN BLACK ZONE', recordDate: '2089.09.24', archiveId: 'RA-B-11-BAEL', mainImage: '', gallery: [], quote: '내가 물기 전에 도망쳤다면, 그건 네 운이 아니라 내 선택이야.', metrics: { threat: 9, stability: 5, affinity: 3, control: 3 }, profileBadges: ['AFFIRM : BLACKLISTED', 'CLEARANCE : S-2 / VENOM NODE', 'SCAN : NEUROTOXIN COMPLETE'], identityFields: [['ID','RA-B-11-BAEL'],['CLASS','BEAST / BLACK MAMBA'],['CREATOR','@깅루나'],['FACTION','Feral Front'],['STATUS','ACTIVE'],['AFFIRM','BLACKLISTED'],['CLEARANCE','S-2 / VENOM NODE'],['ORIGIN','SOUTHERN BLACK ZONE'],['RECORD DATE','2089.09.24']], summary: '블랙맘바 수인. 독성과 속도, 냉정한 추격으로 고위험 등급을 받았다.', profile: ['블랙맘바 기반 수인.', '초고속 접근과 독성 제압에 특화.', '대치 상황에서 심리 압박이 강하다.'], story: '바엘은 크게 움직이지 않는다. 그러나 한 번 움직이면 전장은 결론에 도달한다.', record: ['VENOM : 신경계 반응 급격 저하.', 'SPEED : 시야 추적 실패 가능성 높음.']
  }
];

const RELATIONS = [
  { from:'seol-gongchan', to:'hale', type:'WATCH', label:'전술 변수 감시', intensity:4, note:'수국 전략관의 판단력은 인정하지만 인간 질서의 통제 밖에 있는 핵심 변수로 분류한다.' },
  { from:'seol-gongchan', to:'hwaryeon', type:'WATCH', label:'해방군 핵심 관찰', intensity:3, note:'화련의 밝은 태도 뒤에 있는 전장 적응력을 위험 신호로 기록한다.' },
  { from:'seol-gongchan', to:'ordo', type:'HOSTILE', label:'보급로 파괴 위협', intensity:5, note:'메뚜기 군집형 개체를 인간 생존선과 식량 체계의 직접 위협으로 지정한다.' },
  { from:'hale', to:'zephyr', type:'ALLY', label:'정찰 협력', intensity:4, note:'제피르의 정찰 기록을 기반으로 헤일이 보급로 차단 계획을 세운다.' },
  { from:'hale', to:'seol-gongchan', type:'WATCH', label:'위험 감시', intensity:5, note:'인간 지휘관으로서 제거보다 장기 관찰 대상으로 분류한다.' },
  { from:'hwaryeon', to:'hale', type:'ALLY', label:'같은 전선', intensity:3, note:'방식은 다르지만 헤일의 전술 가치는 인정한다.' },
  { from:'arens', to:'hale', type:'WATCH', label:'침투 변수', intensity:3, note:'헤일의 전략망이 자신의 이동을 지나치게 정확히 읽는다고 판단한다.' },
  { from:'harmel', to:'ordo', type:'TRADE', label:'군집 거래', intensity:4, note:'하르멜은 오르도의 군집 이동을 전장 교란 자원으로 사용한다.' },
  { from:'bael', to:'kael', type:'WATCH', label:'포식자 견제', intensity:4, note:'서로의 영역성과 속도를 인정하지만 신뢰하지는 않는다.' },
  { from:'kael', to:'vulcan', type:'ALLY', label:'전선 돌파', intensity:4, note:'카엘은 발칸의 돌파력을 위험하지만 유용한 힘으로 본다.' },
  { from:'pavel', to:'hwaryeon', type:'PROTECT', label:'후방 진정', intensity:3, note:'파벨은 화련의 밝은 잔혹성이 전장에서 쉽게 소모될 수 있다고 본다.' },
  { from:'seol-gongchan', to:'bael', type:'HOSTILE', label:'고위험 제거 대상', intensity:5, note:'블랙맘바 수인 개체를 인간 방어선의 최우선 위협으로 분류한다.' },
  { from:'zephyr', to:'arens', type:'UNKNOWN', label:'식별 실패', intensity:2, note:'제피르의 관측 기록에도 아렌스의 이동 패턴은 부분적으로만 남는다.' }
];
