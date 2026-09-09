export type SocialPreview = {
  url: string
  title: string
  description: string
  image: string | null
  publishedAt: string | null
}

export type SocialLatest = {
  blog: SocialPreview
  instagram: SocialPreview
}
