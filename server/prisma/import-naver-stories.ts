/**
 * 네이버 블로그 해외소식·국내소식을 사이트 스토리로 가져옵니다.
 * 샘플 스토리(네이버 logNo 없는 글)는 삭제합니다.
 *
 * 실행: cd server && npx tsx prisma/import-naver-stories.ts
 * 옵션: --dry-run  --limit=3  --update
 * --update: 이미 가져온 글의 본문(강조·링크·갤러리·영상)만 다시 씁니다. 이미지는 Cloudinary URL을 재사용합니다.
 */
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import { uploadBufferToCloudinary } from '../src/utils/cloudinary'

const BLOG_ID = 'khayah'
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const CATEGORIES: Array<{ categoryNo: string; scope: '해외' | '국내' }> = [
  { categoryNo: '15', scope: '해외' },
  { categoryNo: '16', scope: '국내' },
]

const argv = process.argv.slice(2)
const DRY_RUN = argv.includes('--dry-run')
const UPDATE = argv.includes('--update')
const limitArg = argv.find((a) => a.startsWith('--limit='))
const LIMIT = limitArg ? Math.max(1, parseInt(limitArg.split('=')[1] || '0', 10) || 0) : 0
const logNoArg = argv.find((a) => a.startsWith('--log-no='))
const ONLY_LOG = (logNoArg?.split('=')[1] || '').trim()

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

type BlogPost = {
  logNo: string
  title: string
  addDate: string
  categoryNo: string
  scope: '해외' | '국내'
}

type Block =
  | { type: 'p'; html: string }
  | { type: 'img'; src: string; alt: string }
  | { type: 'gallery'; srcs: string[] }
  | { type: 'video'; src: string; poster?: string; title?: string }
  | { type: 'naverVideo'; vid: string; inkey: string; thumb: string; title?: string }
  | { type: 'hr' }
  | { type: 'quote'; text: string }
  | { type: 'link'; href: string; text: string }

const imageCache = new Map<string, string>()
const videoCache = new Map<string, { src: string; poster?: string; title?: string }>()

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&amp;/gi, '&')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
}

function stripTags(s: string): string {
  return decodeEntities(s.replace(/<[^>]+>/g, ' ').replace(/\u200b/g, '').replace(/\s+/g, ' ').trim())
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 190)
}

function parseNaverDate(raw: string): Date {
  const m = raw.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})/)
  if (!m) return new Date()
  const y = m[1]
  const mo = m[2]!.padStart(2, '0')
  const d = m[3]!.padStart(2, '0')
  return new Date(`${y}-${mo}-${d}T12:00:00+09:00`)
}

function fieldFromBlob(blob: string, name: string): string {
  const mm = blob.match(new RegExp(`"${name}"\\s*:\\s*"([^"]*)"`))
  return mm?.[1] ?? ''
}

async function fetchText(url: string, extra: Record<string, string> = {}): Promise<string> {
  let last: unknown
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': UA,
          Accept: '*/*',
          'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
          Referer: `https://blog.naver.com/${BLOG_ID}`,
          ...extra,
        },
        signal: AbortSignal.timeout(25_000),
      })
      if (!res.ok) throw new Error(`${url} ${res.status}`)
      return res.text()
    } catch (e) {
      last = e
      await sleep(400 * attempt)
    }
  }
  throw last instanceof Error ? last : new Error(String(last))
}

async function fetchBuffer(
  url: string,
  opts: { accept?: string; allowVideo?: boolean } = {},
): Promise<{ buf: Buffer; mime: string } | null> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      Accept: opts.accept || 'image/avif,image/webp,image/*,*/*;q=0.8',
      Referer: `https://blog.naver.com/${BLOG_ID}`,
    },
    signal: AbortSignal.timeout(60_000),
    redirect: 'follow',
  })
  if (!res.ok) return null
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length < 800) return null
  const mime = (res.headers.get('content-type') || '').split(';')[0]?.trim() || guessMime(buf)
  if (opts.allowVideo) {
    if (!mime.startsWith('image/') && !mime.startsWith('video/') && !mime.includes('octet-stream')) return null
  } else if (!mime.startsWith('image/')) {
    return null
  }
  return { buf, mime }
}

function guessMime(buf: Buffer): string {
  if (buf[0] === 0xff && buf[1] === 0xd8) return 'image/jpeg'
  if (buf[0] === 0x89 && buf[1] === 0x50) return 'image/png'
  if (buf.subarray(0, 3).toString('ascii') === 'GIF') return 'image/gif'
  if (buf.length >= 12 && buf.subarray(8, 12).toString('ascii') === 'WEBP') return 'image/webp'
  return 'application/octet-stream'
}

function parseTitleList(raw: string): BlogPost[] {
  const posts: BlogPost[] = []
  for (const m of raw.matchAll(/\{[^{}]*"logNo"\s*:\s*"(\d+)"[^{}]*\}/g)) {
    const blob = m[0]
    posts.push({
      logNo: fieldFromBlob(blob, 'logNo'),
      title: decodeEntities(decodeURIComponent(fieldFromBlob(blob, 'title').replace(/\+/g, ' '))),
      addDate: fieldFromBlob(blob, 'addDate'),
      categoryNo: fieldFromBlob(blob, 'categoryNo'),
      scope: '해외',
    })
  }
  return posts
}

async function listCategory(categoryNo: string, scope: '해외' | '국내'): Promise<BlogPost[]> {
  const out: BlogPost[] = []
  const seen = new Set<string>()
  for (let page = 1; page <= 10; page++) {
    const url =
      `https://blog.naver.com/PostTitleListAsync.naver?blogId=${BLOG_ID}` +
      `&currentPage=${page}&categoryNo=${categoryNo}&countPerPage=30`
    const raw = await fetchText(url, { 'X-Requested-With': 'XMLHttpRequest' })
    const rows = parseTitleList(raw).filter((p) => p.categoryNo === categoryNo || !p.categoryNo)
    let added = 0
    for (const row of rows) {
      if (seen.has(row.logNo)) continue
      seen.add(row.logNo)
      out.push({ ...row, scope, categoryNo })
      added++
    }
    if (added === 0 || rows.length < 5) break
    await sleep(250)
  }
  return out
}

function sliceDivAt(html: string, startIdx: number): string {
  const open = html.indexOf('<div', startIdx)
  if (open < 0) return ''
  let i = open + 4
  let depth = 1
  while (i < html.length && depth > 0) {
    const nextOpen = html.toLowerCase().indexOf('<div', i)
    const nextClose = html.toLowerCase().indexOf('</div>', i)
    if (nextClose < 0) return html.slice(open)
    if (nextOpen >= 0 && nextOpen < nextClose) {
      depth++
      i = nextOpen + 4
    } else {
      depth--
      i = nextClose + 6
    }
  }
  return html.slice(open, i)
}

function extractMainContainer(html: string): string {
  const needle = 'se-main-container'
  const idx = html.indexOf(needle)
  if (idx < 0) return html
  const divStart = html.lastIndexOf('<div', idx)
  return sliceDivAt(html, divStart)
}

function splitComponents(main: string): Array<{ className: string; inner: string }> {
  const out: Array<{ className: string; inner: string }> = []
  const re = /<div\b[^>]*class="([^"]*se-component[^"]*)"[^>]*>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(main))) {
    const whole = sliceDivAt(main, m.index)
    const inner = whole.replace(/^<div\b[^>]*>/i, '').replace(/<\/div>\s*$/i, '')
    out.push({ className: m[1]!, inner })
    re.lastIndex = m.index + Math.max(whole.length, m[0].length)
  }
  return out
}

function isJunkImageUrl(url: string): boolean {
  const u = url.toLowerCase()
  return (
    u.includes('sticker') ||
    u.includes('emoticon') ||
    u.includes('/static/blog') ||
    u.includes('blogpfthumb') ||
    u.includes('img_ani_blog') ||
    u.includes('favicon')
  )
}

function upgradeImageUrl(url: string): string {
  let u = url.replace(/^http:\/\//i, 'https://').trim()
  if (!u) return u
  if (/[?&]type=/.test(u)) u = u.replace(/([?&]type=)[^&]*/i, '$1w966')
  else u += (u.includes('?') ? '&' : '?') + 'type=w966'
  return u
}

function collectImageUrls(inner: string): string[] {
  const urls: string[] = []
  const seen = new Set<string>()
  const push = (raw?: string) => {
    if (!raw) return
    const decoded = decodeEntities(raw.trim())
    if (!/^https?:\/\//i.test(decoded)) return
    if (isJunkImageUrl(decoded)) return
    const key = decoded.replace(/\?.*$/, '')
    if (seen.has(key)) return
    seen.add(key)
    urls.push(upgradeImageUrl(decoded))
  }
  for (const tag of inner.matchAll(/<img\b[^>]*>/gi)) {
    const t = tag[0]
    if (/se-oglink/i.test(inner.slice(Math.max(0, tag.index! - 120), tag.index!)) && /oglink/i.test(t)) {
      continue
    }
    const lazy = t.match(/data-lazy-src="([^"]+)"/i)?.[1]
    const dataSrc = t.match(/data-src="([^"]+)"/i)?.[1]
    const src = t.match(/\bsrc="([^"]+)"/i)?.[1]
    const chosen = lazy || dataSrc || src
    if (chosen && /[?&]type=(s1|ff\d+|w1|w80)\b/i.test(chosen) && (lazy || dataSrc)) {
      push(lazy || dataSrc)
    } else {
      push(chosen)
    }
  }
  return urls
}

function isHighlightBg(raw: string): boolean {
  const c = raw.replace(/\s/g, '').toLowerCase()
  if (!c || c === 'transparent' || c === 'inherit') return false
  if (c === '#fff' || c === '#ffffff' || c === 'white' || c === 'rgb(255,255,255)') return false
  return true
}

function isDefaultColor(raw: string): boolean {
  const c = raw.replace(/\s/g, '').toLowerCase()
  return !c || ['#000', '#000000', 'black', '#111', '#111111', '#333', '#333333'].includes(c)
}

function keepInlineTags(html: string): string {
  return html.replace(/<\/?([a-z0-9]+)(\s[^>]*)?>/gi, (all, tag: string, attrs = '') => {
    const t = tag.toLowerCase()
    const closing = all.startsWith('</')
    if (t === 'br') return '<br>'
    if (t === 'a') return all
    if (['b', 'strong', 'u', 'i', 'em'].includes(t)) return closing ? `</${t}>` : `<${t}>`
    if (t === 'mark') {
      if (closing) return '</mark>'
      const style = /style="([^"]*)"/i.exec(attrs)?.[1]?.trim() || ''
      return style ? `<mark style="${escapeHtml(style)}">` : '<mark>'
    }
    if (t === 'span') {
      if (closing) return '</span>'
      const style = /style="([^"]*)"/i.exec(attrs)?.[1]?.trim() || ''
      if (!style) return ''
      return `<span style="${escapeHtml(style)}">`
    }
    return ''
  })
}

function richFromSeHtml(inner: string): string {
  let s = inner.replace(/\u200b/g, '')
  s = s.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (_all, attrs: string, content: string) => {
    const href = /href="([^"]+)"/i.exec(attrs)?.[1] || ''
    const decoded = decodeEntities(href)
    if (!/^https?:\/\//i.test(decoded)) return content
    return `<a href="${escapeHtml(decoded)}" target="_blank" rel="noopener noreferrer">${content}</a>`
  })
  let prev = ''
  while (s !== prev) {
    prev = s
    s = s.replace(/<span\b([^>]*)>([\s\S]*?)<\/span>/gi, (all, attrs: string, content: string) => {
      if (/<span\b/i.test(content)) return all
      const style = /style="([^"]*)"/i.exec(attrs)?.[1] || ''
      const bg = /background-color:\s*([^;]+)/i.exec(style)?.[1]?.trim() || ''
      const color = /(?:^|;)\s*color:\s*([^;]+)/i.exec(style)?.[1]?.trim() || ''
      let out = content
      if (isHighlightBg(bg)) out = `<mark style="background-color:${escapeHtml(bg)}">${out}</mark>`
      if (color && !isDefaultColor(color)) out = `<span style="color:${escapeHtml(color)}">${out}</span>`
      return out
    })
  }
  s = keepInlineTags(s)
  s = s.replace(/<(u|b|strong|i|em|mark|span)(\s[^>]*)?>\s*<\/\1>/gi, '')
  {
    let depth = 0
    s = s.replace(/<span\b[^>]*>|<\/span>/gi, (tok) => {
      if (/^<\//.test(tok)) {
        if (depth === 0) return ''
        depth -= 1
        return tok
      }
      depth += 1
      return tok
    })
  }
  s = s.replace(/(?:<br\s*\/?>\s*){3,}/gi, '<br><br>').replace(/\s+/g, ' ').trim()
  if (!stripTags(s)) return ''
  return s
}

function extractRichParagraphs(inner: string): string[] {
  const paras: string[] = []
  const matches = [...inner.matchAll(/<p\b[^>]*class="[^"]*se-text-paragraph[^"]*"[^>]*>([\s\S]*?)<\/p>/gi)]
  const source = matches.length ? matches.map((m) => m[1]!) : [inner]
  for (const raw of source) {
    const html = richFromSeHtml(raw.replace(/<br\s*\/?>/gi, '<br>'))
    if (!html) continue
    paras.push(html)
  }
  return paras
}

function extractNaverVideos(html: string): Array<{ vid: string; inkey: string; thumb: string; title: string }> {
  const out: Array<{ vid: string; inkey: string; thumb: string; title: string }> = []
  const seen = new Set<string>()
  const blobs = [
    ...html.matchAll(/data-module='([^']+)'/g),
    ...html.matchAll(/data-module="([^"]+)"/g),
  ]
  for (const m of blobs) {
    try {
      const data = JSON.parse(decodeEntities(m[1]!).replace(/\s+/g, ' ')) as {
        type?: string
        data?: {
          vid?: string
          inkey?: string
          thumbnail?: string
          videoType?: string
          mediaMeta?: { title?: string }
        }
      }
      if (data.type !== 'v2_video' || !data.data?.vid || !data.data?.inkey) continue
      if (seen.has(data.data.vid)) continue
      seen.add(data.data.vid)
      out.push({
        vid: data.data.vid,
        inkey: data.data.inkey,
        thumb: data.data.thumbnail || '',
        title: (data.data.mediaMeta?.title || '').trim(),
      })
    } catch {
      /* ignore */
    }
  }
  return out
}

function extractCoverFromTitle(inner: string): string | null {
  const m = inner.match(/background-image:\s*url\(['"]?([^'")]+)['"]?\)/i)
  if (!m?.[1]) return null
  const url = decodeEntities(m[1].trim())
  if (!/^https?:\/\//i.test(url) || isJunkImageUrl(url)) return null
  return upgradeImageUrl(url)
}

function extractOglink(inner: string): { href: string; text: string } | null {
  const href =
    inner.match(/href="(https?:[^"]+)"/i)?.[1] ||
    inner.match(/data-linkdata="[^"]*linkUrl&quot;:&quot;(https?:[^&]+)/i)?.[1]
  if (!href) return null
  const title =
    stripTags(inner.match(/se-oglink-title[^>]*>([\s\S]*?)<\//i)?.[1] || '') ||
    stripTags(inner.match(/se-oglink-url[^>]*>([\s\S]*?)<\//i)?.[1] || '') ||
    href
  return { href: decodeEntities(href), text: title }
}

function componentsToBlocks(html: string, title: string): { blocks: Block[]; coverHint: string | null } {
  const main = extractMainContainer(html)
  const components = splitComponents(main)
  const blocks: Block[] = []
  let coverHint: string | null = null
  const titleNorm = stripTags(title).replace(/\s+/g, '')

  for (const c of components) {
    const cn = c.className
    if (/\bse-documentTitle\b/.test(cn)) {
      coverHint = extractCoverFromTitle(c.inner) || coverHint
      continue
    }
    if (/\bse-sticker\b/.test(cn) || /\bse-file\b/.test(cn)) continue
    if (/\bse-video\b/.test(cn)) {
      for (const v of extractNaverVideos(c.inner)) {
        blocks.push({ type: 'naverVideo', vid: v.vid, inkey: v.inkey, thumb: v.thumb, title: v.title })
      }
      continue
    }
    if (/\bse-horizontalLine\b/.test(cn)) {
      blocks.push({ type: 'hr' })
      continue
    }
    if (/\bse-oglink\b/.test(cn)) {
      const og = extractOglink(c.inner)
      if (og) blocks.push({ type: 'link', href: og.href, text: og.text })
      continue
    }
    if (/\bse-quotation\b/.test(cn)) {
      for (const html of extractRichParagraphs(c.inner)) {
        const text = stripTags(html)
        if (text) blocks.push({ type: 'quote', text })
      }
      continue
    }
    if (/\bse-image\b/.test(cn) || /\bse-imageGroup\b/.test(cn) || /\bse-imageStrip\b/.test(cn)) {
      for (const src of collectImageUrls(c.inner)) {
        blocks.push({ type: 'img', src, alt: '' })
      }
      const cap = stripTags(c.inner.match(/se-caption[^>]*>([\s\S]*?)<\/div>/i)?.[1] || '')
      if (cap) blocks.push({ type: 'p', html: `<em>${escapeHtml(cap)}</em>` })
      continue
    }
    const imgs = collectImageUrls(c.inner)
    const paras = extractRichParagraphs(c.inner)
    for (const html of paras) {
      if (stripTags(html).replace(/\s+/g, '') === titleNorm) continue
      blocks.push({ type: 'p', html })
    }
    for (const src of imgs) blocks.push({ type: 'img', src, alt: '' })
  }

  if (!blocks.some((b) => b.type === 'naverVideo')) {
    for (const v of extractNaverVideos(html)) {
      blocks.push({ type: 'naverVideo', vid: v.vid, inkey: v.inkey, thumb: v.thumb, title: v.title })
    }
  }

  if (!blocks.some((b) => b.type === 'p' || b.type === 'img' || b.type === 'gallery' || b.type === 'naverVideo' || b.type === 'video')) {
    const paras = extractRichParagraphs(main)
    for (const html of paras) {
      if (stripTags(html).replace(/\s+/g, '') === titleNorm) continue
      blocks.push({ type: 'p', html })
    }
    for (const src of collectImageUrls(main)) blocks.push({ type: 'img', src, alt: '' })
    for (const v of extractNaverVideos(html)) {
      blocks.push({ type: 'naverVideo', vid: v.vid, inkey: v.inkey, thumb: v.thumb, title: v.title })
    }
  }

  const seenImg = new Set<string>()
  const deduped: Block[] = []
  for (const b of blocks) {
    if (b.type !== 'img') {
      deduped.push(b)
      continue
    }
    const key = b.src.replace(/\?.*$/, '').replace(/\/+$/, '')
    if (seenImg.has(key)) continue
    seenImg.add(key)
    deduped.push(b)
  }

  return { blocks: deduped, coverHint }
}

function deriveExcerpt(blocks: Block[]): string {
  const text = blocks
    .map((b) => {
      if (b.type === 'p') return stripTags(b.html)
      if (b.type === 'quote') return b.text
      return ''
    })
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.slice(0, 90)
}

function blocksToHtml(blocks: Block[]): string {
  const parts: string[] = []
  for (const b of blocks) {
    if (b.type === 'p') {
      if (!stripTags(b.html)) continue
      parts.push(`<p>${b.html}</p>`)
    } else if (b.type === 'img') {
      parts.push(`<p><img src="${escapeHtml(b.src)}" alt="${escapeHtml(b.alt)}"></p>`)
    } else if (b.type === 'gallery') {
      const imgs = b.srcs.map((src) => `<img src="${escapeHtml(src)}" alt="">`).join('')
      parts.push(`<div class="kh-gallery" data-kh-gallery data-count="${b.srcs.length}">${imgs}</div>`)
    } else if (b.type === 'video') {
      const posterAttr = b.poster ? ` poster="${escapeHtml(b.poster)}"` : ''
      const title = b.title?.trim() || ''
      const titleAttr = title ? ` data-title="${escapeHtml(title)}"` : ''
      const caption = title ? `<p class="kh-video__title">${escapeHtml(title)}</p>` : ''
      parts.push(
        `<div class="kh-video" data-kh-video${titleAttr}><video src="${escapeHtml(b.src)}"${posterAttr} controls playsinline preload="metadata"></video>${caption}</div>`,
      )
    } else if (b.type === 'hr') {
      parts.push('<hr>')
    } else if (b.type === 'quote') {
      parts.push(`<blockquote><p>${escapeHtml(b.text)}</p></blockquote>`)
    } else if (b.type === 'link') {
      parts.push(
        `<p><a href="${escapeHtml(b.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(b.text)}</a></p>`,
      )
    }
  }
  return parts.join('\n')
}

function existingCloudinaryImgs(html: string): string[] {
  return [...html.matchAll(/<img\b[^>]*\bsrc="(https:\/\/res\.cloudinary\.com\/[^"]+)"/gi)].map((m) => m[1]!)
}

function existingCloudinaryVideos(html: string): Array<{ src: string; poster?: string; title?: string }> {
  const out: Array<{ src: string; poster?: string; title?: string }> = []
  for (const m of html.matchAll(/<div\b[^>]*class="[^"]*kh-video[^"]*"[^>]*>[\s\S]*?<\/div>/gi)) {
    const block = m[0]
    const src = /<video\b[^>]*\bsrc="([^"]+)"/i.exec(block)?.[1]
    if (!src || !src.includes('res.cloudinary.com')) continue
    const poster = /<video\b[^>]*\bposter="([^"]+)"/i.exec(block)?.[1]
    const title =
      /data-title="([^"]*)"/i.exec(block)?.[1] ||
      /class="kh-video__title"[^>]*>([\s\S]*?)<\/p>/i.exec(block)?.[1]
    out.push({
      src,
      poster,
      title: title ? decodeEntities(stripTags(title)) : undefined,
    })
  }
  if (out.length) return out
  for (const m of html.matchAll(/<video\b[^>]*>/gi)) {
    const tag = m[0]
    const src = /(?:\bsrc="([^"]+)")/.exec(tag)?.[1]
    const poster = /(?:\bposter="([^"]+)")/.exec(tag)?.[1]
    if (src && src.includes('res.cloudinary.com')) out.push({ src, poster })
  }
  return out
}

function pickCoverUrl(blocks: Block[], coverHint: string | null): string {
  for (const b of blocks) {
    if (b.type === 'img') return b.src
    if (b.type === 'gallery' && b.srcs[0]) return b.srcs[0]
    if (b.type === 'video' && b.poster) return b.poster
  }
  const video = blocks.find((b): b is Extract<Block, { type: 'video' }> => b.type === 'video')
  if (video?.src) return video.src
  return coverHint || ''
}

async function uploadImage(src: string): Promise<string | null> {
  const cached = imageCache.get(src)
  if (cached) return cached
  let downloaded: { buf: Buffer; mime: string } | null = null
  for (let attempt = 1; attempt <= 3; attempt++) {
    downloaded = await fetchBuffer(src)
    if (downloaded) break
    await sleep(300 * attempt)
  }
  if (!downloaded) return null
  const ext =
    downloaded.mime === 'image/png'
      ? 'png'
      : downloaded.mime === 'image/gif'
        ? 'gif'
        : downloaded.mime === 'image/webp'
          ? 'webp'
          : 'jpg'
  const uploaded = await uploadBufferToCloudinary({
    buffer: downloaded.buf,
    originalName: `naver-story.${ext}`,
    mimeType: downloaded.mime,
    kind: 'image',
  })
  imageCache.set(src, uploaded.url)
  return uploaded.url
}

async function uploadVideo(src: string): Promise<string | null> {
  const cached = imageCache.get(`video:${src}`)
  if (cached) return cached
  let downloaded: { buf: Buffer; mime: string } | null = null
  for (let attempt = 1; attempt <= 3; attempt++) {
    downloaded = await fetchBuffer(src, {
      accept: 'video/mp4,video/*,*/*;q=0.8',
      allowVideo: true,
    })
    if (downloaded) break
    await sleep(400 * attempt)
  }
  if (!downloaded) return null
  if (downloaded.buf.length > 12 * 1024 * 1024) {
    console.warn('  skip video >12MB', Math.round(downloaded.buf.length / 1024), 'KB')
    return null
  }
  const uploaded = await uploadBufferToCloudinary({
    buffer: downloaded.buf,
    originalName: 'naver-story.mp4',
    mimeType: downloaded.mime.startsWith('video/') ? downloaded.mime : 'video/mp4',
    kind: 'video',
  })
  imageCache.set(`video:${src}`, uploaded.url)
  return uploaded.url
}

function pickVodSource(
  list: Array<{ encodingOption?: { name?: string; height?: number }; source?: string }>,
): string | null {
  const usable = list.filter((v) => v.source)
  const byHeight = (h: number) =>
    usable.find(
      (v) =>
        v.encodingOption?.height === h ||
        (v.encodingOption?.name || '').toUpperCase().includes(String(h)),
    )
  return (
    byHeight(480)?.source ||
    byHeight(360)?.source ||
    byHeight(270)?.source ||
    [...usable].sort((a, b) => (a.encodingOption?.height || 9999) - (b.encodingOption?.height || 9999))[0]
      ?.source ||
    null
  )
}

async function resolveNaverVideo(block: Extract<Block, { type: 'naverVideo' }>): Promise<Block | null> {
  const cached = videoCache.get(block.vid)
  if (cached) return { type: 'video', src: cached.src, poster: cached.poster, title: block.title || cached.title }
  const api = `https://apis.naver.com/rmcnmv/rmcnmv/vod/play/v2.0/${block.vid}?key=${encodeURIComponent(block.inkey)}`
  let json: { videos?: { list?: Array<{ encodingOption?: { name?: string; height?: number }; source?: string }> } }
  try {
    const res = await fetch(api, {
      headers: {
        'User-Agent': UA,
        Referer: `https://m.blog.naver.com/${BLOG_ID}`,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(25_000),
    })
    if (!res.ok) throw new Error(`vod ${res.status}`)
    json = (await res.json()) as typeof json
  } catch (e) {
    console.warn('  vod play api failed', block.vid.slice(0, 12), e)
    return null
  }
  const source = pickVodSource(json.videos?.list || [])
  if (!source) return null
  const src = await uploadVideo(source)
  if (!src) return null
  let poster: string | undefined
  if (block.thumb) {
    try {
      poster = (await uploadImage(block.thumb)) || undefined
    } catch (e) {
      console.warn('  video poster upload failed', e)
    }
  }
  const resolved = { src, poster, title: block.title }
  videoCache.set(block.vid, resolved)
  return { type: 'video', ...resolved }
}

async function resolveMedia(
  blocks: Block[],
  reuse: { imgs: string[]; videos: Array<{ src: string; poster?: string; title?: string }> },
): Promise<Block[]> {
  const out: Block[] = []
  let imgIdx = 0
  let videoIdx = 0
  const nextImg = async (src: string): Promise<string | null> => {
    const reused = reuse.imgs[imgIdx++]
    if (reused) return reused
    try {
      const url = await uploadImage(src)
      await sleep(80)
      return url
    } catch (e) {
      console.warn('  image upload failed', src.slice(0, 80), e)
      return null
    }
  }

  for (const b of blocks) {
    if (b.type === 'img') {
      const url = await nextImg(b.src)
      if (url) out.push({ ...b, src: url })
      continue
    }
    if (b.type === 'gallery') {
      const srcs: string[] = []
      for (const src of b.srcs) {
        const url = await nextImg(src)
        if (url) srcs.push(url)
      }
      if (srcs.length === 1) out.push({ type: 'img', src: srcs[0]!, alt: '' })
      else if (srcs.length > 1) out.push({ type: 'gallery', srcs })
      continue
    }
    if (b.type === 'naverVideo') {
      const reused = reuse.videos[videoIdx++]
      if (reused) {
        out.push({
          type: 'video',
          src: reused.src,
          poster: reused.poster,
          title: b.title || reused.title,
        })
        continue
      }
      try {
        const resolved = await resolveNaverVideo(b)
        if (resolved) out.push(resolved)
      } catch (e) {
        console.warn('  video upload failed', b.vid.slice(0, 12), e)
      }
      await sleep(200)
      continue
    }
    out.push(b)
  }
  return out
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
      userUrl: '',
      userActivationKey: '',
      userStatus: 0,
      displayName: '카야 인터내셔널',
    },
    select: { id: true },
  })
  return created.id
}

async function deleteSampleStories(): Promise<number> {
  const kindRows = await prisma.postMeta.findMany({
    where: { metaKey: 'khayah_kind', metaValue: '스토리' },
    select: { postId: true },
  })
  const storyIds = Array.from(new Set(kindRows.map((r) => r.postId)))
  if (!storyIds.length) return 0
  const imported = await prisma.postMeta.findMany({
    where: { metaKey: 'khayah_naver_log_no', postId: { in: storyIds } },
    select: { postId: true },
  })
  const keep = new Set(imported.map((r) => r.postId))
  const dropIds = storyIds.filter((id) => !keep.has(id))
  if (!dropIds.length) return 0

  const commentIds = (
    await prisma.comment.findMany({ where: { postId: { in: dropIds } }, select: { id: true } })
  ).map((c) => c.id)
  if (commentIds.length) {
    await prisma.commentMeta.deleteMany({ where: { commentId: { in: commentIds } } })
  }
  await prisma.comment.deleteMany({ where: { postId: { in: dropIds } } })
  await prisma.termRelationship.deleteMany({ where: { objectId: { in: dropIds } } })
  await prisma.postMeta.deleteMany({ where: { postId: { in: dropIds } } })
  await prisma.post.deleteMany({ where: { id: { in: dropIds } } })
  return dropIds.length
}

async function importedByLogNo(): Promise<
  Map<string, { id: number; content: string }>
> {
  const rows = await prisma.postMeta.findMany({
    where: { metaKey: 'khayah_naver_log_no' },
    select: { postId: true, metaValue: true },
  })
  const map = new Map<string, { id: number; content: string }>()
  const ids = rows.map((r) => r.postId)
  if (!ids.length) return map
  const posts = await prisma.post.findMany({
    where: { id: { in: ids } },
    select: { id: true, postContent: true },
  })
  const byId = new Map(posts.map((p) => [p.id, p.postContent || '']))
  for (const r of rows) {
    const logNo = (r.metaValue ?? '').trim()
    if (!logNo) continue
    map.set(logNo, { id: r.postId, content: byId.get(r.postId) || '' })
  }
  return map
}

async function updateStory(params: {
  id: number
  excerpt: string
  contentHtml: string
  coverUrl: string
}) {
  await prisma.post.update({
    where: { id: params.id },
    data: {
      postExcerpt: params.excerpt,
      postContent: params.contentHtml,
      postModified: new Date(),
      postModifiedGmt: new Date(),
    },
  })
  const coverMeta = await prisma.postMeta.findFirst({
    where: { postId: params.id, metaKey: 'khayah_cover_url' },
    select: { id: true },
  })
  if (coverMeta) {
    await prisma.postMeta.update({
      where: { id: coverMeta.id },
      data: { metaValue: params.coverUrl },
    })
  } else {
    await prisma.postMeta.create({
      data: { postId: params.id, metaKey: 'khayah_cover_url', metaValue: params.coverUrl },
    })
  }
}

async function createStory(params: {
  authorId: number
  title: string
  excerpt: string
  contentHtml: string
  date: Date
  scope: '해외' | '국내'
  coverUrl: string
  logNo: string
}) {
  const postName = slugify(`스토리-${params.logNo}-${params.title}`) || `story-${params.logNo}`
  const created = await prisma.post.create({
    data: {
      postAuthorId: params.authorId,
      postDate: params.date,
      postDateGmt: params.date,
      postModified: params.date,
      postModifiedGmt: params.date,
      postTitle: params.title,
      postExcerpt: params.excerpt,
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
      { postId: created.id, metaKey: 'khayah_kind', metaValue: '스토리' },
      { postId: created.id, metaKey: 'khayah_story_scope', metaValue: params.scope },
      { postId: created.id, metaKey: 'khayah_cover_url', metaValue: params.coverUrl },
      { postId: created.id, metaKey: 'khayah_naver_log_no', metaValue: params.logNo },
      {
        postId: created.id,
        metaKey: 'khayah_source_url',
        metaValue: `https://blog.naver.com/${BLOG_ID}/${params.logNo}`,
      },
    ],
  })
  return created.id
}

async function importOne(
  authorId: number,
  post: BlogPost,
  existing?: { id: number; content: string },
): Promise<'ok' | 'skip' | 'fail'> {
  const url = `https://m.blog.naver.com/PostView.naver?blogId=${BLOG_ID}&logNo=${post.logNo}`
  let html: string
  try {
    html = await fetchText(url)
  } catch (e) {
    console.warn(`FAIL fetch ${post.logNo}`, e)
    return 'fail'
  }
  let { blocks, coverHint } = componentsToBlocks(html, post.title)
  if (!DRY_RUN) {
    blocks = await resolveMedia(blocks, {
      imgs: existing ? existingCloudinaryImgs(existing.content) : [],
      videos: existing ? existingCloudinaryVideos(existing.content) : [],
    })
  }
  const contentHtml = blocksToHtml(blocks)
  const excerpt = deriveExcerpt(blocks) || post.title
  let cover = pickCoverUrl(blocks, DRY_RUN ? coverHint : null)
  if (!cover && coverHint && !DRY_RUN) {
    const reused = existing ? existingCloudinaryImgs(existing.content)[0] : undefined
    if (reused) cover = reused
    else {
      try {
        cover = (await uploadImage(coverHint)) || ''
      } catch (e) {
        console.warn('  cover upload failed', e)
      }
    }
  }

  const imgCount = blocks.reduce((n, b) => {
    if (b.type === 'img') return n + 1
    if (b.type === 'gallery') return n + b.srcs.length
    return n
  }, 0)
  const videoCount = blocks.filter((b) => b.type === 'video' || b.type === 'naverVideo').length
  const videoTitles = blocks
    .flatMap((b) => (b.type === 'video' || b.type === 'naverVideo' ? [b.title || ''] : []))
    .filter(Boolean)
  const hasMark = /<mark\b/i.test(contentHtml)
  const hasLink = /<a\b/i.test(contentHtml)
  console.log(
    `  ${post.scope} ${post.addDate} imgs=${imgCount} videos=${videoCount} mark=${hasMark ? 'y' : 'n'} link=${hasLink ? 'y' : 'n'} cover=${cover ? 'yes' : 'no'} ${post.title.slice(0, 56)}`,
  )
  if (videoTitles.length) console.log(`    video titles: ${videoTitles.join(' | ')}`)

  if (DRY_RUN) {
    if (ONLY_LOG) console.log(contentHtml.slice(0, 2800))
    return 'ok'
  }
  if (existing) {
    await updateStory({
      id: existing.id,
      excerpt,
      contentHtml,
      coverUrl: cover,
    })
  } else {
    await createStory({
      authorId,
      title: post.title,
      excerpt,
      contentHtml,
      date: parseNaverDate(post.addDate),
      scope: post.scope,
      coverUrl: cover,
      logNo: post.logNo,
    })
  }
  return 'ok'
}

async function main() {
  console.log(`mode=${DRY_RUN ? 'dry-run' : UPDATE ? 'update' : 'import'} limit=${LIMIT || 'all'}`)

  const listed: BlogPost[] = []
  for (const cat of CATEGORIES) {
    const rows = await listCategory(cat.categoryNo, cat.scope)
    console.log(`category ${cat.scope} (${cat.categoryNo}): ${rows.length}`)
    listed.push(...rows)
  }
  listed.sort((a, b) => parseNaverDate(b.addDate).getTime() - parseNaverDate(a.addDate).getTime())
  const filtered = ONLY_LOG ? listed.filter((p) => p.logNo === ONLY_LOG) : listed
  const selected = LIMIT ? filtered.slice(0, LIMIT) : filtered

  if (!DRY_RUN && !UPDATE) {
    const removed = await deleteSampleStories()
    console.log(`deleted sample stories: ${removed}`)
  }

  const existingMap = DRY_RUN ? new Map<string, { id: number; content: string }>() : await importedByLogNo()
  const authorId = DRY_RUN ? 0 : await ensureAuthorId()

  let ok = 0
  let skip = 0
  let fail = 0
  for (const [i, post] of selected.entries()) {
    const existing = existingMap.get(post.logNo)
    if (existing && !UPDATE) {
      skip++
      console.log(`[${i + 1}/${selected.length}] skip existing ${post.logNo}`)
      continue
    }
    console.log(`[${i + 1}/${selected.length}] ${existing ? 'update' : 'create'} ${post.scope} ${post.logNo}`)
    const result = await importOne(authorId, post, existing)
    if (result === 'ok') ok++
    else if (result === 'skip') skip++
    else fail++
    await sleep(280)
  }
  console.log(`done ok=${ok} skip=${skip} fail=${fail} imagesUploaded=${imageCache.size} videos=${videoCache.size}`)
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
