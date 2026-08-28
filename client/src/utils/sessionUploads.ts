import type { DocumentUploadResult } from '../services/api'
import type { PdfAttachment } from './pdfAttachments'

/** 이번 편집 세션에서 올렸지만 아직 게시글에 저장되지 않은 미디어 */
export type SessionMediaRef = {
  url: string
  publicId?: string
  path?: string
  provider?: string
  resourceType?: string
  name?: string
}

export function sessionRefFromUpload(result: DocumentUploadResult): SessionMediaRef {
  return {
    url: result.url,
    publicId: result.publicId,
    path: result.path,
    provider: result.provider,
    resourceType: result.resourceType,
    name: result.originalName || result.filename,
  }
}

export function sessionRefFromAttachment(a: PdfAttachment): SessionMediaRef {
  return {
    url: a.url,
    publicId: a.publicId,
    path: a.path,
    provider: a.provider,
    resourceType: a.resourceType,
    name: a.name,
  }
}

export class SessionUploadTracker {
  private items = new Map<string, SessionMediaRef>()

  track(ref: SessionMediaRef): void {
    const url = ref.url?.trim()
    if (!url) return
    this.items.set(url, { ...ref, url })
  }

  has(url: string): boolean {
    return this.items.has(url.trim())
  }

  untrack(url: string): SessionMediaRef | undefined {
    const key = url.trim()
    const found = this.items.get(key)
    this.items.delete(key)
    return found
  }

  list(): SessionMediaRef[] {
    return [...this.items.values()]
  }

  clear(): void {
    this.items.clear()
  }

  takeAll(): SessionMediaRef[] {
    const all = this.list()
    this.clear()
    return all
  }
}
