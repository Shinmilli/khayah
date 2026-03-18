export interface Page {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  postParent?: number
}
