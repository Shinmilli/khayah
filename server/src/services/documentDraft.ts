import type { Request } from 'express'
import { loadAdminUser } from '../middlewares/requireAdmin'
import { deleteJsonDocument, readJsonDocumentOptional, writeJsonDocument } from './siteDocumentStore'

export type SaveMode = 'draft' | 'publish'

export function draftDocumentKey(key: string): string {
  return `${key}__draft`
}

export function saveModeOf(req: Request): SaveMode {
  return req.query.mode === 'draft' ? 'draft' : 'publish'
}

export function isAdminPath(req: Request): boolean {
  return req.path.startsWith('/admin/')
}

/** 공개 주소라도 관리자 세션이면 임시저장을 보여 준다. 세션이 없으면 게시본만 본다. */
export async function adminCanSeeDraft(req: Request): Promise<boolean> {
  return Boolean(await loadAdminUser(req))
}

export async function readDrafted<T>(
  key: string,
  readPublished: () => Promise<T>,
  preferDraft: boolean,
): Promise<{ doc: T; unpublished: boolean }> {
  if (preferDraft) {
    const draft = await readJsonDocumentOptional(draftDocumentKey(key))
    if (draft != null) return { doc: draft as T, unpublished: true }
  }
  return { doc: await readPublished(), unpublished: false }
}

export async function writeDrafted(
  key: string,
  cleaned: unknown,
  mode: SaveMode,
  afterPublish?: (previous: unknown | null) => Promise<void>,
): Promise<void> {
  if (mode === 'draft') {
    await writeJsonDocument(draftDocumentKey(key), cleaned)
    return
  }
  const previous = afterPublish ? await readJsonDocumentOptional(key) : null
  await writeJsonDocument(key, cleaned)
  await deleteJsonDocument(draftDocumentKey(key))
  if (afterPublish) await afterPublish(previous)
}
