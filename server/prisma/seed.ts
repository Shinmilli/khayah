import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

type Kind = '공지사항' | '활동소식' | '연간소식지' | '언론보도' | '스토리'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is required to run seeds.')
}

const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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
  d.setDate(d.getDate() - days)
  return d
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
      displayName: 'Admin',
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

  // delete dependents first (no cascades guaranteed)
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

function baseContent(title: string, lead: string): string {
  return `
<div class="seed-post">
  <p><strong>${lead}</strong></p>
  <p>이 글은 컨펌을 위한 시드 데이터입니다. 실제 운영 전 관리자에서 내용을 교체해 주세요.</p>
  <h3>${title}</h3>
  <p>본문 예시 문단 1 — 현장 상황과 배경을 설명합니다.</p>
  <p>본문 예시 문단 2 — 핵심 메시지와 향후 계획을 안내합니다.</p>
</div>
`.trim()
}

function deriveExcerptFromHtml(html: string): string {
  const text = html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  // 1줄 정도로 제한 (대략 55~65자)
  return text.slice(0, 60)
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
  const kinds: Kind[] = ['공지사항', '활동소식', '연간소식지', '언론보도', '스토리']
  const authorId = await ensureSeedAuthorId()

  await deleteSeedKinds(kinds)

  // 공지사항 (제목 + 등록일 UI용)
  for (let i = 1; i <= 5; i++) {
    await createPost({
      authorId,
      kind: '공지사항',
      title: `공지사항 시드 ${i} — 일정/안내`,
      contentHtml: baseContent(`공지사항 시드 ${i}`, '공지사항 시드 데이터'),
      date: isoDaysAgo(i * 3),
      meta: [{ key: 'khayah_notice', value: 'true' }],
    })
  }

  const activityCoverSamples = [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773f?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=800&fit=crop',
  ]

  // 활동소식
  for (let i = 1; i <= 5; i++) {
    await createPost({
      authorId,
      kind: '활동소식',
      title: `활동소식 시드 ${i} — 현장 스케치`,
      contentHtml: baseContent(`활동소식 시드 ${i}`, '활동소식 시드 데이터'),
      date: isoDaysAgo(20 + i * 4),
      meta: [
        { key: 'khayah_activity_tag', value: i % 2 ? '현장' : '캠페인' },
        { key: 'khayah_cover_url', value: activityCoverSamples[(i - 1) % activityCoverSamples.length] },
      ],
    })
  }

  const nlCoverSamples = [
    'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&h=800&fit=crop',
  ]

  /** 연간소식지: 연도(khayah_newsletter_year)·호수(khayah_newsletter_issue) 조합이 필터와 1:1로 매칭되도록 고정 시드 */
  const newsletterSeeds: Array<{
    year: number
    issue: string
    title: string
    mode: '글쓰기 모드' | 'PDF 업로드 모드'
    daysAgo: number
  }> = [
    { year: 2024, issue: '84', title: '연간소식지 2024년 겨울호 (84호)', mode: 'PDF 업로드 모드', daysAgo: 420 },
    { year: 2024, issue: '83', title: '연간소식지 2024년 봄호 (83호)', mode: '글쓰기 모드', daysAgo: 440 },
    { year: 2025, issue: '87', title: '연간소식지 2025년 연말호 (87호)', mode: 'PDF 업로드 모드', daysAgo: 25 },
    { year: 2025, issue: '86', title: '연간소식지 2025년 가을호 (86호)', mode: '글쓰기 모드', daysAgo: 95 },
    { year: 2025, issue: '85', title: '연간소식지 2025년 신년호 (85호)', mode: 'PDF 업로드 모드', daysAgo: 180 },
    { year: 2026, issue: '2', title: '연간소식지 2026년 상반기 (2호)', mode: '글쓰기 모드', daysAgo: 8 },
    { year: 2026, issue: '1', title: '연간소식지 2026년 창간 (1호)', mode: 'PDF 업로드 모드', daysAgo: 40 },
  ]

  for (let idx = 0; idx < newsletterSeeds.length; idx++) {
    const row = newsletterSeeds[idx]!
    const contentHtml =
      row.mode === '글쓰기 모드'
        ? baseContent(row.title, `${row.year}년 · ${row.issue}호 · 연간소식지(글쓰기 모드) 시드`)
        : `<p>${row.year}년 ${row.issue}호 PDF 소식지입니다. (시드 데이터)</p>`
    await createPost({
      authorId,
      kind: '연간소식지',
      title: row.title,
      contentHtml,
      date: isoDaysAgo(row.daysAgo),
      meta: [
        { key: 'khayah_newsletter_mode', value: row.mode },
        { key: 'khayah_pdf_url', value: '/uploads/sample.pdf' },
        { key: 'khayah_cover_url', value: nlCoverSamples[idx % nlCoverSamples.length]! },
        { key: 'khayah_newsletter_year', value: String(row.year) },
        { key: 'khayah_newsletter_issue', value: row.issue },
      ],
    })
  }

  // 언론보도 (신문사/링크/날짜 메타)
  const publishers = ['OO일보', 'OO뉴스', 'OO타임즈', 'OO경제', 'OO방송'] as const
  for (let i = 1; i <= 5; i++) {
    await createPost({
      authorId,
      kind: '언론보도',
      title: `언론보도 시드 ${i} — 인터뷰/보도자료`,
      contentHtml: `<p>기사 링크를 통해 전문을 확인해 주세요. (시드 데이터)</p>`,
      date: isoDaysAgo(10 + i * 2),
      meta: [
        { key: 'khayah_press_title', value: `기사 제목 시드 ${i} — 현장 이야기` },
        { key: 'khayah_press_publisher', value: publishers[i - 1] ?? 'OO일보' },
        { key: 'khayah_press_url', value: 'https://example.com' },
        { key: 'khayah_press_date', value: isoDaysAgo(10 + i * 2).toISOString().slice(0, 10) },
      ],
    })
  }

  // 스토리 (scope 메타: 국내/해외/옹호/지원)
  const scopes = ['국내', '해외', '옹호', '지원'] as const
  for (let i = 1; i <= 10; i++) {
    await createPost({
      authorId,
      kind: '스토리',
      title: `스토리 시드 ${i} — 변화의 기록`,
      contentHtml: baseContent(`스토리 시드 ${i}`, '스토리 시드 데이터'),
      date: isoDaysAgo(5 + i),
      meta: [{ key: 'khayah_story_scope', value: scopes[(i - 1) % scopes.length] ?? '국내' }],
    })
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect()
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
          '- Render URLs usually look like:',
          '  postgresql://USER:PASSWORD@HOST:5432/DB?schema=public',
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
    process.exit(1)
  })

