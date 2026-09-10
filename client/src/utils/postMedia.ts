export type PostCoverMedia =
  | { kind: 'image'; src: string }
  | { kind: 'video'; src: string; poster?: string }
  | { kind: 'none' }

const YT_HOST = /(^|\.)youtube\.com$|(^|\.)youtube-nocookie\.com$|(^|\.)youtu\.be$/i

export function parseYoutubeId(url: string): string | null {
  try {
    const u = new URL(url.trim())
    if (/youtu\.be$/i.test(u.hostname)) {
      const id = u.pathname.split('/').filter(Boolean)[0]
      return id && /^[\w-]{11}$/.test(id) ? id : null
    }
    if (!YT_HOST.test(u.hostname)) return null
    const v = u.searchParams.get('v')
    if (v && /^[\w-]{11}$/.test(v)) return v
    const m = u.pathname.match(/\/(?:embed|shorts)\/([\w-]{11})/)
    return m?.[1] ?? null
  } catch {
    return null
  }
}

export function parseNaverTvId(url: string): string | null {
  try {
    const u = new URL(url.trim())
    if (!/(^|\.)tv\.naver\.com$/i.test(u.hostname)) return null
    const m = u.pathname.match(/\/(?:v|embed)\/(\d+)/)
    return m?.[1] ?? null
  } catch {
    return null
  }
}

export function youtubePosterUrl(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

export function cloudinaryVideoPoster(url: string): string | null {
  const m = url.match(
    /^(https:\/\/res\.cloudinary\.com\/[^/]+)\/video\/upload\/(?:v\d+\/)?(.+?)\.(mp4|webm|mov|m4v)(?:\?|$)/i,
  )
  if (!m) return null
  return `${m[1]}/video/upload/so_0/${m[2]}.jpg`
}

function attr(tag: string, name: string): string {
  const m = tag.match(new RegExp(`\\b${name}=["']([^"']+)["']`, 'i'))
  return (m?.[1] ?? '').trim()
}

export function extractCoverFromHtml(html: string | null | undefined): PostCoverMedia {
  const raw = html?.trim() ?? ''
  if (!raw) return { kind: 'none' }

  const img = raw.match(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i)
  if (img?.[1]) return { kind: 'image', src: img[1] }

  const poster = raw.match(/<video\b[^>]*\bposter=["']([^"']+)["'][^>]*>/i)
  const videoSrc = raw.match(/<video\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i)
  if (poster?.[1]) {
    return { kind: 'image', src: poster[1] }
  }
  if (videoSrc?.[1]) {
    const derived = cloudinaryVideoPoster(videoSrc[1])
    return derived
      ? { kind: 'image', src: derived }
      : { kind: 'video', src: videoSrc[1] }
  }

  const iframe = raw.match(/<iframe\b[^>]*>/i)
  if (iframe) {
    const src = attr(iframe[0], 'src')
    const yt = parseYoutubeId(src)
    if (yt) return { kind: 'image', src: youtubePosterUrl(yt) }
  }

  return { kind: 'none' }
}

export function postCoverMedia(post: {
  meta?: Record<string, string>
  content?: string
}): PostCoverMedia {
  const cover = post.meta?.khayah_cover_url?.trim()
  if (cover) {
    if (/\.(mp4|webm|mov|m4v)(?:\?|$)/i.test(cover) || cover.includes('/video/upload/')) {
      const poster = cloudinaryVideoPoster(cover)
      return poster ? { kind: 'image', src: poster } : { kind: 'video', src: cover }
    }
    return { kind: 'image', src: cover }
  }
  return extractCoverFromHtml(post.content)
}

export function galleryHtml(urls: string[]): string {
  const imgs = urls
    .map((u) => u.trim())
    .filter(Boolean)
    .map((u) => `<img src="${escapeAttr(u)}" alt="">`)
    .join('')
  return `<div class="kh-gallery" data-kh-gallery data-count="${urls.length}">${imgs}</div>`
}

export function videoFileHtml(src: string, poster?: string, title?: string): string {
  const posterAttr = poster ? ` poster="${escapeAttr(poster)}"` : ''
  const t = title?.trim() || ''
  const titleAttr = t ? ` data-title="${escapeAttr(t)}"` : ''
  const caption = t ? `<p class="kh-video__title">${escapeHtml(t)}</p>` : ''
  return `<div class="kh-video" data-kh-video${titleAttr}><video src="${escapeAttr(src)}"${posterAttr} controls playsinline preload="metadata"></video>${caption}</div>`
}

export function youtubeEmbedHtml(id: string): string {
  return `<div class="kh-video kh-video--embed" data-kh-video data-provider="youtube" data-id="${escapeAttr(id)}"><iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}" title="YouTube" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`
}

export function naverTvEmbedHtml(id: string): string {
  return `<div class="kh-video kh-video--embed" data-kh-video data-provider="naver" data-id="${escapeAttr(id)}"><iframe src="https://tv.naver.com/embed/${encodeURIComponent(id)}" title="Naver TV" allowfullscreen loading="lazy"></iframe></div>`
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

function escapeHtml(s: string): string {
  return escapeAttr(s).replace(/>/g, '&gt;')
}
