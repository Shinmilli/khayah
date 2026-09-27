/**
 * Cloudinary에 저장된 원본은 그대로 두고, 화면에서 받는 주소만 WebP로 바꿉니다.
 * 새 파일을 업로드하지 않습니다.
 */
const CLOUDINARY_IMAGE_UPLOAD = '/image/upload/'

function isVersionSegment(segment: string): boolean {
  return /^v\d+$/.test(segment)
}

function isTransformSegment(segment: string): boolean {
  if (!segment || isVersionSegment(segment)) return false
  if (segment.includes(',')) return true
  return /^[a-z]{1,3}_/.test(segment)
}

function hasFlag(transforms: string[], flag: string): boolean {
  const re = new RegExp(`(?:^|,)${flag}(?:,|$)`)
  return transforms.some((segment) => re.test(segment))
}

export function toCloudinaryWebpUrl(url: string): string {
  const raw = url.trim()
  if (!raw) return url
  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return url
  }
  if (!/(^|\.)res\.cloudinary\.com$/i.test(parsed.hostname)) return url
  if (/\.gif(?:$|\?)/i.test(parsed.pathname)) return url

  const markerAt = parsed.pathname.indexOf(CLOUDINARY_IMAGE_UPLOAD)
  if (markerAt < 0) return url

  const prefix = parsed.pathname.slice(0, markerAt + CLOUDINARY_IMAGE_UPLOAD.length)
  const rest = parsed.pathname.slice(markerAt + CLOUDINARY_IMAGE_UPLOAD.length)
  const segments = rest.split('/').filter((segment) => segment.length > 0)
  if (segments.length === 0) return url

  const transforms: string[] = []
  let index = 0
  while (index < segments.length && isTransformSegment(segments[index])) {
    transforms.push(segments[index])
    index += 1
  }
  if (hasFlag(transforms, 'f_webp') || hasFlag(transforms, 'f_auto')) return url

  if (transforms.length > 0) transforms[0] = `f_webp,q_auto,${transforms[0]}`
  else transforms.push('f_webp,q_auto')

  const tail = segments.slice(index).join('/')
  parsed.pathname = `${prefix}${transforms.join('/')}${tail ? `/${tail}` : ''}`
  return parsed.toString()
}

export function rewriteCloudinaryImagesInHtml(html: string): string {
  return html.replace(/<img\b[^>]*>/gi, (tag) =>
    tag.replace(/\bsrc=(["'])([^"']+)\1/i, (_match, quote: string, src: string) => {
      return `src=${quote}${toCloudinaryWebpUrl(src)}${quote}`
    }),
  )
}
