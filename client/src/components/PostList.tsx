import { Link } from 'react-router-dom'
import type { Post } from '../types/post'

interface PostListProps {
  posts: Post[]
  loading?: boolean
}

export function PostList({ posts, loading }: PostListProps) {
  if (loading) {
    return <p className="loading">글 목록을 불러오는 중...</p>
  }
  if (!posts.length) {
    return <p className="no-posts">등록된 글이 없습니다.</p>
  }
  return (
    <div className="post-list">
      {posts.map((post) => (
        <article key={post.id} className="post-item" id={`post-${post.id}`}>
          <header className="entry-header">
            <h2 className="entry-title">
              <Link to={`/posts/${post.slug}`} rel="bookmark">{post.title}</Link>
            </h2>
            <div className="entry-meta">
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString('ko-KR')}
              </time>
              {post.author && (
                <span className="author"> · {post.author.displayName}</span>
              )}
            </div>
          </header>
          <div className="entry-summary">
            <p>{post.excerpt || post.content.slice(0, 160)}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
