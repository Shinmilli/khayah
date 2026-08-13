import { API_BASE } from '../constants'
import type { YoutubeLatestVideo } from '../types/youtube'
import type { PostsResponse } from '../types/post'
import type { Page } from '../types/page'
import type { Post } from '../types/post'
import type { FinancialReportsDocument } from '../features/financial-report/financialReportTypes'

export type AdminPost = Post & { meta?: Record<string, string> }
export type AdminPostsResponse = { posts: AdminPost[]; total: number }

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

export async function fetchPostsByKind(kind: string, page = 1, perPage = 10): Promise<PostsResponse> {
  const res = await fetch(`${API_BASE}/posts?kind=${encodeURIComponent(kind)}&page=${page}&perPage=${perPage}`)
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

export async function fetchPostsByKindAndRegion(
  kind: string,
  region: string | null,
  page = 1,
  perPage = 10,
): Promise<PostsResponse> {
  const regionParam = region ? `&region=${encodeURIComponent(region)}` : ''
  const res = await fetch(
    `${API_BASE}/posts?kind=${encodeURIComponent(kind)}${regionParam}&page=${page}&perPage=${perPage}`,
  )
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

export type DocumentUploadResult = {
  url: string
  path: string
  filename: string
  originalName: string
  mimeType: string
  size: number
}

export async function uploadDocumentPdf(file: File): Promise<DocumentUploadResult> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${API_BASE}/uploads/document`, { method: 'POST', body: form })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    try {
      const json = JSON.parse(text) as { error?: string; hint?: string }
      throw new Error([json.error, json.hint].filter(Boolean).join(' — ') || text || 'Failed to upload document')
    } catch (e) {
      if (e instanceof Error && e.message !== text) throw e
      throw new Error(text || 'Failed to upload document')
    }
  }
  return res.json()
}

/** 재무상태표·운영성과표 등 이미지(JPEG/PNG/WebP/GIF) */
export async function uploadReportImage(file: File): Promise<DocumentUploadResult> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${API_BASE}/uploads/image`, { method: 'POST', body: form })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || 'Failed to upload image')
  }
  return res.json()
}

export async function adminFetchPostsByKind(kind: string, page = 1, perPage = 20): Promise<AdminPostsResponse> {
  const res = await fetch(
    `${API_BASE}/admin/posts?kind=${encodeURIComponent(kind)}&page=${page}&perPage=${perPage}`,
  )
  if (!res.ok) throw new Error('Failed to fetch admin posts')
  return res.json()
}

export async function adminFetchPost(id: number): Promise<AdminPost> {
  const res = await fetch(`${API_BASE}/admin/posts/${id}`)
  if (!res.ok) throw new Error('Failed to fetch admin post')
  return res.json()
}

export async function adminCreatePost(input: {
  kind: string
  title: string
  excerpt?: string
  content?: string
  status?: 'publish' | 'draft'
  meta?: Record<string, string>
}): Promise<AdminPost> {
  const res = await fetch(`${API_BASE}/admin/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('Failed to create admin post')
  return res.json()
}

export async function adminUpdatePost(
  id: number,
  input: {
    title?: string
    excerpt?: string
    content?: string
    status?: 'publish' | 'draft'
    meta?: Record<string, string>
  },
): Promise<AdminPost> {
  const res = await fetch(`${API_BASE}/admin/posts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('Failed to update admin post')
  return res.json()
}

export async function adminDeletePost(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/posts/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete admin post')
}

export async function fetchFinancialReports(): Promise<FinancialReportsDocument> {
  const res = await fetch(`${API_BASE}/financial-reports`)
  if (!res.ok) throw new Error('Failed to fetch financial reports')
  return res.json()
}

export async function adminPutFinancialReports(doc: FinancialReportsDocument): Promise<FinancialReportsDocument> {
  const res = await fetch(`${API_BASE}/admin/financial-reports`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doc),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || 'Failed to save financial reports')
  }
  return res.json()
}
