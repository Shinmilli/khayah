import { readJsonDocument, writeJsonDocument } from './siteDocumentStore'

const DOCUMENT_KEY = 'biz-support'
const NANUM = 'https://www.ihappynanum.com/Nanum/B/RAA98AKVRQ'

export type BizSection = {
  id: string
  page: string
  order: number
  enabled: boolean
}

export type BizMenuItem = {
  key: string
  order: number
}

export type BizSupportDocument = {
  version: 1
  fields: Record<string, string>
  sections: BizSection[]
  menu: BizMenuItem[]
  otherBusiness: 'manual' | 'auto'
  grantsPublic: boolean
  donate: { url: string; labelKo: string; menuLabel: string; receiptNote: string; inquiry: string; impactEnabled: boolean }
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function text(v: unknown, fallback: string, max = 4000): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : fallback
}

function flag(v: unknown, fallback: boolean): boolean {
  return typeof v === 'boolean' ? v : fallback
}

function num(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback
}

const FIELDS: Record<string, string> = {
  'dom.photo': '/images/business/domestic-edu-2.jpg',
  'dom.photoAlt': 'Dream Seekers 캠프 발표',
  'dom.title': '배움을 실천의 기회로 <span class="biz-kp__em">연결합니다</span>.',
  'dom.lead': '카야는 현장의 필요에 맞는 교육과 지원을 잇고, 개인의 경험이 지역사회의 변화로 이어지도록 함께합니다.',
  'dom.p.0.title': '가치지향적 & 미래지향적 교육',
  'dom.p.0.body': '한국 사회의 구조와 교육 체계 속에서 충분히 드러나지 않은 과제를 발견하고, 개선할 방안을 모색하고, 새로운 가치 창출과 미래를 준비하는 교육개발 프로젝트를 진행합니다.',
  'dom.p.1.title': '인간 중심 & 자연친화적 교육',
  'dom.p.1.body': '카야는 사람을 개발의 수단이 아닌 존엄한 주체로 존중합니다. 지역사회와 자연환경의 미래를 함께 고려하며 무분별한 개발을 지양하고, 사람의 성장과 생태계의 지속가능성이 상생하는 교육을 실천합니다.',
  'dom.p.2.title': '국내에서 세계로 이어지는 개발협력',
  'dom.p.2.body': '진로 탐색, 소셜 창업, 기후·환경 교육을 통해 국내에서 쌓은 경험과 전문성을 해외 개발협력 현장으로 연결합니다. 청소년과 청년, 외국인 노동자, 탈북 청년의 배움이 각 지역의 문화와 필요에 맞게 활용되어 지역사회에 기여하도록 지원합니다.',
  'dedu.title': '교육으로 스스로 <span class="wn">성장할 수 있는 기반</span>을 만듭니다.',
  'dedu.desc': '카야는 교육으로 개인의 성장과 공동체의 변화를 함께 만듭니다. 외국인 노동자, 탈북 청년, 청소년 등 이웃이 자신의 역량을 키우고 배움을 나누도록, 사회적 가치에 기반한 교육과 경험의 기회를 제공합니다.',
  'dedu.cta': '국내 진행사업 확인하기',
  'dedu.0.title': '진로 탐색과 미래역량개발 지원',
  'dedu.0.sub': '자기이해 · Life Design · 직업기초역량 · 진로 체험·멘토링 · 사회·문화 체험',
  'dedu.0.body': '청소년과 청년이 자신을 이해하고 미래를 주도적으로 설계하도록 단계적 진로교육을 제공합니다. 자기이해에서 공동체와 직업세계에 대한 이해, 진로 탐색과 설계로 이어지는 배움을 통해 가능성을 발견하고 구체적인 실천으로 옮기도록 돕습니다.',
  'dedu.0.photo': '/images/business/domestic-edu-2.jpg',
  'dedu.0.caption': 'Dream Seekers 캠프 발표 (진로 탐색과 미래역량개발 지원)',
  'dedu.1.title': '사회적 가치기반 소셜 창업과 자립 역량 강화',
  'dedu.1.sub': '소셜 비즈니스 교육 · 국내외 창업 · 국제개발협력 교육',
  'dedu.1.body': '사회적 가치와 기업가정신을 바탕으로 외국인 노동자, 탈북 청년, 소외된 청(소)년의 창업과 자립을 돕습니다. 경험과 강점을 바탕으로 지역사회의 필요를 사업 아이디어로 발전시키며 새로운 진로와 기회를 모색합니다.',
  'dedu.1.photo': '/images/business/domestic-edu-1.jpg',
  'dedu.1.caption': '자연순환유기농업 기술교육 (소셜 창업과 자립 역량 강화)',
  'dedu.2.title': '기후·환경 인식개선과 실천 확산',
  'dedu.2.sub': '기후·환경 교육 · 주제별 북클럽 · 인식개선 콘텐츠 제작·배포 · 기후위기 대응 봉사단 교육·활동',
  'dedu.2.body': '기후위기를 이해하고 일상과 지역사회에서 실천하는 세계시민의 성장을 돕습니다. 교육과 북클럽, 콘텐츠 제작, 봉사활동을 통해 환경문제를 자신의 삶과 연결하고, 개인의 실천이 지역사회와 국제협력으로 이어지도록 지원합니다.',
  'dedu.2.photo': '/images/business/domestic-edu-3.jpg',
  'dedu.2.caption': '2024 경기청년 기후특사단 국내교육 (기후·환경 인식개선)',
  'ovs.photo': '/images/business/overseas-intro.jpg',
  'ovs.photoAlt': '학습지를 든 미얀마 아이들',
  'ovs.title': '교육으로 <span class="biz-kp__em">변화의 주체</span>를 세웁니다.',
  'ovs.lead': '현지 주민과 함께 배우고 실행하며, 지역사회가 스스로 변화의 힘을 키우도록 돕습니다.',
  'ovs.cta': '해외 진행사업 확인하기',
  'ovs.p.0.title': '참여와 협력',
  'ovs.p.0.body': '카야는 현지 주민을 단순한 수혜자가 아닌 변화의 주체이자 협력 파트너로 존중합니다.<br />서로의 경험과 지식을 나누며 지역에 필요한 변화를 함께 만들어갑니다.',
  'ovs.p.1.title': '현지와의 동화',
  'ovs.p.1.body': '지속적인 변화는 현지 주민이 참여하고, 그 변화의 의미를 함께 이해할 때 가능합니다.<br />카야는 지역의 삶과 맥락을 충분히 이해하고 신뢰를 쌓는 ‘현지와의 동화’를 모든 사업의 출발점으로 삼습니다.<br />주민과 사업의 방향을 함께 정하고, 자발적 참여를 이끌어냅니다.',
  'ovs.p.2.title': '참여적 방법론',
  'ovs.p.2.body': '조사와 분석, 기획과 실행, 모니터링과 평가의 전 과정에 주민이 참여합니다.<br />주민의 경험과 의견을 사업에 반영하고, 변화와 성과도 함께 확인합니다.',
  'ovs.p.3.title': '지속가능성(sustainability)',
  'ovs.p.3.body': '지역사회의 자원과 협력체계를 기반으로, 외부 지원이 끝난 후에도 지역이 스스로 운영을 이어갈 수 있도록 합니다.<br />카야는 사업의 전 과정에서 지속가능한 운영의 조건을 연구하고 실천합니다.',
  'oedu.title': 'Learning today,<br />Leading tomorrow!',
  'oedu.desc': '카야는 교육을 통해 지역이 변화의 힘을 키우도록 돕습니다. 삶의 기초역량부터 직업훈련, 교육 환경 개선까지 현장과 함께 설계하고 실행합니다.',
  'oedu.cta': '해외 교육 진행사업 확인하기',
  'oedu.0.title': '기초역량\n강화사업',
  'oedu.0.body': '스스로 배우고 삶의 과제에 대응하는 힘은 지속적인 성장의 토대입니다. 카야는 읽기·쓰기·수리력 등 기초학습과 자기이해·의사소통·문제해결 등 삶의 역량을 함께 키웁니다. 참여자가 배움을 이어가고, 자신과 공동체를 이해하며 주체적으로 살아가도록 지원합니다.',
  'oedu.0.photo.0': '/images/business/overseas-edu-foundation-1.jpg',
  'oedu.0.cap.0': '기초학업 학습지',
  'oedu.0.photo.1': '/images/business/overseas-edu-foundation-2.jpg',
  'oedu.0.cap.1': '수학·과학 기초역량',
  'oedu.0.photo.2': '/images/business/overseas-edu-foundation-3.jpg',
  'oedu.0.cap.2': 'Life Skills',
  'oedu.1.title': '미래지향\n교육',
  'oedu.1.body': '청소년과 청년이 변화하는 사회를 이해하고 자신의 미래를 주도적으로 설계하도록 돕습니다. 지역의 교육·산업 환경과 참여자의 관심을 바탕으로 진로·직업교육과 미래 분야 역량을 위한 STEM 교육을 함께 운영하며, 배운 것을 삶과 지역의 과제에 적용하는 힘을 키웁니다.',
  'oedu.1.photo.0': '/images/business/overseas-edu-future-1.jpg',
  'oedu.1.cap.0': 'Life Design 진로탐색',
  'oedu.1.photo.1': '/images/business/overseas-edu-future-2.jpg',
  'oedu.1.cap.1': '직업기술 체험',
  'oedu.1.photo.2': '/images/business/overseas-edu-future-3.jpg',
  'oedu.1.cap.2': 'STEM 융합 탐구 교육',
  'oedu.2.title': '교육 질\n개선사업',
  'oedu.2.body': '배움의 기회를 넓히고 교육 격차를 줄이는 일과 함께, 교실에서 이루어지는 교육의 질을 높입니다. 교사와 학교, 지역사회가 협력해 수업과 학습환경을 개선하도록 지원합니다. 현장의 필요에 맞는 교사교육과 교육자료, 학습 지원을 연결하고, 그 경험을 함께 돌아보며 더 나은 교육 방법을 발전시킵니다.',
  'oedu.2.photo.0': '/images/business/overseas-edu-quality-1.jpg',
  'oedu.2.cap.0': '교사역량강화',
  'oedu.2.photo.1': '/images/business/overseas-edu-quality-2.jpg',
  'oedu.2.cap.1': '이러닝 교육 플랫폼',
  'oedu.2.photo.2': '/images/business/overseas-edu-quality-3.jpg',
  'oedu.2.cap.2': '학부모 인식개선',
  'vol.title': '현지 과제를 함께 푸는 <span class="wn">국제협력활동</span>',
  'vol.desc': '카야는 국내 청소년·청년과 기업 등 경험과 열정을 가진 다양한 참여자가 현지의 과제를 이해하고 주민과 함께 해결방안을 찾도록 지원합니다. 필요에 맞는 실천 모델을 제안하고 실행하며, 지역사회의 지속가능한 변화와 참여자의 성장이 함께 이뤄지도록 합니다.',
  'vol.cta': '해외봉사단 진행사업 확인하기',
  'vol.block.0.title': '철학과 전문성을 담은 봉사기획',
  'vol.block.0.lead': '10년 이상 축적한 국제개발협력·교육분야 경험을 바탕으로 지역의 문제를 발굴·분석해 맞춤형 봉사활동을 기획합니다. 현지에 적합한 변화를 만들고, 봉사단원이 세계시민성·문제해결력·적응력·전문성 활용 역량을 키우도록 지원합니다.',
  'vol.panel.0.title': '국제개발협력 전문성',
  'vol.panel.1.title': '교육 분야 전문성',
  'vol.block.1.title': '봉사단 사업 전 과정 운영 전문성',
  'vol.block.1.lead': '카야는 봉사단 사업의 운영 주기 전체를 이해하고, 전 과정을 운영할 수 있는 매뉴얼과 시스템을 갖추어 안정적으로 운영합니다.',
  'vol.photo.0': '/images/business/volunteer-group.jpg',
  'vol.photo.0.alt': '2026 경기청년 기후특사단 단체 사진',
  'vol.photo.1': '/images/business/volunteer-field.jpg?v=2',
  'vol.photo.1.alt': '키르기스스탄 기념 식수',
  'vol.photo.2': '/images/business/volunteer-launch.jpg',
  'vol.photo.2.alt': '경기청년 기후특사단 발대식',
  'res.photo': '/images/business/overseas-edu-quality-1.jpg',
  'res.photoAlt': '키르기스스탄 교사 연수',
  'res.title': '현장의 경험을 연구하고 교육과 개발협력의 방법을 발전시켜, 지속가능한 변화를 만드는 실천에 연결합니다.',
  'res.lead': '카야는 사람의 성장과 지역사회의 변화가 이어질 수 있도록 교육과 개발협력의 방법을 연구합니다. 현장에서 발견한 질문을 바탕으로 교육모델과 사업 운영방식을 발전시키고, 그 경험을 다시 현장과 나눕니다.',
  'res.cta': '연구사업 진행사업 확인하기',
  'res.p.0.title': '현장 기반의 연구',
  'res.p.0.body': '카야의 연구는 <strong>현장에서 출발</strong>합니다. 국내외 현장에서 발견한 실제적인 문제와 <strong>참여자들의 목소리</strong>를 바탕으로, 이론에 그치지 않고 <strong>현장에 즉시 적용</strong>할 수 있는 유의미한 시사점을 도출합니다.',
  'res.p.1.title': '참여와 주도성의 방법론',
  'res.p.1.body': '개발협력과 교육이 일방적인 전달이 되지 않도록, 주민과 참여자가 스스로 문제를 정의하고 해결하는 <strong>‘참여적 개발협력 방법론’</strong>을 연구합니다. 지역사회의 맥락을 존중하며 <strong>자립의 기반</strong>을 다지는 구조를 만듭니다.',
  'res.p.2.title': '배움의 연결과 확산',
  'res.p.2.body': '현장의 경험과 연구 결과를 <strong>교육 모델 및 콘텐츠</strong>로 체계화합니다. <strong>카야 아카데미</strong>, <strong>세미나</strong>, <strong>지식공유 플랫폼</strong>을 통해 실천가 및 시민사회와 배움을 나누며 더 나은 교육과 개발협력의 표준을 함께 만들어갑니다.',
  'res.p.3.title': '지속가능한 소셜 임팩트',
  'res.p.3.body': '사회적 가치가 단발성 지원에 그치지 않고 <strong>자립적인 생태계</strong>로 자리 잡을 수 있도록 <strong>소셜 비즈니스 모델</strong>과 지속가능한 사업 구조를 탐색합니다. <strong>사람의 성장</strong>과 <strong>사회적 가치 창출</strong>이 선순환하는 구조를 연구합니다.',
  'res.card.0.title': '교육연구 사업',
  'res.card.0.desc': '현장의 경험을 바탕으로, 사람의 성장과 지역사회의 변화를 이끄는 교육·개발협력 모델과 방법을 연구하고 나눕니다.',
  'res.card.0.href': '/business/advocacy/projects',
  'res.card.1.title': '소셜비즈니스',
  'res.card.1.desc': '사회적 가치가 지속가능한 변화와 자립으로 이어지는 소셜비즈니스 모델과 사업 구조를 연구합니다.',
  'res.card.1.href': '/business/social',
  'res.card.2.title': '진행사업',
  'res.card.2.desc': '연구로 발전시킨 모델과 방법을 국내외 현장에 적용하고, 그 경험과 성과를 다시 연구와 실천으로 잇습니다.',
  'res.card.2.href': '/business/advocacy/projects',
  'soc.title': '현장의 경험에서 출발한 <span class="wn">소셜비즈니스</span>',
  'soc.lead': '카야는 개발협력과 교육 현장에서 쌓은 경험을 바탕으로 소셜비즈니스를 운영합니다.<br>각 사업은 저마다의 방식으로 사회적 가치를 만듭니다.',
  'soc.aca.photo': '/images/business/research-social-1.jpg',
  'soc.aca.caption': 'KHAYAH Academy 전경',
  'soc.aca.name': '카야 아카데미',
  'soc.aca.lead': '카야가 미얀마 개발협력 현장에서 개발한 교육 프로그램과 학습지로 2024년에 설립한 사회적기업입니다.',
  'soc.aca.more': '카야 아카데미 자세히 보기',
  'soc.aca.href': '/business/social/academy',
  'soc.cnc.logo': '/images/business/color-comfort-logo.png',
  'soc.cnc.name': '컬러앤컴포트',
  'soc.cnc.lead': '다양한 색감과 한끝 다른 편안함을 담은 힐링 라이프스타일 브랜드입니다.',
  'soc.cnc.more': '컬러앤컴포트 자세히 보기',
  'soc.cnc.href': '/business/social/color-and-comfort',
  'soc.cnc.photo': '/images/business/research-social-4.jpg',
  'soc.cnc.caption': '컬러앤컴포트 제품 연출컷',
  'aca.title': '아이들의 <span class="wn">첫 배움</span>을 여는 곳',
  'aca.lead': '카야 아카데미는 2024년 미얀마에 설립한 카야의 사회적기업입니다.<br>개발협력 현장에서 만든 학습지와 교육 프로그램을 Pre-School과 학습지 교육으로 운영합니다.',
  'aca.heroPhoto': '/images/business/overseas-edu-foundation-1.jpg',
  'aca.heroCaption': 'KHAYAH Academy Pre-School 교실',
  'aca.pre.lead': '놀이와 기초학습으로 아이들이 즐겁게 배움을 시작하도록 합니다.',
  'aca.pre.target': '[대상 연령 확인 필요]',
  'aca.pre.study': '[영어·기초학습·놀이활동 등 확인 필요]',
  'aca.book.lead': '미얀마 도시빈민마을에서 개발한 Self-Care 학습지를 심화한 수학·영어 학습지입니다.<br>키르기스스탄에서는 사립 중·고등학교를 대상으로 STEM 온라인 학습 플랫폼을 운영합니다.',
  'aca.csr': '카야 아카데미는 양곤 Dream Seekers Education Center와 만달레이 아동친화공간 운영을 지원합니다.',
  'aca.facebook': '',
  'aca.instagram': '',
  'cnc.title': '다채로운 색, 한끝 다른 <span class="wn">편안함</span>',
  'cnc.lead': '컬러앤컴포트는 카야인터내셔널이 설립한 힐링 라이프스타일 브랜드입니다.<br>다양한 색감과 편안한 착용감의 양말로 일상에 작은 쉼을 전합니다.',
  'cnc.heroPhoto': '/images/business/research-social-4.jpg',
  'cnc.heroCaption': '브랜드 대표 연출컷',
  'cnc.note': '컬러앤컴포트의 수익은 카야인터내셔널의 공익사업에 쓰입니다.',
  'cnc.store': 'https://smartstore.naver.com/colorncomfort?NaPm=ct%3Dmvsy3sck%7Cci%3Dcheckout%7Ctr%3Dds%7Ctrx%3Dnull%7Chk%3D5d38ad1506acfc1d183fc24edac1ef4f7068b1a4',
  'cnc.storeLabel': '온라인 스토어 바로가기',
  'cnc.kakao': 'https://pf.kakao.com/_xiTjks',
  'cnc.kakaoLabel': '단체 구매 문의',
  'cnc.instagram': '',
  'guide.title': '한 번의 도움보다,<br>스스로 서는 힘을 함께 키웁니다.',
  'guide.lead': '후원자님의 나눔이 어디에, 어떻게 쓰이는지<br>이 페이지에서 투명하게 알려 드립니다.',
  'guide.photo': '/images/donor-guide/guide-class.jpg',
  'guide.photoAlt': '교실에서 공부하는 아이들',
  'guide.whereTitle': '후원이 닿는 곳',
  'guide.whereLead': '후원금은 외부 지원만으로는 채우기 어려운 해외 교육 현장에 쓰입니다.',
  'guide.placePhoto': '/images/donor-guide/guide-place.jpg',
  'guide.placeAlt': '[샘플] 미얀마 교육 현장',
  'guide.placeTag': '지금 후원이 가장 필요한 곳 · 미얀마',
  'guide.placeTitle': '미얀마 양곤 · 만달레이',
  'guide.placeBody': '현재 카야의 후원금은 대부분 미얀마 지부의 교육 사업에 쓰이고 있습니다. 양곤 Education Center와 만달레이 지역에서 현지 지부가 직접 아이들을 만나고 있습니다.',
  'guide.item.0.title': '배움의 공간 운영',
  'guide.item.0.body': '교육센터와 아동친화공간(CFS)의 운영비, 교재와 학습 환경을 마련합니다.',
  'guide.item.1.title': '수준에 맞춘 학습 지원',
  'guide.item.1.body': 'Dream Seekers 독서클럽, 수준별 맞춤 학습지, 방과후 학습으로 아이마다 필요한 배움을 채웁니다.',
  'guide.item.2.title': '재난 이후 회복 지원',
  'guide.item.2.body': '지진으로 일상이 흔들린 아이들이 마음의 안정을 되찾고 학업을 이어가도록 돕습니다.',
  'guide.give.0.title': '정기후원',
  'guide.give.0.body': '매월 일정 금액을 정기적으로 후원합니다. 꾸준한 후원은 현장 활동이 끊기지 않고 이어지게 합니다.',
  'guide.give.1.title': '일시후원',
  'guide.give.1.body': '지정하신 금액을 1회 후원합니다. 한 번의 나눔도 현장 활동에 소중한 힘이 됩니다.',
  'guide.give.2.title': '기념일후원',
  'guide.give.2.body': '생일, 첫돌, 결혼기념일 등 특별한 날에 지정하신 금액을 후원합니다.',
  'method.title': '후원 방법',
  'method.lead': '후원 신청부터 납부, 기부금 영수증까지 한 곳에서 안내해 드립니다.',
  'method.happyTitle': '카야의 후원 신청은<br>\'해피나눔\'에서 진행됩니다',
  'method.step.0.title': '회원정보 입력',
  'method.step.0.photo': '/images/donor-guide/step1-member.png',
  'method.step.1.title': '결제정보 선택',
  'method.step.1.photo': '/images/donor-guide/step2-pay.png',
  'method.step.2.title': '동의·전자서명 후 신청',
  'method.step.2.photo': '/images/donor-guide/step3-sign.png',
  'method.pay.0.title': 'CMS 자동이체',
  'method.pay.0.badge': '권장',
  'method.pay.1.title': '신용카드',
  'method.pay.1.badge': '권장',
  'method.receiptTitle': '후원회원이 되시면',
  'method.contactTitle': '정보 변경과 후원 문의',
  'method.contactBody': '주소·연락처·결제 정보가 바뀌면 꼭 알려 주세요. 카야의 소식과 기부금 영수증을 정확히 전해 드릴 수 있습니다. 온라인 신청이 어려우시면 전화로도 신청을 도와드립니다.',
}

const SECTIONS: BizSection[] = [
  ['soc.hero', 'social', 1],
  ['soc.academy', 'social', 2],
  ['soc.cnc', 'social', 3],
  ['aca.hero', 'academy', 1],
  ['aca.pre', 'academy', 2],
  ['aca.book', 'academy', 3],
  ['aca.csr', 'academy', 4],
  ['cnc.hero', 'cnc', 1],
  ['cnc.brand', 'cnc', 2],
  ['cnc.products', 'cnc', 3],
  ['cnc.buy', 'cnc', 4],
  ['guide.hero', 'guide', 1],
  ['guide.where', 'guide', 2],
  ['guide.impact', 'guide', 3, false],
  ['guide.open', 'guide', 4],
  ['guide.give', 'guide', 5],
  ['method.happy', 'method', 1],
  ['method.steps', 'method', 2],
  ['method.pay', 'method', 3],
  ['method.receipt', 'method', 4],
  ['method.contact', 'method', 5],
].map(([id, page, order, enabled]) => ({
  id: String(id),
  page: String(page),
  order: Number(order),
  enabled: enabled !== false,
}))

const MENU: BizMenuItem[] = [
  ['domestic', 1],
  ['domesticEducation', 1],
  ['domesticProjects', 2],
  ['overseas', 2],
  ['overseasEducation', 1],
  ['overseasVolunteer', 2],
  ['overseasProjects', 3],
  ['advocacy', 3],
  ['researchProjects', 1],
  ['researchSocial', 4],
  ['socialAcademy', 1],
  ['socialComfort', 2],
].map(([key, order]) => ({ key: String(key), order: Number(order) }))

const ITEM_IDS = [
  'dom.p.0', 'dom.p.1', 'dom.p.2',
  'dedu.0', 'dedu.1', 'dedu.2',
  'ovs.p.0', 'ovs.p.1', 'ovs.p.2', 'ovs.p.3',
  'res.p.0', 'res.p.1', 'res.p.2', 'res.p.3',
  'res.card.0', 'res.card.1', 'res.card.2',
  'guide.item.0', 'guide.item.1', 'guide.item.2',
  'guide.give.0', 'guide.give.1', 'guide.give.2',
]

function itemSections(): BizSection[] {
  const count = new Map<string, number>()
  return ITEM_IDS.map((id) => {
    const page = id.replace(/\.\d+$/, '')
    const order = (count.get(page) ?? 0) + 1
    count.set(page, order)
    return { id, page, order, enabled: true }
  })
}

export function defaultBizSupportDocument(): BizSupportDocument {
  return {
    version: 1,
    fields: { ...FIELDS },
    sections: [...SECTIONS, ...itemSections()],
    menu: MENU.map((row) => ({ ...row })),
    otherBusiness: 'manual',
    grantsPublic: false,
    donate: {
      url: NANUM,
      labelKo: '지금 바로 후원하기 ♥',
      menuLabel: '후원하기',
      receiptNote: '',
      inquiry: '',
      impactEnabled: false,
    },
  }
}

function normalize(body: unknown): BizSupportDocument {
  const base = defaultBizSupportDocument()
  if (!isPlainObject(body)) return base
  const incoming = isPlainObject(body.fields) ? body.fields : {}
  const fields: Record<string, string> = {}
  for (const key of Object.keys(FIELDS)) fields[key] = text(incoming[key], FIELDS[key])
  const sectionRows = Array.isArray(body.sections) ? body.sections : base.sections
  const known = new Map(base.sections.map((row) => [row.id, row]))
  const sections = base.sections.map((row) => {
    const found = sectionRows.find((item) => isPlainObject(item) && item.id === row.id)
    const item = isPlainObject(found) ? found : known.get(row.id)!
    return {
      id: row.id,
      page: row.page,
      order: Math.round(num(item.order, row.order)),
      enabled: flag(item.enabled, row.enabled),
    }
  })
  const menuRows = Array.isArray(body.menu) ? body.menu : base.menu
  const menu = base.menu.map((row) => {
    const found = menuRows.find((item) => isPlainObject(item) && item.key === row.key)
    const item = isPlainObject(found) ? found : row
    return { key: row.key, order: Math.round(num(item.order, row.order)) }
  })
  const donate = isPlainObject(body.donate) ? body.donate : {}
  return {
    version: 1,
    fields,
    sections,
    menu,
    otherBusiness: body.otherBusiness === 'auto' ? 'auto' : 'manual',
    grantsPublic: flag(body.grantsPublic, false),
    donate: {
      url: text(donate.url, NANUM, 400),
      labelKo: text(donate.labelKo, base.donate.labelKo, 40),
      menuLabel: text(donate.menuLabel, base.donate.menuLabel, 20),
      receiptNote: text(donate.receiptNote, '', 400),
      inquiry: text(donate.inquiry, '', 200),
      impactEnabled: flag(donate.impactEnabled, false),
    },
  }
}

export async function readBizSupportDocument(): Promise<BizSupportDocument> {
  try {
    return normalize(await readJsonDocument(DOCUMENT_KEY))
  } catch (e) {
    const status = (e as Error & { status?: number }).status
    if (status === 404) return defaultBizSupportDocument()
    throw e
  }
}

export async function writeBizSupportDocument(body: unknown): Promise<void> {
  if (!isPlainObject(body) || body.version !== 1) {
    const err = new Error('Invalid biz support payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  await writeJsonDocument(DOCUMENT_KEY, normalize(body))
}
