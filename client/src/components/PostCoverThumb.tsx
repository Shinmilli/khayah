import { postCoverMedia } from '../utils/postMedia'
import { toCloudinaryWebpUrl } from '../utils/cloudinaryWebp'
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
    return <img className={className} src={toCloudinaryWebpUrl(media.src)} alt="" loading="lazy" />
  }
  if (media.kind === 'video') {
    return (
      <video
        className={className}
        src={media.src}
        poster={media.poster ? toCloudinaryWebpUrl(media.poster) : undefined}
        muted
        playsInline
        preload="metadata"
        aria-hidden
      />
    )
  }
  return null
}
