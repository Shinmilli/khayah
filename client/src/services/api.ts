import { API_BASE } from '../constants'
import type { YoutubeLatestVideo } from '../types/youtube'
import type { PostsResponse } from '../types/post'
import type { Page } from '../types/page'
import type { Post } from '../types/post'

/** slug에 %가 남아 있으면(이중 인코딩 등) 안정화할 때까지 디코드한 뒤 한 번만 인코드 */
function encodeSlugForPath(slug: string): string {
  let s = slug
  try {
    for (let i = 0; i < 4 && s.includes('%'); i++) {
      const next = decodeURIComponent(s)
      if (next === s) break
      s = next
    }
  } catch {
    return encodeURIComponent(slug)
  }
  return encodeURIComponent(s)
}

export async function fetchPosts(page = 1, perPage = 10): Promise<PostsResponse> {
  const res = await fetch(`${API_BASE}/posts?page=${page}&perPage=${perPage}`)
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

export async function fetchPageBySlug(slug: string): Promise<Page | null> {
  const res = await fetch(`${API_BASE}/pages/${encodeSlugForPath(slug)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch page')
  return res.json()
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const res = await fetch(`${API_BASE}/posts/${encodeSlugForPath(slug)}`)
  if (res.status === 404) return null
  if (!res.ok) throw new Error('Failed to fetch post')
  return res.json()
}

export async function fetchYoutubeLatest(): Promise<YoutubeLatestVideo> {
  const res = await fetch(`${API_BASE}/youtube/latest`)
  if (!res.ok) throw new Error('Failed to fetch YouTube latest')
  return res.json()
}
