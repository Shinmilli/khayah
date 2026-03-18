import { API_BASE } from '../constants'
import type { PostsResponse } from '../types/post'
import type { Page } from '../types/page'
import type { Post } from '../types/post'

export async function fetchPosts(page = 1, perPage = 10): Promise<PostsResponse> {
  const res = await fetch(`${API_BASE}/posts?page=${page}&perPage=${perPage}`)
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

export async function fetchPageBySlug(slug: string): Promise<Page | null> {
  const res = await fetch(`${API_BASE}/pages/${encodeURIComponent(slug)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch page')
  return res.json()
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const res = await fetch(`${API_BASE}/posts/${encodeURIComponent(slug)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch post')
  return res.json()
}
