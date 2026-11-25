import type { Request } from 'express'
import { loadAdminUser } from '../middlewares/requireAdmin'
import {
  deleteRemovedStoredMedia,
  deleteStoredMediaMany,
  extractRemoteMediaFromValue,
  mediaNotIn,
} from '../utils/storedMedia'
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
    const [published, previousDraft] = await Promise.all([
      readJsonDocumentOptional(key),
      readJsonDocumentOptional(draftDocumentKey(key)),
    ])
    await writeJsonDocument(draftDocumentKey(key), cleaned)
    // 초안에서 빠졌고 게시본에도 없는 파일만 지운다. 게시 중인 파일은 남긴다.
    await deleteStoredMediaMany(
      mediaNotIn(extractRemoteMediaFromValue(previousDraft), [
        ...extractRemoteMediaFromValue(cleaned),
        ...extractRemoteMediaFromValue(published),
      ]),
    )
    return
  }
  const [previous, previousDraft] = await Promise.all([
    readJsonDocumentOptional(key),
    readJsonDocumentOptional(draftDocumentKey(key)),
  ])
  await writeJsonDocument(key, cleaned)
  await deleteJsonDocument(draftDocumentKey(key))
  try {
    if (afterPublish) await afterPublish(previous)
  } finally {
    await deleteRemovedStoredMedia([previous, previousDraft], cleaned)
  }
}
