export interface PostListItem {
  id: number
  title: string
  excerpt: string
  content: string
  slug: string
  status: string
  postType: string
  publishedAt: string
  author?: { id: number; displayName: string }
  meta?: Record<string, string>
}
