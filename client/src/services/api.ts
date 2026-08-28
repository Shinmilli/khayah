import { API_BASE } from '../constants'
import type { YoutubeLatestVideo } from '../types/youtube'
import type { PostsResponse } from '../types/post'
import type { Page } from '../types/page'
import type { Post } from '../types/post'
import type { FinancialReportsDocument } from '../features/financial-report/financialReportTypes'
import type { InquiryAdmin, InquiryPublic } from '../types/inquiry'
import type { InquiryFaqDocument } from '../types/inquiryFaq'

export type AdminPost = Post & { meta?: Record<string, string> }
export type AdminPostsResponse = { posts: AdminPost[]; total: number }

async function readApiError(res: Response, fallback: string): Promise<string> {
  const text = await res.text().catch(() => '')
  try {
    const json = JSON.parse(text) as { error?: string; hint?: string }
    const parts = [json.error, json.hint].filter(Boolean)
    if (parts.length > 0) return parts.join(' — ')
  } catch {
    /* ignore */
  }
  return text || fallback
}

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
  publicId?: string
  resourceType?: string
  provider?: string
}

export async function deleteUploadedMedia(ref: {
  url: string
  publicId?: string
  path?: string
  provider?: string
  resourceType?: string
}): Promise<void> {
  const res = await fetch(`${API_BASE}/uploads/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ref),
  })
  if (!res.ok) throw new Error(await readApiError(res, '업로드 파일 삭제에 실패했습니다.'))
}

export async function uploadDocumentPdf(file: File): Promise<DocumentUploadResult> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${API_BASE}/uploads/document`, { method: 'POST', body: form })
  if (!res.ok) {
    throw new Error(await readApiError(res, 'PDF 업로드에 실패했습니다.'))
  }
  const data = (await res.json()) as DocumentUploadResult
  if (!data?.url?.trim()) {
    throw new Error('업로드 응답에 URL이 없습니다. API 서버와 Supabase 설정을 확인하세요.')
  }
  return data
}

/** 재무상태표·운영성과표 등 이미지(JPEG/PNG/WebP/GIF) */
export async function uploadReportImage(file: File): Promise<DocumentUploadResult> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${API_BASE}/uploads/image`, { method: 'POST', body: form })
  if (!res.ok) throw new Error(await readApiError(res, '이미지 업로드에 실패했습니다.'))
  return res.json()
}

export async function adminFetchPostsByKind(kind: string, page = 1, perPage = 20): Promise<AdminPostsResponse> {
  const res = await fetch(
    `${API_BASE}/admin/posts?kind=${encodeURIComponent(kind)}&page=${page}&perPage=${perPage}`,
  )
  if (!res.ok) throw new Error(await readApiError(res, '게시글 목록을 불러오지 못했습니다.'))
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
  publishedAt?: string
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
    publishedAt?: string
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

export async function createInquiry(input: {
  name: string
  contact: string
  pin: string
  type: string
  subject: string
  body: string
}): Promise<InquiryPublic> {
  const res = await fetch(`${API_BASE}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(await readApiError(res, '문의 접수에 실패했습니다.'))
  return res.json()
}

export async function fetchInquiryFaq(): Promise<InquiryFaqDocument> {
  const res = await fetch(`${API_BASE}/inquiry-faq`)
  if (!res.ok) throw new Error(await readApiError(res, 'FAQ를 불러오지 못했습니다.'))
  return res.json()
}

export async function adminFetchInquiryFaq(): Promise<InquiryFaqDocument> {
  const res = await fetch(`${API_BASE}/admin/inquiry-faq`)
  if (!res.ok) throw new Error(await readApiError(res, 'FAQ를 불러오지 못했습니다.'))
  return res.json()
}

export async function adminPutInquiryFaq(doc: InquiryFaqDocument): Promise<InquiryFaqDocument> {
  const res = await fetch(`${API_BASE}/admin/inquiry-faq`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doc),
  })
  if (!res.ok) throw new Error(await readApiError(res, 'FAQ 저장에 실패했습니다.'))
  return res.json()
}

export async function lookupInquiries(input: {
  name: string
  contact: string
  pin: string
}): Promise<InquiryPublic[]> {
  const res = await fetch(`${API_BASE}/inquiries/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(await readApiError(res, '문의 조회에 실패했습니다.'))
  const data = (await res.json()) as { inquiries: InquiryPublic[] }
  return data.inquiries ?? []
}

export async function adminFetchInquiries(
  page = 1,
  perPage = 20,
  filters: { name?: string; contact?: string } = {},
): Promise<{ inquiries: InquiryAdmin[]; total: number }> {
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
  })
  const name = filters.name?.trim()
  const contact = filters.contact?.trim()
  if (name) params.set('name', name)
  if (contact) params.set('contact', contact)
  const res = await fetch(`${API_BASE}/admin/inquiries?${params}`)
  if (!res.ok) throw new Error(await readApiError(res, '문의 목록을 불러오지 못했습니다.'))
  return res.json()
}

export async function adminUpdateInquiry(
  id: number,
  input: { status?: string; reply?: string; memo?: string },
): Promise<InquiryAdmin> {
  const res = await fetch(`${API_BASE}/admin/inquiries/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error(await readApiError(res, '문의 저장에 실패했습니다.'))
  return res.json()
}

export async function adminDeleteInquiry(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/inquiries/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(await readApiError(res, '문의 삭제에 실패했습니다.'))
}
