import { PostList } from '../../../components/PostList'
import type { Post } from '../../../types/post'

interface LatestPostsSectionProps {
  posts: Post[]
  loading: boolean
}

export function LatestPostsSection({ posts, loading }: LatestPostsSectionProps) {
  return (
    <section className="section section-post-list">
      <div className="section_wrapper clearfix">
        <div className="column one">
          <h2 className="section-title">최신 소식</h2>
          <PostList posts={posts} loading={loading} />
        </div>
      </div>
    </section>
  )
}
