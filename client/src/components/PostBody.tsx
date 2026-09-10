import { useMemo, useRef, useState } from 'react'
import { parseNaverTvId, parseYoutubeId } from '../utils/postMedia'
import '../styles/post-media.css'

type Segment =
  | { type: 'html'; html: string }
  | { type: 'gallery'; srcs: string[]; alts: string[] }
  | { type: 'video'; src: string; poster?: string; title?: string }
  | { type: 'embed'; provider: 'youtube' | 'naver'; id: string; title?: string }

function videoTitleFromEl(el: HTMLElement): string | undefined {
  const fromData = el.getAttribute('data-title')?.trim()
  if (fromData) return fromData
  const caption = el.querySelector('.kh-video__title')?.textContent?.replace(/\s+/g, ' ').trim()
  if (caption) return caption
  return undefined
}

function galleryFromEl(el: Element): Segment | null {
  if (!(el instanceof HTMLElement)) return null
  if (!el.classList.contains('kh-gallery') && el.getAttribute('data-kh-gallery') == null) return null
  const imgs = [...el.querySelectorAll('img')].map((img) => ({
    src: img.getAttribute('src')?.trim() || '',
    alt: img.getAttribute('alt') || '',
  }))
  const srcs = imgs.map((i) => i.src).filter(Boolean)
  if (srcs.length === 0) return null
  return { type: 'gallery', srcs, alts: imgs.map((i) => i.alt) }
}

function videoFromEl(el: Element): Segment | null {
  if (!(el instanceof HTMLElement)) return null
  const title = videoTitleFromEl(el)
  const video = el.tagName === 'VIDEO' ? (el as HTMLVideoElement) : el.querySelector('video')
  if (video) {
    const src = video.getAttribute('src')?.trim() || video.querySelector('source')?.getAttribute('src')?.trim()
    if (!src) return null
    return { type: 'video', src, poster: video.getAttribute('poster')?.trim() || undefined, title }
  }
  const iframe = el.tagName === 'IFRAME' ? (el as HTMLIFrameElement) : el.querySelector('iframe')
  const src = iframe?.getAttribute('src')?.trim() || ''
  const yt = parseYoutubeId(src)
  if (yt) return { type: 'embed', provider: 'youtube', id: yt, title }
  const nv = parseNaverTvId(src)
  if (nv) return { type: 'embed', provider: 'naver', id: nv, title }
  return null
}

function parseSegments(html: string): Segment[] {
  if (typeof DOMParser === 'undefined') return [{ type: 'html', html }]
  const doc = new DOMParser().parseFromString(`<div id="post-root">${html}</div>`, 'text/html')
  const root = doc.getElementById('post-root')
  if (!root) return [{ type: 'html', html }]

  const out: Segment[] = []
  let htmlBuf: string[] = []

  const flushHtml = () => {
    const joined = htmlBuf.join('').trim()
    htmlBuf = []
    if (joined) out.push({ type: 'html', html: joined })
  }

  for (const node of Array.from(root.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent ?? ''
      if (t.replace(/\u200b/g, '').trim()) htmlBuf.push(t)
      continue
    }
    if (!(node instanceof Element)) continue

    const gallery = galleryFromEl(node)
    if (gallery) {
      flushHtml()
      out.push(gallery)
      continue
    }
    const video = videoFromEl(node)
    if (video) {
      flushHtml()
      out.push(video)
      continue
    }
    htmlBuf.push((node as HTMLElement).outerHTML)
  }
  flushHtml()
  return out
}

function Gallery({ srcs, alts }: { srcs: string[]; alts: string[] }) {
  const [index, setIndex] = useState(0)
  const total = srcs.length
  const go = (dir: number) => setIndex((i) => (i + dir + total) % total)
  const startX = useRef(0)

  return (
    <div className="kh-gallery" role="region" aria-roledescription="carousel" aria-label={`사진 ${total}장`}>
      <div
        className="kh-gallery__frame"
        onPointerDown={(e) => {
          startX.current = e.clientX
        }}
        onPointerUp={(e) => {
          if (total < 2) return
          const dx = e.clientX - startX.current
          if (dx > 40) go(-1)
          else if (dx < -40) go(1)
        }}
      >
        <img src={srcs[index]} alt={alts[index] || ''} />
        {total > 1 ? (
          <>
            <button type="button" className="kh-gallery__nav kh-gallery__nav--prev" onClick={() => go(-1)} aria-label="이전 사진">
              ‹
            </button>
            <button type="button" className="kh-gallery__nav kh-gallery__nav--next" onClick={() => go(1)} aria-label="다음 사진">
              ›
            </button>
          </>
        ) : null}
      </div>
      {total > 1 ? (
        <div className="kh-gallery__dots" role="tablist" aria-label="사진 위치">
          {srcs.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`kh-gallery__dot${i === index ? ' is-active' : ''}`}
              aria-label={`${i + 1}번째 사진`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function PostBody({ html }: { html: string }) {
  const segments = useMemo(() => parseSegments(html || ''), [html])
  if (!html?.trim()) return null

  return (
    <div className="the_content_wrapper page-body post-board__body">
      {segments.map((seg, i) => {
        if (seg.type === 'html') {
          return <div key={i} className="post-body-chunk" dangerouslySetInnerHTML={{ __html: seg.html }} />
        }
        if (seg.type === 'gallery') {
          return <Gallery key={i} srcs={seg.srcs} alts={seg.alts} />
        }
        if (seg.type === 'video') {
          return (
            <div key={i} className="kh-video" data-title={seg.title || undefined}>
              <video src={seg.src} poster={seg.poster} controls playsInline preload="metadata" title={seg.title} />
              {seg.title ? <p className="kh-video__title">{seg.title}</p> : null}
            </div>
          )
        }
        const src =
          seg.provider === 'youtube'
            ? `https://www.youtube-nocookie.com/embed/${seg.id}`
            : `https://tv.naver.com/embed/${seg.id}`
        return (
          <div key={i} className="kh-video kh-video--embed" data-title={seg.title || undefined}>
            <iframe
              src={src}
              title={seg.title || (seg.provider === 'youtube' ? 'YouTube' : 'Naver TV')}
              allowFullScreen
              loading="lazy"
            />
            {seg.title ? <p className="kh-video__title">{seg.title}</p> : null}
          </div>
        )
      })}
    </div>
  )
}
