/**
 * 기존 khayah.org 워드프레스 공지사항(카테고리 13)을 현재 사이트 공지로 가져옵니다.
 * 본문 이미지·첨부파일은 Cloudinary에 올리고 URL을 바꿉니다.
 *
 * 실행: cd server && npx tsx scripts/importLegacyNotices.ts
 * 옵션: --dry-run
 */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { uploadBufferToCloudinary } from '../src/utils/cloudinary'

const LIST_URL =
  'http://khayah.org/khayah/wp-json/wp/v2/posts?categories=13&per_page=100&_fields=id,date,link,title,excerpt,content'
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'

const DRY_RUN = process.argv.includes('--dry-run')

const rawUrl = process.env.DATABASE_URL?.trim()
if (!rawUrl) throw new Error('DATABASE_URL is required.')

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

type WpPost = {
  id: number
  date: string
  link: string
  title: { rendered: string }
  excerpt: { rendered: string }
  content: { rendered: string }
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function stripTags(s: string): string {
  return decodeEntities(s)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function assetKey(url: string): string | null {
  let path: string
  try {
    const u = new URL(url)
    if (!/khayah\.org$/i.test(u.hostname)) return null
    if (!u.pathname.includes('/wp-content/uploads/')) return null
    path = decodeURIComponent(u.pathname)
  } catch {
    return null
  }
  path = path.replace(/-\d+x\d+(?=\.[a-z0-9]+$)/i, '')
  return path.toLowerCase()
}

function isDocument(url: string): boolean {
  return /\.(pdf|docx?|hwp|xlsx?|pptx?|zip)(\?|$)/i.test(url)
}

function pickSource(urls: string[]): string {
  const plain = urls.find((u) => !/-\d+x\d+\.[a-z0-9]+(\?|$)/i.test(u))
  if (plain) return plain
  let best = urls[0]
  let bestArea = -1
  for (const u of urls) {
    const m = u.match(/-(\d+)x(\d+)\.[a-z0-9]+/i)
    const area = m ? Number(m[1]) * Number(m[2]) : 0
    if (area > bestArea) {
      best = u
      bestArea = area
    }
  }
  return best
}

function mimeFor(url: string, header: string | null): string {
  const h = (header || '').split(';')[0].trim().toLowerCase()
  if (h && h !== 'application/octet-stream') return h
  if (/\.png(\?|$)/i.test(url)) return 'image/png'
  if (/\.jpe?g(\?|$)/i.test(url)) return 'image/jpeg'
  if (/\.gif(\?|$)/i.test(url)) return 'image/gif'
  if (/\.webp(\?|$)/i.test(url)) return 'image/webp'
  if (/\.pdf(\?|$)/i.test(url)) return 'application/pdf'
  if (/\.docx(\?|$)/i.test(url)) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  if (/\.doc(\?|$)/i.test(url)) return 'application/msword'
  return 'application/octet-stream'
}

async function download(url: string): Promise<{ buffer: Buffer; mime: string; name: string }> {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const name = decodeURIComponent(new URL(url).pathname.split('/').pop() || 'file')
  return { buffer, mime: mimeFor(url, res.headers.get('content-type')), name }
}

function rewriteHtml(html: string, replacements: Map<string, string>): string {
  let out = html
  const urls = [...replacements.keys()].sort((a, b) => b.length - a.length)
  for (const from of urls) {
    out = out.split(from).join(replacements.get(from)!)
  }
  out = out.replace(/\s(?:srcset|sizes)="[^"]*"/gi, '')
  return out
}

async function relinkAttachments() {
  const rows = await prisma.post.findMany({
    where: { postName: { startsWith: 'notice-wp-' }, postStatus: 'publish' },
    select: { id: true, postContent: true },
  })
  const ids = new Set<string>()
  for (const row of rows) {
    for (const m of row.postContent.matchAll(/attachment_id=(\d+)/g)) ids.add(m[1])
  }
  console.log(`attachment links ${ids.size}`)
  const map = new Map<string, string>()
  for (const id of ids) {
    const mediaRes = await fetch(
      `http://khayah.org/khayah/wp-json/wp/v2/media/${id}?_fields=source_url,mime_type`,
      { headers: { 'User-Agent': UA } },
    )
    if (!mediaRes.ok) {
      console.warn('media', id, mediaRes.status)
      continue
    }
    const media = (await mediaRes.json()) as { source_url?: string; mime_type?: string }
    if (!media.source_url) continue
    const file = await download(media.source_url)
    const kind = (media.mime_type || file.mime).startsWith('image/') ? 'image' : 'document'
    const saved = await uploadBufferToCloudinary({
      buffer: file.buffer,
      originalName: file.name,
      mimeType: media.mime_type || file.mime,
      kind,
    })
    map.set(id, saved.url)
    console.log('relink', id, file.name)
  }
  for (const row of rows) {
    let next = row.postContent
    for (const [id, url] of map) {
      next = next.replace(new RegExp(`https?://khayah\\.org/khayah/\\?attachment_id=${id}`, 'g'), url)
    }
    if (next !== row.postContent) {
      await prisma.post.update({ where: { id: row.id }, data: { postContent: next } })
    }
  }
  console.log('relinked', map.size)
}

async function main() {
  if (process.argv.includes('--relink')) {
    await relinkAttachments()
    await prisma.$disconnect()
    await pool.end()
    return
  }
  const res = await fetch(LIST_URL, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`list ${res.status}`)
  const posts = (await res.json()) as WpPost[]
  console.log(`fetched ${posts.length} notices`)

  const groups = new Map<string, string[]>()
  for (const post of posts) {
    const found = post.content.rendered.match(/https?:\/\/[^"'\\\s>]+/g) || []
    for (const raw of found) {
      const url = raw.replace(/&amp;/g, '&')
      const key = assetKey(url)
      if (!key) continue
      const list = groups.get(key) || []
      if (!list.includes(url)) list.push(url)
      groups.set(key, list)
    }
  }
  console.log(`unique files ${groups.size}`)

  const replacements = new Map<string, string>()
  let uploaded = 0
  for (const [key, urls] of groups) {
    const source = pickSource(urls)
    if (DRY_RUN) {
      console.log('file', key, '<-', source)
      continue
    }
    try {
      const file = await download(source)
      const kind = isDocument(source) || !file.mime.startsWith('image/') ? 'document' : 'image'
      const saved = await uploadBufferToCloudinary({
        buffer: file.buffer,
        originalName: file.name,
        mimeType: file.mime,
        kind,
      })
      for (const u of urls) replacements.set(u, saved.url)
      uploaded += 1
      console.log(`uploaded ${uploaded}/${groups.size} ${file.name}`)
    } catch (err) {
      console.warn('keep original', source, err instanceof Error ? err.message : err)
    }
  }

  const author = await prisma.user.findFirst({ select: { id: true }, orderBy: { id: 'asc' } })
  if (!author) throw new Error('No user to own posts.')

  const existing = await prisma.postMeta.findMany({
    where: { metaKey: 'khayah_legacy_wp_id' },
    select: { metaValue: true },
  })
  const seen = new Set(existing.map((m) => m.metaValue || ''))

  let created = 0
  for (const post of posts) {
    const legacyId = String(post.id)
    if (seen.has(legacyId)) {
      console.log('skip', legacyId)
      continue
    }
    const title = stripTags(post.title.rendered)
    const excerpt = stripTags(post.excerpt.rendered).slice(0, 400)
    const content = rewriteHtml(post.content.rendered, replacements)
    const day = post.date.slice(0, 10)
    const postDate = new Date(`${day}T12:00:00.000Z`)
    if (DRY_RUN) {
      console.log('post', legacyId, day, title)
      continue
    }
    const row = await prisma.post.create({
      data: {
        postAuthorId: author.id,
        postDate,
        postDateGmt: postDate,
        postModified: postDate,
        postModifiedGmt: postDate,
        postTitle: title,
        postExcerpt: excerpt,
        postContent: content,
        postStatus: 'publish',
        postName: `notice-wp-${legacyId}`,
        postType: 'post',
        guid: post.link,
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
        { postId: row.id, metaKey: 'khayah_kind', metaValue: '공지사항' },
        { postId: row.id, metaKey: 'khayah_notice', metaValue: 'true' },
        { postId: row.id, metaKey: 'khayah_legacy_wp_id', metaValue: legacyId },
        { postId: row.id, metaKey: 'khayah_legacy_url', metaValue: post.link },
      ],
    })
    created += 1
    console.log('saved', row.id, title)
  }

  if (!DRY_RUN) {
    const samples = await prisma.post.findMany({
      where: {
        postType: 'post',
        postStatus: 'publish',
        postMeta: { some: { metaKey: 'khayah_kind', metaValue: '공지사항' } },
        NOT: { postMeta: { some: { metaKey: 'khayah_legacy_wp_id' } } },
      },
      select: { id: true, postTitle: true },
    })
    if (samples.length) {
      await prisma.post.updateMany({
        where: { id: { in: samples.map((s) => s.id) } },
        data: { postStatus: 'draft' },
      })
      for (const s of samples) console.log('draft sample', s.id, s.postTitle)
    }
  }

  console.log(DRY_RUN ? 'dry-run done' : `created ${created}`)
  await prisma.$disconnect()
  await pool.end()
}

main().catch(async (err) => {
  console.error(err)
  await prisma.$disconnect()
  await pool.end()
  process.exit(1)
})
