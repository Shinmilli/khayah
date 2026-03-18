import { postRepository } from '../repositories/postRepository'
import type { PageListItem } from '../types/page'

export const pagesService = {
  async getPublishedPages(page = 1, perPage = 50) {
    const { pages, total } = await postRepository.findPublishedPages({ page, perPage })
    const list: PageListItem[] = pages.map((p) => ({
      id: p.id,
      title: p.postTitle,
      slug: p.postName,
      excerpt: p.postExcerpt,
      content: p.postContent,
      postParent: p.postParent,
      menuOrder: p.menuOrder,
    }))
    return { pages: list, total }
  },

  async getPageBySlug(slug: string) {
    const page = await postRepository.findPageBySlug(slug)
    if (!page) return null
    return {
      id: page.id,
      title: page.postTitle,
      slug: page.postName,
      excerpt: page.postExcerpt,
      content: page.postContent,
      postParent: page.postParent,
    }
  },
}
