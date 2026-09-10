import { postCoverMedia } from '../utils/postMedia'
import type { Post } from '../types/post'

export function PostCoverThumb({
  post,
  className,
}: {
  post: Pick<Post, 'content' | 'meta'>
  className?: string
}) {
  const media = postCoverMedia(post)
  if (media.kind === 'image') {
    return <img className={className} src={media.src} alt="" loading="lazy" />
  }
  if (media.kind === 'video') {
    return (
      <video
        className={className}
        src={media.src}
        poster={media.poster}
        muted
        playsInline
        preload="metadata"
        aria-hidden
      />
    )
  }
  return null
}
