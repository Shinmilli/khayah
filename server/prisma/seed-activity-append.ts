/**
 * 활동소식만 추가 (기존 게시글 삭제 없음)
 * 실행: npx tsx prisma/seed-activity-append.ts
 */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const rawUrl = process.env.DATABASE_URL?.trim()
if (!rawUrl) {
  throw new Error('DATABASE_URL is required.')
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

async function ensureAuthorId(): Promise<number> {
  const existing = await prisma.user.findFirst({ select: { id: true } })
  if (existing) return existing.id
  const created = await prisma.user.create({
    data: {
      userLogin: 'admin',
      userPass: 'seed',
      userNicename: 'admin',
      userEmail: 'admin@example.org',
      displayName: 'Admin',
    },
    select: { id: true },
  })
  return created.id
}

const covers = [
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773f?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=800&fit=crop',
]

async function main() {
  const authorId = await ensureAuthorId()
  const stamp = Date.now().toString(36)
  const count = 10

  for (let i = 1; i <= count; i++) {
    const title = `활동소식 test ${i}`
    const date = isoDaysAgo(i)
    const content = `<p>활동소식 테스트 본문 ${i}입니다.</p><p>기존 게시글은 유지하고 추가만 한 샘플입니다.</p>`
    const excerpt = `활동소식 테스트 본문 ${i}입니다.`
    const postName = slugify(`활동소식-test-${stamp}-${i}`).slice(0, 190)

    const created = await prisma.post.create({
      data: {
        postAuthorId: authorId,
        postDate: date,
        postDateGmt: date,
        postModified: date,
        postModifiedGmt: date,
        postTitle: title,
        postExcerpt: excerpt,
        postContent: content,
        postStatus: 'publish',
        postName,
        postType: 'post',
        commentStatus: 'closed',
        pingStatus: 'closed',
      },
      select: { id: true },
    })

    await prisma.postMeta.createMany({
      data: [
        { postId: created.id, metaKey: 'khayah_kind', metaValue: '활동소식' },
        { postId: created.id, metaKey: 'khayah_activity_tag', metaValue: i % 2 ? '현장' : '캠페인' },
        {
          postId: created.id,
          metaKey: 'khayah_cover_url',
          metaValue: covers[(i - 1) % covers.length]!,
        },
      ],
    })

    console.log(`created #${created.id} ${title}`)
  }

  console.log(`Done. Appended ${count} 활동소식 posts (no deletes).`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
