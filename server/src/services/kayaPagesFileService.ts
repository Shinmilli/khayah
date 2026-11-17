import { readJsonDocument, writeJsonDocument } from './siteDocumentStore'

const DOCUMENT_KEY = 'kaya-pages'

export type KayaMember = {
  id: string
  group: '이사회' | '전문위원회'
  order: number
  enabled: boolean
  badge: string
  name: string
  nameEn: string
  role: string
  bio: string
  bioEn: string
  showTerm: boolean
  termStart: string
  termEnd: string
}

export type KayaPagesDocument = {
  version: 1
  fields: Record<string, string>
  members: KayaMember[]
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

const DEFAULT_FIELDS: Record<string, string> = {
  'intro.photo': '/images/about/kaya-intro.jpg',
  'intro.photoAlt': '키르기스스탄 STEM 교육 현장',
  'intro.captionKicker': '현장',
  'intro.caption': '키르기스스탄 STEM 교육',
  'intro.headline': '한 사람의 성장이<br /><span class="kaya-wine">세상을 밝히는 빛</span>이<br />되도록',
  'intro.lead': '카야는 교육을 통해 사람을 키우고, 그 사람이 다시 이웃과 지역을 변화시키는 길을 함께 걷습니다.',
  'intro.chip.0': '해외 지부 2곳',
  'intro.chip.1': '이사·전문위원 [00]명',
  'intro.chip.2': '설립 [0000]년',
  'intro.definitionPoint': '카야는 사람을 키우고 섬기는 개발 NGO입니다.',
  'intro.definition':
    '카야는 올바른 배움과 인도를 통해 성장한 한 사람이 큰 변화를 이끌어 낼 수 있다고 믿습니다. 그렇게 성장한 사람들이 온 땅 곳곳에서 세상을 밝히는 빛이 되기를 소망합니다.',
  'intro.vision': '카야는 인종과 종교, 이념의 벽을 넘어 모든 소외된 이웃이 스스로 성장하여 가정과 사회의 변화를 이끄는 세상을 꿈꿉니다.',
  'intro.mission': '카야는 사람 중심의 사업 개발을 통해 세상의 모든 소외된 이웃이 스스로 설 수 있는 길을 함께 찾습니다.',
  'intro.value.0.title': '인간 존엄',
  'intro.value.0.desc': '모든 사람이 지닌 고유한 존엄성을 존중하며, 사람을 모든 사업의 중심에 둡니다.',
  'intro.value.1.title': '비차별과 협력',
  'intro.value.1.desc': '인종·종교·이념의 차이를 넘어 모든 이웃을 존중하고, 지역사회와 협력합니다.',
  'intro.value.2.title': '전문성',
  'intro.value.2.desc': '현장에서 쌓은 역량과 전문성을 바탕으로 일합니다.',
  'intro.value.3.title': '혁신',
  'intro.value.3.desc': '현장의 목소리에 귀 기울이며, 새로운 방법으로 지속 가능한 변화를 모색합니다.',
  'intro.value.4.title': '사회적 책임',
  'intro.value.4.desc': '이웃을 사랑하는 참된 그리스도인의 삶을 실천합니다.',
  'ci.image': '/images/logo/khayah_logo.png',
  'ci.imageAlt': 'KHAYAH',
  'greet.photo': '/images/about/greeting-representative.png',
  'greet.photoAlt': '카야(KHAYAH) 대표 최순태',
  'greet.title': '<span class="gm-wine">함께하는</span> 마음으로',
  'greet.sub': '나눔과 섬김의 실천을 위하여',
  'greet.role': '카야(KHAYAH) 대표',
  'greet.name': '최순태',
  'greet.lead':
    '남을 돕는다는 것은 어디선가 보고 들은 것처럼 결코 쉬운 일은 아닌 듯 보입니다.<br />내가 힘겹게 얻어낸 것의 일부분을 떼어 주거나,<br />천금 같은 나의 귀중한 시간을 쪼개서 써야 하기 때문이지요.<br /><span class="gm-wine">하지만 그 쉽지 않은 일에 대한 보상은 남다릅니다.</span>',
  'greet.body.0':
    '나눔과 도움을 실천하는 일을 업으로 삼은 이후 가장 많이 받는 질문 중 하나는 &lsquo;어쩌다 이쪽 일을 시작하게 되었느냐&rsquo;입니다. 보통 잘 이해가 되지 않는다는 표정들을 하고 계시지요.',
  'greet.body.1':
    '저의 대답은 항상 간단합니다.<br /><strong>&lsquo;당신도 나와 같은 경험을 하게 되면 그 답을 알게 될 겁니다.&rsquo;</strong> 무미건조해 보일지도 모르지만,<br />전 감사하게도 언제나 진심으로 대답할 수 있었습니다.',
  'greet.body.2':
    '길거리에서 무거운 짐을 들고 가는 노인을 도와주신 경험이 다들 한 번씩은 있으실 겁니다.<br />전혀 어렵고 대단한 일이 아닙니다. 기분이 어떠셨는지요? 저는 나눔을 직업으로 삼으면서 그 기분을 매 순간 느끼며 살아가고 있습니다. <span class="gm-mark">한 생명을 살리고, 한 학생이 나의 도움으로 웃으며 자라나는 모습을 보는 것은 이 세상 그 어떤 기쁨과도 견줄 수 없습니다.</span>',
  'greet.body.3':
    '여러분, 지금 주위를 한번 둘러보시기 바랍니다.<br />단 몇 분 거리, 또는 몇 시간 거리에, 여러분의 관심과 작은 손길로 환하게 웃을 수 있는 이웃들이 너무도 많이 있습니다.',
  'greet.body.4':
    '그들에게 손을 내미는 일에 주저하지 마시기 바랍니다.<br />&lsquo;나중에&rsquo;, &lsquo;돈 많이 벌면&rsquo;, &lsquo;시간 될 때&rsquo;만 할 수 있는 일이 절대 아닙니다. <span class="gm-mark">지금 당장, 돈 없어도, 시간이 많지 않아도, 어느 때고 할 수 있는 것이 바로 나눔입니다.</span>',
  'greet.body.5':
    '이 세상의 모든 생명은 모두 하나님의 귀한 창조물이며, 고통 받는 이들을 불쌍히 여기고 돕는 것은 이 땅 위의 모든 이들이 가슴에 품고 살아가야 하는 소명입니다. 다시 살아남을 뜻하는 단체명 카야처럼, <strong class="gm-wine">여러분의 인생에도 진정한 부흥, 카야가 휘몰아치기를 기원합니다.</strong>',
  'greet.signRole': '카야(KHAYAH) 대표',
  'greet.signName': '최순태',
  'greet.quote':
    '카야와 함께, 여러분의 삶에도<br>진정한 나눔, 진정한 변화가<br>함께하기를 기원합니다.<span class="sig-quote-mark sig-quote-mark--close">&rdquo;</span>',
  'greet.sigNameKo': '최 순 태',
  'org.title': '각자의 전문성이 모여<br /><span class="kaya-wine">하나의 변화를 만듭니다.</span>',
  'org.lead':
    '카야는 국제개발협력사업, 대외협력홍보, 경영지원의 세 부문이 유기적으로 협력하여 공동의 목표를 실현합니다.<br />이사회는 조직의 주요 의사결정과 책임 있는 운영을 이끌고,<br />전문위원은 분야별 전문지식과 경험을 바탕으로 사업의 전문성을 강화합니다.',
  'org.image': '/images/about/org-chart.jpg',
  'org.imageAlt': '카야 조직도: 국제개발협력사업, 대외협력홍보, 경영지원 세 부문이 맞물리고, 양옆에 이사회와 전문위원이 함께함',
  'org.peopleTitle': '카야의 성장과 변화를 <span class="kaya-wine">함께 만드는 사람들</span>',
  'trans.introTitle': '투명하게 운영하고, 정직하게 보고합니다.',
  'trans.introBody':
    '카야는 후원자와 협력기관이 보내주신 신뢰를 가장 소중한 자산으로 여깁니다. 모든 재정을 관련 법령과 내부 규정에 따라 관리하고, 운영 현황과 재무 정보를 정기적으로 공개합니다.',
  'trans.chip.0': '내부 감사',
  'trans.chip.1': '외부 감사',
  'trans.chip.2': '재무 공개',
  'trans.action.0': '공익법인 결산서류 등 공시',
  'trans.action.1': '기부금 모금액 및 활용실적 공시',
  'trans.action.2': '공익위반사항 제보',
  'trans.principlesTitle': '감사와 공시로 재정의 <span>투명성</span>을 지킵니다.',
  'trans.principle.0.title': '내부 감사',
  'trans.principle.0.body': '예산과 결산은 이사회의 심의와 의결을 거치며, 감사가 법인의 재무와 업무 집행을 정기적으로 점검합니다.',
  'trans.principle.1.title': '외부 감사',
  'trans.principle.1.body': '외부 회계 전문가의 회계감사를 통해 재무 처리의 정확성과 적정성을 검증합니다.',
  'trans.principle.2.title': '재무 공개',
  'trans.principle.2.body':
    '국세청 공익법인 결산서류 공시와 기부금 모금액 및 활용실적 공개를 매년 이행하고, 연도별 재무보고를 홈페이지에 게시합니다.',
  'trans.complianceTitle': '법령에 따른 공시와 정보 제공, 후원자 소통을 성실히 이행합니다.',
  'trans.compliance.0.dt': '홈페이지 공개',
  'trans.compliance.0.dd': '기관 소개, 이사회·전문위원 명단, 사업 소개, 연도별 재무보고',
  'trans.compliance.1.dt': '국세청 공시',
  'trans.compliance.1.dd': '공익법인 결산서류 등 공시 (매년)',
  'trans.compliance.2.dt': '기부금 공개',
  'trans.compliance.2.dd': '기부금 모금액 및 활용실적 공개 (매년)',
  'trans.compliance.3.dt': '기부금영수증',
  'trans.compliance.3.dd': '연말정산 간소화 자료 제출 및 후원자 요청 시 발급',
  'trans.compliance.4.dt': '후원자 소통',
  'trans.compliance.4.dd': '전화·이메일·온라인 문의 창구 운영',
  'trans.compliance.5.dt': '공익신고',
  'trans.compliance.5.dd': '국민권익위원회 신고 창구 연결',
  'trans.supportTitle': '투명하게 운영되는 나눔에 함께해 주세요',
  'trans.supportButton': '후원하러 가기',
}

const DEFAULT_MEMBERS: KayaMember[] = [
  ['d1', '이사회', '이사', '최순태', '카야 대표이사'],
  ['d2', '이사회', '상임이사', '김선우', '카야 상임이사'],
  ['d3', '이사회', '이사', '김경휘', '전주예수대 사회복지학과 교수'],
  ['d4', '이사회', '이사', '이재혁', '성남시의료원 가정의학과 전문의'],
  ['d5', '이사회', '이사', '이필우', '법무법인 강남 변호사'],
  ['d6', '이사회', '이사', 'Stephan Hyosik Rhee', 'Leeway Global Network, Inc. 대표'],
  ['d7', '이사회', '감사', '홍민', '법률사무소 에스제이파트너스 변호사'],
  ['e1', '전문위원회', '전문위원', '정재훈', '인류학박사(교육 인류학), 국제개발협력 컨설턴트'],
  ['e2', '전문위원회', '전문위원', '임진호', '(전)한국기술교육대학교 개도국기술이전연구소 교수'],
  ['e3', '전문위원회', '전문위원', '최윤석', '매표화학 대표'],
  ['e4', '전문위원회', '전문위원', '황남기', '(주)합격캠프 대표'],
  ['e5', '전문위원회', '전문위원', '이재운', '홍콩 중문대학교 법학과 교수'],
  ['e6', '전문위원회', '전문위원', '오나영', 'ONA Creation 대표'],
  ['e7', '전문위원회', '전문위원', '김찬민', '성균관대학교 통계학과 교수'],
  ['e8', '전문위원회', '전문위원', '노형우', '(주)코아스 사장'],
  ['e9', '전문위원회', '전문위원', '이진영', '(주)The Organic 디오 대표'],
  ['e10', '전문위원회', '전문위원', '고현학', '신한라이프 신강남지점 지점장'],
  ['e11', '전문위원회', '전문위원', '정영미', '준오헤어 미금지점 원장'],
  ['e12', '전문위원회', '전문위원', '박래형', '노무라종합연구소 뉴욕 지부 컨설팅 부문 대표'],
  ['e13', '전문위원회', '전문위원', '나용범', '(주)한국C&S 대표'],
  ['e14', '전문위원회', '전문위원', '김창현', 'AA Studio 대표'],
  ['e15', '전문위원회', '전문위원', '변선주', 'CINCO PANES 대표'],
  ['e16', '전문위원회', '전문위원', '김은수', 'Child Fund International Research & Learning Senior Advisor'],
].map(([id, group, badge, name, role]) => ({
  id,
  group: group as KayaMember['group'],
  order: Number(id.replace(/\D/g, '')) || 1,
  enabled: true,
  badge,
  name,
  nameEn: '',
  role,
  bio: '',
  bioEn: '',
  showTerm: false,
  termStart: '',
  termEnd: '',
}))

export function defaultKayaPagesDocument(): KayaPagesDocument {
  return { version: 1, fields: { ...DEFAULT_FIELDS }, members: DEFAULT_MEMBERS.map((row) => ({ ...row })) }
}

function normalize(body: unknown): KayaPagesDocument {
  const base = defaultKayaPagesDocument()
  if (!isPlainObject(body)) return base
  const incoming = isPlainObject(body.fields) ? body.fields : {}
  const fields: Record<string, string> = {}
  for (const key of Object.keys(DEFAULT_FIELDS)) {
    fields[key] = text(incoming[key], DEFAULT_FIELDS[key])
  }
  const rows = Array.isArray(body.members) ? body.members : base.members
  const members = rows.slice(0, 80).map((row, i) => {
    const item = isPlainObject(row) ? row : {}
    const group = item.group === '전문위원회' ? '전문위원회' : '이사회'
    return {
      id: text(item.id, `m-${i + 1}`, 40) || `m-${i + 1}`,
      group,
      order: Math.round(num(item.order, i + 1)),
      enabled: flag(item.enabled, true),
      badge: text(item.badge, '', 40),
      name: text(item.name, '', 80),
      nameEn: text(item.nameEn, '', 80),
      role: text(item.role, '', 200),
      bio: text(item.bio, '', 500),
      bioEn: text(item.bioEn, '', 500),
      showTerm: flag(item.showTerm, false),
      termStart: text(item.termStart, '', 40),
      termEnd: text(item.termEnd, '', 40),
    } satisfies KayaMember
  })
  return { version: 1, fields, members }
}

export async function readKayaPagesDocument(): Promise<KayaPagesDocument> {
  try {
    const parsed = await readJsonDocument(DOCUMENT_KEY)
    return normalize(parsed)
  } catch (e) {
    const status = (e as Error & { status?: number }).status
    if (status === 404) return defaultKayaPagesDocument()
    throw e
  }
}

export async function writeKayaPagesDocument(body: unknown): Promise<void> {
  if (!isPlainObject(body) || body.version !== 1) {
    const err = new Error('Invalid kaya pages payload')
    ;(err as Error & { status?: number }).status = 400
    throw err
  }
  await writeJsonDocument(DOCUMENT_KEY, normalize(body))
}
