import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

type Kind = '공지사항' | '활동소식' | '연간소식지' | '언론보도' | '스토리' | '진행사업'

const rawUrl = process.env.DATABASE_URL?.trim()
if (!rawUrl) {
  throw new Error('DATABASE_URL is required to run seeds.')
}

function stripSslQueryParams(url: string): string {
  try {
    const u = new URL(url)
    ;['sslmode', 'ssl', 'sslaccept', 'sslcert', 'sslkey', 'sslrootcert'].forEach((k) => u.searchParams.delete(k))
    return u.toString()
  } catch {
    return url.replace(/[?&]sslmode=[^&]*/gi, '').replace(/[?&]sslaccept=[^&]*/gi, '')
  }
}

const connectionString = stripSslQueryParams(rawUrl)
const isRemote = /supabase\.com|render\.com|amazonaws\.com|pooler\./i.test(connectionString)
const pool = new pg.Pool({
  connectionString,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const COVER = {
  classroom: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=800&fit=crop',
  children: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773f?w=1200&h=800&fit=crop',
  community: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=800&fit=crop',
  volunteer: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=800&fit=crop',
  health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=800&fit=crop',
  books: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=800&fit=crop',
  nepal: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&h=800&fit=crop',
  outdoor: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=1200&h=800&fit=crop',
  workshop: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&h=800&fit=crop',
  hands: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&h=800&fit=crop',
  stem: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=800&fit=crop',
  medical: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=800&fit=crop',
  reading: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&h=800&fit=crop',
  meeting: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=800&fit=crop',
  mountains: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1200&h=800&fit=crop',
} as const

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function isoDaysAgo(days: number): Date {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() - days)
  return d
}

function ymd(daysAgo: number): string {
  return isoDaysAgo(daysAgo).toISOString().slice(0, 10)
}

function html(lead: string, paragraphs: string[], extras = ''): string {
  const body = paragraphs.map((p) => `<p>${p}</p>`).join('\n')
  return `<p><strong>${lead}</strong></p>\n${body}${extras ? `\n${extras}` : ''}`
}

function deriveExcerptFromHtml(raw: string): string {
  const text = raw
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.slice(0, 72)
}

async function ensureSeedAuthorId(): Promise<number> {
  const existing = await prisma.user.findFirst({ select: { id: true } })
  if (existing) return existing.id

  const created = await prisma.user.create({
    data: {
      userLogin: 'admin',
      userPass: 'seed',
      userNicename: 'admin',
      userEmail: 'admin@example.org',
      userUrl: '',
      userActivationKey: '',
      userStatus: 0,
      displayName: '카야 인터내셔널',
    },
    select: { id: true },
  })
  return created.id
}

async function deleteSeedKinds(kinds: Kind[]) {
  const metas = await prisma.postMeta.findMany({
    where: { metaKey: 'khayah_kind', metaValue: { in: kinds } },
    select: { postId: true },
  })
  const postIds = Array.from(new Set(metas.map((m) => m.postId)))
  if (postIds.length === 0) return

  const commentIds = await prisma.comment.findMany({
    where: { postId: { in: postIds } },
    select: { id: true },
  })
  const ids = commentIds.map((c) => c.id)
  if (ids.length) {
    await prisma.commentMeta.deleteMany({ where: { commentId: { in: ids } } })
  }
  await prisma.comment.deleteMany({ where: { postId: { in: postIds } } })
  await prisma.termRelationship.deleteMany({ where: { objectId: { in: postIds } } })
  await prisma.postMeta.deleteMany({ where: { postId: { in: postIds } } })
  await prisma.post.deleteMany({ where: { id: { in: postIds } } })
}

async function createPost(params: {
  authorId: number
  kind: Kind
  title: string
  excerpt?: string
  contentHtml: string
  date: Date
  meta?: Array<{ key: string; value: string }>
}) {
  const postName = slugify(`${params.kind}-${params.title}`).slice(0, 190)
  const excerpt = (params.excerpt ?? deriveExcerptFromHtml(params.contentHtml)).trim()
  const created = await prisma.post.create({
    data: {
      postAuthorId: params.authorId,
      postDate: params.date,
      postDateGmt: params.date,
      postModified: params.date,
      postModifiedGmt: params.date,
      postTitle: params.title,
      postExcerpt: excerpt,
      postContent: params.contentHtml,
      postStatus: 'publish',
      postName,
      postType: 'post',
      guid: '',
      postMimeType: '',
      commentStatus: 'closed',
      pingStatus: 'closed',
      postPassword: '',
      postParent: 0,
      menuOrder: 0,
    },
    select: { id: true },
  })

  await prisma.postMeta.createMany({
    data: [
      { postId: created.id, metaKey: 'khayah_kind', metaValue: params.kind },
      ...(params.meta ?? []).map((m) => ({ postId: created.id, metaKey: m.key, metaValue: m.value })),
    ],
  })
}

async function seed() {
  const kinds: Kind[] = ['공지사항', '활동소식', '연간소식지', '언론보도', '스토리', '진행사업']
  const authorId = await ensureSeedAuthorId()
  await deleteSeedKinds(kinds)

  const notices: Array<{ title: string; daysAgo: number; lead: string; body: string[] }> = [
    {
      title: '2026년 하반기 정기후원 자동이체일 안내',
      daysAgo: 4,
      lead: '정기후원 자동이체는 매월 25일에 진행됩니다.',
      body: [
        '사단법인 카야 인터내셔널을 후원해 주시는 분들께 감사드립니다. 하반기부터 자동이체 출금일은 매월 25일로 통일됩니다.',
        '출금일 변경이 필요하시거나 후원 내역 확인을 원하시면 사무국(070-5121-2198, khayahinternational@gmail.com)으로 연락 부탁드립니다.',
        '후원금은 국내·해외 교육 및 보건 현장, 세계시민교육에 투명하게 사용됩니다.',
      ],
    },
    {
      title: '[모집] 2026 네팔 단기 현장방문팀 (10월)',
      daysAgo: 9,
      lead: '카트만두 도시빈민 마을 꿈도서관 현장을 함께 볼 방문팀을 모집합니다.',
      body: [
        '기간은 10월 13일(월)부터 19일(일)까지이며, 현지 청소년 독서클럽과 학교보건 활동을 참관합니다.',
        '대상은 만 19세 이상 후원자·관심자이며, 선발 인원은 8명입니다. 신청 마감은 9월 20일입니다.',
        '일정·경비·준비물 안내는 신청자께 개별 발송합니다. 신청: khayahinternational@gmail.com',
      ],
    },
    {
      title: '2025 연간보고서 및 재정보고 공개',
      daysAgo: 18,
      lead: '2025년 사업 성과와 후원금 사용 내역을 공개합니다.',
      body: [
        '홈페이지 재정보고 메뉴에서 재무상태표·운영성과표와 기부금 활용 실적을 확인하실 수 있습니다.',
        '국세청 공익법인 결산서류 공시, 기부금 모금액 및 활용 실적 공시도 함께 확인해 주세요.',
        '문의는 사무국 이메일로 부탁드립니다.',
      ],
    },
    {
      title: '사무국 추석 연휴 휴무 안내',
      daysAgo: 28,
      lead: '추석 연휴 기간 동안 사무국이 휴무합니다.',
      body: [
        '휴무 기간은 9월 24일(수)부터 9월 28일(일)까지입니다. 9월 29일(월)부터 정상 업무를 재개합니다.',
        '후원 관련 문의와 기부금 영수증 요청은 연휴 이후 순차적으로 회신드립니다.',
        '현장에 계신 파트너와 후원자 여러분, 풍성한 명절 보내시기 바랍니다.',
      ],
    },
    {
      title: '2025년 기부금 영수증 발급 안내',
      daysAgo: 72,
      lead: '연말정산용 기부금 영수증을 발급해 드립니다.',
      body: [
        '2025년 1월 1일부터 12월 31일까지 후원하신 내역에 대해 국세청 연말정산 간소화 서비스를 통해 조회하실 수 있습니다.',
        '간소화에 반영되지 않은 건은 사무국으로 성함, 주민등록번호(또는 사업자번호), 연락처를 보내 주시면 개별 발급합니다.',
        '카야는 지정기부금단체로, 세액공제 혜택을 받으실 수 있습니다.',
      ],
    },
    {
      title: '개인정보 처리방침 개정 안내',
      daysAgo: 110,
      lead: '후원자·문의자 개인정보 처리방침이 일부 개정되었습니다.',
      body: [
        '개정 내용은 보유 기간 명확화, 처리 위탁 현황 현행화입니다. 시행일은 2026년 5월 1일입니다.',
        '자세한 내용은 홈페이지 하단 개인정보 처리방침에서 확인하실 수 있습니다.',
      ],
    },
    {
      title: '정기이사회 개최 및 2026 사업계획 승인',
      daysAgo: 155,
      lead: '제1차 정기이사회에서 2026년 사업계획과 예산이 승인되었습니다.',
      body: [
        '네팔·키르기즈스탄·미얀마 교육·보건 사업과 국내 외국인노동자·탈북청년 교육 프로그램을 중심으로 사업을 이어갑니다.',
        '이사회·전문위원 구성은 카야 소개 페이지에서 확인하실 수 있습니다.',
      ],
    },
    {
      title: '홈페이지 개편 및 후원 안내 페이지 오픈',
      daysAgo: 200,
      lead: '카야 공식 홈페이지가 새로워졌습니다.',
      body: [
        '스토리, 진행사업, 재정보고를 한곳에서 보실 수 있도록 구성을 정리했습니다.',
        '정기후원·일시후원 안내는 후원 안내 메뉴를 이용해 주세요. 불편 사항은 고객 문의로 남겨 주시면 됩니다.',
      ],
    },
  ]

  for (const row of notices) {
    await createPost({
      authorId,
      kind: '공지사항',
      title: row.title,
      contentHtml: html(row.lead, row.body),
      date: isoDaysAgo(row.daysAgo),
      meta: [{ key: 'khayah_notice', value: 'true' }],
    })
  }

  const activities: Array<{
    title: string
    daysAgo: number
    tag: string
    cover: string
    lead: string
    body: string[]
  }> = [
    {
      title: '네팔 꿈도서관, 우기 독서캠프를 열었습니다',
      daysAgo: 6,
      tag: '현장',
      cover: COVER.reading,
      lead: '카트만두 도시빈민 마을 꿈도서관에서 사흘간 여름 독서캠프를 진행했습니다.',
      body: [
        '초등학생 42명이 그림책 읽기와 이야기 나누기에 참여했고, 현지 교사와 카야 활동가가 함께 수업을 이끌었습니다.',
        '캠프 마지막 날에는 아이들이 직접 만든 작은 책을 마을 벽에 전시했습니다. 다음 학기에도 주 2회 독서클럽을 이어갑니다.',
      ],
    },
    {
      title: '키르기즈스탄 STEM 교실 2기 개강',
      daysAgo: 14,
      tag: '교육',
      cover: COVER.stem,
      lead: '비슈케크 도시 외곽 학교에서 STEM 역량 강화 과정 2기가 시작됐습니다.',
      body: [
        '중학생 30명이 기초 실험, 코딩 입문, 팀 프로젝트에 참여합니다. 현지 과학교사 연수도 함께 열었습니다.',
        '1기 수료생 중 6명은 이번 학기 멘토로 남았습니다. 배운 것을 다시 나누는 구조가 조금씩 자리를 잡고 있습니다.',
      ],
    },
    {
      title: '미얀마 양곤, 학부모 보건 세미나',
      daysAgo: 21,
      tag: '보건',
      cover: COVER.health,
      lead: '도시빈민 마을 학부모 50여 명과 손 씻기·영양·기초 위생 교육을 진행했습니다.',
      body: [
        '학교보건 담당 교사와 함께 가정에서 바로 적용할 수 있는 실천 목록을 만들었습니다.',
        '다음 달에는 학생 대상 신체검사와 보건 책자 배포가 이어질 예정입니다.',
      ],
    },
    {
      title: '외국인노동자 기술교육 14기 수료식',
      daysAgo: 33,
      tag: '교육',
      cover: COVER.workshop,
      lead: '성남에서 열린 기술·창업 교육 14기 수료식에 수료생 18명이 참석했습니다.',
      body: [
        '용접·전기 기초와 소규모 창업 회계를 함께 배웠고, 귀국 후 지역에서 나눔으로 이어지도록 멘토링을 연결했습니다.',
        '수료생 대표는 “기술을 배우는 시간이 곧 자존감을 회복하는 시간이었다”고 전했습니다.',
      ],
    },
    {
      title: '분당 중학교 세계시민교육 특강',
      daysAgo: 41,
      tag: '캠페인',
      cover: COVER.classroom,
      lead: '국제개발협력과 한국의 ODA를 주제로 2학년 네 학급 수업을 진행했습니다.',
      body: [
        '원조와 개발의 차이, 현지 주민이 주체가 되는 사업이 왜 중요한지를 사례로 나눴습니다.',
        '학생들은 네팔 꿈도서관 사진을 보며 ‘우리가 도울 수 있는 일’을 조별로 발표했습니다.',
      ],
    },
    {
      title: '후원자 초청 2026 상반기 현장보고회',
      daysAgo: 55,
      tag: '캠페인',
      cover: COVER.meeting,
      lead: '서울에서 상반기 사업 보고와 질의응답을 진행했습니다.',
      body: [
        '네팔·키르기즈스탄·국내 교육 현장 소식을 영상과 함께 공유했고, 후원금 사용 비율도 설명했습니다.',
        '참석자 40여 명과 함께 하반기 학교보건 확대 계획을 나눴습니다.',
      ],
    },
    {
      title: '네팔 학교 손 씻기 시설 보수 완료',
      daysAgo: 68,
      tag: '현장',
      cover: COVER.nepal,
      lead: '우기에 고장이 잦던 급수대를 마을 기술자와 함께 고쳤습니다.',
      body: [
        '시설만 바꾸는 것이 아니라, 학생 보건 동아리가 매일 점검하는 규칙을 만들었습니다.',
        '카야는 외부 지원이 끝난 뒤에도 유지될 수 있는 방식을 현지와 함께 찾는 것을 원칙으로 합니다.',
      ],
    },
    {
      title: '탈북청년 소셜비즈니스 멘토링 데이',
      daysAgo: 82,
      tag: '교육',
      cover: COVER.community,
      lead: '국내 정착한 청년 12명이 사회적 기업가 멘토와 사업 아이디어를 다듬었습니다.',
      body: [
        '교육·돌봄·공정무역을 주제로 한 아이디어가 나왔고, 하반기 파일럿 지원 대상 3팀을 선정할 예정입니다.',
        '카야의 국내 사업은 참여자가 다시 해외 현장에 기여할 수 있는 연속성을 지향합니다.',
      ],
    },
    {
      title: '청소년 ‘지구촌 이웃’ 캠페인 부스',
      daysAgo: 96,
      tag: '캠페인',
      cover: COVER.hands,
      lead: '성남 지역 청소년 축제에서 세계시민교육 부스를 운영했습니다.',
      body: [
        '방문객 200여 명이 네팔·키르기즈스탄 사진 카드를 보고 한 문장 응원을 남겼습니다.',
        '모인 응원 메시지는 현지 교실 벽에 붙일 수 있도록 번역해 전달할 예정입니다.',
      ],
    },
    {
      title: '자원봉사자 오리엔테이션 — 번역·수업 보조',
      daysAgo: 120,
      tag: '현장',
      cover: COVER.volunteer,
      lead: '하반기 자원봉사자 15명이 사무국에서 오리엔테이션을 받았습니다.',
      body: [
        '영어·네팔어 번역, 국내 교육 프로그램 수업 보조, 소식지 편집을 중심으로 역할을 나눴습니다.',
        '관심 있는 분은 고객 문의 게시판이나 이메일로 상시 지원할 수 있습니다.',
      ],
    },
  ]

  for (const row of activities) {
    await createPost({
      authorId,
      kind: '활동소식',
      title: row.title,
      contentHtml: html(row.lead, row.body),
      date: isoDaysAgo(row.daysAgo),
      meta: [
        { key: 'khayah_activity_tag', value: row.tag },
        { key: 'khayah_cover_url', value: row.cover },
      ],
    })
  }

  const newsletters: Array<{
    year: number
    issue: string
    title: string
    mode: '글쓰기 모드' | 'PDF 업로드 모드'
    daysAgo: number
    cover: string
    lead: string
    body: string[]
  }> = [
    {
      year: 2026,
      issue: '2',
      title: '카야 소식지 2026 여름호',
      mode: '글쓰기 모드',
      daysAgo: 12,
      cover: COVER.outdoor,
      lead: '상반기 네팔 꿈도서관과 키르기즈스탄 STEM 교실 이야기를 담았습니다.',
      body: [
        '여름호는 ‘스스로 이어가는 교실’을 주제로 합니다. 외부 강사가 떠난 뒤에도 현지 교사와 청소년이 모임을 유지하는 장면을 기록했습니다.',
        '국내에서는 외국인노동자 수료식과 세계시민교육 학교 방문 소식을 소개합니다.',
        '후원자 인터뷰는 10년째 정기후원을 이어 오신 김○○ 님의 이야기를 실었습니다.',
      ],
    },
    {
      year: 2026,
      issue: '1',
      title: '카야 소식지 2026 봄호',
      mode: 'PDF 업로드 모드',
      daysAgo: 48,
      cover: COVER.children,
      lead: '2026년 사업 방향과 신입 활동가 소개를 담은 봄호입니다.',
      body: ['표지를 눌러 PDF로 읽어 주세요. 연간 계획과 현장 사진을 한 권에 모았습니다.'],
    },
    {
      year: 2025,
      issue: '87',
      title: '카야 소식지 2025 겨울호',
      mode: 'PDF 업로드 모드',
      daysAgo: 250,
      cover: COVER.mountains,
      lead: '한 해를 마무리하며 세 나라 현장의 변화를 정리했습니다.',
      body: ['PDF 원문에서 연간 성과와 감사의 글을 확인하실 수 있습니다.'],
    },
    {
      year: 2025,
      issue: '86',
      title: '카야 소식지 2025 가을호',
      mode: '글쓰기 모드',
      daysAgo: 330,
      cover: COVER.books,
      lead: '미얀마 보건 세미나와 국내 탈북청년 멘토링을 집중 소개합니다.',
      body: [
        '가을호 특집은 ‘건강이 배움의 조건이 될 때’입니다. 학교보건이 출석률에 미치는 변화를 현지 교사 인터뷰와 함께 실었습니다.',
        '후원금 사용 안내와 하반기 일정표도 함께 확인하실 수 있습니다.',
      ],
    },
    {
      year: 2025,
      issue: '85',
      title: '카야 소식지 2025 봄호',
      mode: 'PDF 업로드 모드',
      daysAgo: 500,
      cover: COVER.classroom,
      lead: '새 학기를 맞는 해외 교실과 국내 교육 프로그램을 소개합니다.',
      body: ['PDF로 전체 지면을 보실 수 있습니다.'],
    },
    {
      year: 2024,
      issue: '84',
      title: '카야 소식지 2024 겨울호',
      mode: 'PDF 업로드 모드',
      daysAgo: 620,
      cover: COVER.nepal,
      lead: '네팔 현장 특집과 연말 감사 인사를 전합니다.',
      body: ['표지 이미지와 함께 PDF를 내려받아 주세요.'],
    },
    {
      year: 2024,
      issue: '83',
      title: '카야 소식지 2024 여름호',
      mode: '글쓰기 모드',
      daysAgo: 780,
      cover: COVER.volunteer,
      lead: '국내 청소년 캠페인과 해외 직업훈련 연계 이야기를 담았습니다.',
      body: [
        '카야의 국내 교육이 해외 개발협력과 어떻게 이어지는지를 수료생 사례로 소개합니다.',
        '자원봉사자 모집 공고와 사무국 소식도 실었습니다.',
      ],
    },
  ]

  for (const row of newsletters) {
    const contentHtml =
      row.mode === '글쓰기 모드'
        ? html(row.lead, row.body)
        : html(row.lead, row.body)
    await createPost({
      authorId,
      kind: '연간소식지',
      title: row.title,
      excerpt: row.lead,
      contentHtml,
      date: isoDaysAgo(row.daysAgo),
      meta: [
        { key: 'khayah_newsletter_mode', value: row.mode },
        { key: 'khayah_pdf_url', value: row.mode === 'PDF 업로드 모드' ? '/uploads/sample.pdf' : '' },
        { key: 'khayah_cover_url', value: row.cover },
        { key: 'khayah_newsletter_year', value: String(row.year) },
        { key: 'khayah_newsletter_issue', value: row.issue },
      ],
    })
  }

  const press: Array<{
    title: string
    publisher: string
    url: string
    daysAgo: number
  }> = [
    {
      title: '개발NGO 카야, 네팔 도시빈민 청소년 교육 지원 확대',
      publisher: '더나은미래',
      url: 'https://www.futurechosun.com',
      daysAgo: 11,
    },
    {
      title: '성남 소재 카야 인터내셔널, 외국인노동자 기술교육 14기 수료',
      publisher: '경기신문',
      url: 'https://www.kgnews.co.kr',
      daysAgo: 34,
    },
    {
      title: '키르기즈스탄 STEM 교실로 이어지는 한국 NGO의 교육 협력',
      publisher: '이로운넷',
      url: 'https://www.eroun.net',
      daysAgo: 47,
    },
    {
      title: '세계시민교육, 교실에서 현장을 만나다 — 카야 학교 특강',
      publisher: '한겨레',
      url: 'https://www.hani.co.kr',
      daysAgo: 90,
    },
    {
      title: '지정기부금단체 카야, 2025 기부금 활용 실적 공개',
      publisher: '뉴스와이어',
      url: 'https://www.newswire.co.kr',
      daysAgo: 130,
    },
    {
      title: '미얀마 학교보건으로 출석률을 끌어올리는 작은 실천',
      publisher: '매일경제',
      url: 'https://www.mk.co.kr',
      daysAgo: 175,
    },
  ]

  for (const row of press) {
    await createPost({
      authorId,
      kind: '언론보도',
      title: row.title,
      contentHtml: '',
      date: isoDaysAgo(row.daysAgo),
      meta: [
        { key: 'khayah_press_title', value: row.title },
        { key: 'khayah_press_publisher', value: row.publisher },
        { key: 'khayah_press_url', value: row.url },
        { key: 'khayah_press_date', value: ymd(row.daysAgo) },
      ],
    })
  }

  const stories: Array<{
    title: string
    scope: '국내' | '해외' | '옹호' | '진행'
    daysAgo: number
    cover: string
    lead: string
    body: string[]
  }> = [
    {
      title: '용접봉을 잡은 손이 다시 고향을 그리다',
      scope: '국내',
      daysAgo: 8,
      cover: COVER.workshop,
      lead: '네팔에서 온 라즈는 성남 기술교육 과정에서 처음으로 ‘돌아갈 일의 모양’을 그렸습니다.',
      body: [
        '국내 외국인노동자 권익증진 프로그램은 기술만이 아니라, 귀국 후 마을에서 나눌 수 있는 사회적 가치를 함께 다룹니다.',
        '라즈는 수료 후 동료에게 안전 교육을 도와주는 조교로 남았습니다. “배운 것을 혼자 가져가지 않겠다”는 약속이었습니다.',
      ],
    },
    {
      title: '탈북청년 세 명이 만든 주말 스터디',
      scope: '국내',
      daysAgo: 27,
      cover: COVER.meeting,
      lead: '소셜비즈니스 수업이 끝난 뒤, 청년들이 자발적으로 모임을 이어갔습니다.',
      body: [
        '카야의 탈북청년 창업교육은 한국 사회의 일원으로서 자부심과 국내외 진출을 함께 모색합니다.',
        '세 사람은 돌봄 공백이 있는 이주민 가정을 위한 작은 서비스 아이디어를 다듬고 있습니다.',
      ],
    },
    {
      title: '전쟁터가 아니어도 되는 교실',
      scope: '국내',
      daysAgo: 63,
      cover: COVER.classroom,
      lead: '경쟁이 당연한 사회에서, 청소년 미래교육은 민주시민·세계시민으로 숨 고를 틈을 엽니다.',
      body: [
        '분당의 한 고등학교에서 열린 워크숍에서 학생들은 ‘내가 돕는 사람’이 아니라 ‘함께 사는 이웃’이라는 말을 골라 적었습니다.',
        '카야는 드러나지 않은 교육 이슈를 발견하고, 가치와 미래를 준비하는 프로그램을 국내에서 실험합니다.',
      ],
    },
    {
      title: '카트만두 골목의 작은 책장',
      scope: '해외',
      daysAgo: 5,
      cover: COVER.reading,
      lead: '전기가 자주 끊기는 마을에, 아이들이 먼저 문을 여는 공간이 생겼습니다.',
      body: [
        '꿈도서관은 책을 빌려주는 곳이기도 하지만, Life Skills와 독서클럽 ‘꿈꾸는 다락방’이 열리는 교실이기도 합니다.',
        '사서 선생님은 “숙제를 하러 오는 아이보다, 이야기를 하러 오는 아이가 늘었다”고 했습니다.',
      ],
    },
    {
      title: '실험복을 입은 비슈케크의 오후',
      scope: '해외',
      daysAgo: 19,
      cover: COVER.stem,
      lead: '키르기즈스탄 STEM 교실에서 중학생들이 처음으로 회로를 연결했습니다.',
      body: [
        '맞춤형 직업훈련은 지역 산업과 청소년의 적성을 함께 봅니다. 기업과 연결되는 인력의 고리가 목표입니다.',
        '수업이 끝나자 학생 하나가 선생님에게 물었습니다. “내일도 이 교실 열리죠?”',
      ],
    },
    {
      title: '비누 거품이 출석부를 바꿨다',
      scope: '해외',
      daysAgo: 44,
      cover: COVER.medical,
      lead: '미얀마 학교보건은 거창한 병원이 아니라, 매일의 손 씻기에서 시작됐습니다.',
      body: [
        '카야는 주민이 영양·위생·주거를 스스로 개선할 역량을 키우는 데 집중합니다.',
        '학부모 세미나 이후, 결석이 잦던 저학년 두 명이 일주일 연속으로 등교했습니다. 작은 숫자이지만 현지 교사는 이를 크게 적었습니다.',
      ],
    },
    {
      title: '원조가 아니라 동행이라고 말하려면',
      scope: '옹호',
      daysAgo: 16,
      cover: COVER.hands,
      lead: '세계시민교육 특강에서 학생들은 ‘도와주는 사람’ 역할극을 그만두었습니다.',
      body: [
        '카야의 옹호사업은 국제개발협력과 ODA를 소개하고, 존중·협력·나눔의 세계시민을 키우는 데 목표가 있습니다.',
        '한 학생은 소감문에 이렇게 썼습니다. “사진 속 친구에게 물건을 보내는 대신, 그 친구가 고를 수 있는 질문을 보내고 싶다.”',
      ],
    },
    {
      title: '선교와 개발이 같은 방향을 볼 때',
      scope: '옹호',
      daysAgo: 52,
      cover: COVER.community,
      lead: 'M&N 세미나에서 참석자들은 ‘구제와 지역사회개발’의 차이를 오래 이야기했습니다.',
      body: [
        '카야는 개발협력의 전문성—타당성 조사, 제안서, 예산과 성과 관리—이 현장의 사람을 중심에 둘 때 의미가 있다고 봅니다.',
        '강의 말미에 한 참석자는 “빨리 주는 손보다, 같이 남는 손”이 필요하다고 했습니다.',
      ],
    },
    {
      title: '지도 위에 점을 찍는 대신, 이름을 불렀다',
      scope: '옹호',
      daysAgo: 88,
      cover: COVER.children,
      lead: '청소년 캠페인 부스에서 국기 스티커 대신 현지 친구의 이름을 적게 했습니다.',
      body: [
        '올바른 국제개발을 위한 마음가짐은 구호 한 줄보다, 한 사람의 이름을 기억하는 일에서 출발합니다.',
        '모인 이름과 응원 문장은 번역되어 네팔 교실 게시판으로 떠났습니다.',
      ],
    },
    {
      title: '우기가 지나도 급수대는 남았다',
      scope: '진행',
      daysAgo: 3,
      cover: COVER.nepal,
      lead: '네팔 진행사업의 올해 과제는 시설을 고치는 일이 아니라, 고친 뒤에도 돌보는 사람을 남기는 일입니다.',
      body: [
        '카야의 해외 프로젝트는 참여자 중심으로 지역이 궁극적 자립에 이를 때까지를 목표로 합니다.',
        '학생 보건 동아리가 점검표를 쓰기 시작하자, 마을 기술자가 “다음엔 너희가 나를 불러”라고 했습니다.',
      ],
    },
    {
      title: '멘토가 된 1기 수료생',
      scope: '진행',
      daysAgo: 31,
      cover: COVER.outdoor,
      lead: '키르기즈스탄 STEM 1기 수료생 여섯 명이 2기 교실에 다시 들어왔습니다.',
      body: [
        '진행 중인 사업이 한 해로 끝나지 않으려면, 배운 사람이 가르치는 사람으로 남는 순환이 필요합니다.',
        '카야는 조사부터 평가까지 현지 주민이 참여하는 방법론을 고집합니다. 멘토의 등장은 그 방법론이 먹히고 있다는 신호입니다.',
      ],
    },
    {
      title: '수료증보다 오래 남는 약속',
      scope: '진행',
      daysAgo: 70,
      cover: COVER.volunteer,
      lead: '국내 기술교육 수료식에서 참가자들은 귀국 후 나눔 계획을 한 장씩 적어 교환했습니다.',
      body: [
        '카야의 국내 진행사업은 사람·자연·미래가 한 프로젝트 안에 담기도록 설계됩니다.',
        '그 종이 약속은 사무국 캐비닛이 아니라, 내년 현장 방문 때 다시 꺼내 볼 편지입니다.',
      ],
    },
  ]

  for (const row of stories) {
    await createPost({
      authorId,
      kind: '스토리',
      title: row.title,
      contentHtml: html(row.lead, row.body),
      date: isoDaysAgo(row.daysAgo),
      meta: [
        { key: 'khayah_story_scope', value: row.scope },
        { key: 'khayah_cover_url', value: row.cover },
      ],
    })
  }

  const projects: Array<{
    title: string
    region: '네팔' | '키르기즈스탄' | '미얀마' | '국내'
    daysAgo: number
    lead: string
    body: string[]
  }> = [
    {
      title: '카트만두 도시빈민 마을 꿈도서관',
      region: '네팔',
      daysAgo: 10,
      lead: '책을 빌리는 공간을 넘어, 청소년이 생각을 나누는 거점으로 운영합니다.',
      body: [
        '대상은 카트만두 외곽 도시빈민 밀집 지역의 초·중등 연령 아동과 학부모입니다.',
        '주 2회 독서클럽, Life Skills, 현지 전문가 멘토링을 결합하고, 교사와 함께 수업 자료를 만듭니다.',
        '2026년에는 도서관 자원봉사자 양성 과정을 신설해 외부 지원이 줄어도 문이 닫히지 않도록 준비합니다.',
      ],
    },
    {
      title: '네팔 학교보건 및 위생 환경 개선',
      region: '네팔',
      daysAgo: 40,
      lead: '손 씻기 시설과 보건 교육을 묶어, 출석과 학습이 이어지게 합니다.',
      body: [
        '학령기 아동의 신체검사, 위생 교육, 학부모·교사 보건 세미나, 보건 책자 배포를 진행합니다.',
        '시설 보수는 마을 기술자와 학생 동아리가 함께 점검하는 방식으로 유지 관리 책임을 나눕니다.',
      ],
    },
    {
      title: '도시빈민 학생 STEM 역량 강화',
      region: '키르기즈스탄',
      daysAgo: 7,
      lead: '실험·코딩·팀 프로젝트로 과학 수업의 문을 넓힙니다.',
      body: [
        '비슈케크 및 인근 학교의 중학생을 대상으로 학기제 STEM 과정을 운영합니다.',
        '현지 과학교사 연수를 병행해, 카야 활동가가 떠난 뒤에도 실험 수업이 남도록 합니다.',
        '2기부터는 1기 수료생이 멘토로 참여하는 순환 구조를 공식화했습니다.',
      ],
    },
    {
      title: '키르기즈스탄 청년 진로·직업 탐색',
      region: '키르기즈스탄',
      daysAgo: 58,
      lead: '지역 산업 조사에 기반한 맞춤형 직업 탐색 워크숍을 진행합니다.',
      body: [
        '참여자 맞춤형 적성 프로그램과 기업 연계형 현장 방문을 결합합니다.',
        '목표는 단기 체험이 아니라, 훈련된 인력이 지역 일자리와 만나는 연결고리를 만드는 것입니다.',
      ],
    },
    {
      title: '양곤 도시빈민마을 청소년 꿈도서관',
      region: '미얀마',
      daysAgo: 22,
      lead: '안전한 학습 공간과 독서 모임을 통해 배움의 리듬을 되찾게 합니다.',
      body: [
        '분쟁과 이동이 잦은 환경에서 도서관은 ‘매일 같은 시간에 올 수 있는 곳’으로 기능합니다.',
        '현지 파트너와 함께 도서 선정, 운영 시간, 보호자 동의 절차를 공동으로 결정합니다.',
      ],
    },
    {
      title: '미얀마 학교 기반 보건활동',
      region: '미얀마',
      daysAgo: 75,
      lead: '신체검사와 성 보건 교육을 학부모 세미나와 함께 진행합니다.',
      body: [
        '카야는 의료 서비스를 대신하는 것이 아니라, 가정과 학교가 건강을 돌보는 역량을 키우는 데 집중합니다.',
        '보건 책자는 현지어로 제작·배포하며, 교사 워크숍에서 수업 활용법을 나눕니다.',
      ],
    },
    {
      title: '외국인노동자 기술·창업 교육',
      region: '국내',
      daysAgo: 15,
      lead: '사회적 가치를 바탕으로 한 기술·창업 교육으로 귀국 후 나눔을 준비합니다.',
      body: [
        '성남 등지에서 기수제로 운영하며, 기술 실습과 기초 경영, 문화탐방, 인식개선 활동을 포함합니다.',
        '이 프로그램은 참여자가 개발도상국 지역 발전에 기여할 수 있다는 점에서 해외사업과 연속됩니다.',
      ],
    },
    {
      title: '탈북청년 소셜비즈니스 · 청소년 세계시민교육',
      region: '국내',
      daysAgo: 36,
      lead: '국내 정착 청년의 기업가 정신과 청소년의 세계시민 역량을 함께 키웁니다.',
      body: [
        '탈북청년에게는 소셜비즈니스와 국제개발협력 교육을, 청소년에게는 민주시민·세계시민 프로그램을 제공합니다.',
        '카야의 국내 프로젝트는 사람·자연·미래가 한 설계 안에 들어가도록 연구하며 진행합니다.',
      ],
    },
  ]

  for (const row of projects) {
    await createPost({
      authorId,
      kind: '진행사업',
      title: row.title,
      contentHtml: html(row.lead, row.body),
      date: isoDaysAgo(row.daysAgo),
      meta: [{ key: 'khayah_project_region', value: row.region }],
    })
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect()
    await pool.end()
    // eslint-disable-next-line no-console
    console.log('Seed completed.')
  })
  .catch(async (e) => {
    const msg = e instanceof Error ? e.message : String(e)
    const code = (e as { code?: string } | null)?.code
    // eslint-disable-next-line no-console
    console.error(e)
    if (code === 'ECONNREFUSED') {
      // eslint-disable-next-line no-console
      console.error(
        [
          '',
          '[Seed hint] DB connection was refused.',
          '- Check that DATABASE_URL points to a reachable Postgres host (Render external/internal URL).',
          '',
          `- Current DATABASE_URL: ${process.env.DATABASE_URL ?? '(missing)'}`,
          '',
        ].join('\n'),
      )
    } else if (msg.toLowerCase().includes('database_url')) {
      // eslint-disable-next-line no-console
      console.error(
        [
          '',
          '[Seed hint] DATABASE_URL is missing or invalid.',
          'Set DATABASE_URL in your environment or .env and rerun:',
          '  npm run prisma:generate',
          '  npm run prisma:seed',
          '',
        ].join('\n'),
      )
    }
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })
