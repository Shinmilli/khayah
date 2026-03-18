import { postRepository } from '../repositories/postRepository'
import type { PostListItem } from '../types/post'

interface GetPublishedOptions {
  page: number
  perPage: number
}

export const postsService = {
  async getPublishedPosts(options: GetPublishedOptions): Promise<{ posts: PostListItem[]; total: number }> {
    const { posts, total } = await postRepository.findPublished(options)
    const list: PostListItem[] = posts.map((p) => ({
      id: p.id,
      title: p.postTitle,
      excerpt: p.postExcerpt,
      content: p.postContent,
      slug: p.postName,
      status: p.postStatus,
      postType: p.postType,
      publishedAt: p.postDate.toISOString(),
      author: p.author
        ? { id: p.author.id, displayName: p.author.displayName }
        : undefined,
    }))
    return { posts: list, total }
  },

  async getPostBySlug(slug: string) {
    const post = await postRepository.findPostBySlug(slug)
    if (!post) return null
    return {
      id: post.id,
      title: post.postTitle,
      excerpt: post.postExcerpt,
      content: post.postContent,
      slug: post.postName,
      status: post.postStatus,
      postType: post.postType,
      publishedAt: post.postDate.toISOString(),
      author: post.author
        ? { id: post.author.id, displayName: post.author.displayName }
        : undefined,
    }
  },
}
