import type { SaveMode } from '../../services/api'

export function takeUnpublished<T extends object>(saved: T): { doc: T; unpublished: boolean } {
  const record = { ...(saved as T & { unpublished?: boolean }) }
  const unpublished = Boolean(record.unpublished)
  delete record.unpublished
  return { doc: record as T, unpublished }
}

export function AdminSaveActions({ saving, onSave }: { saving: boolean; onSave: (mode: SaveMode) => void }) {
  return (
    <>
      <button type="button" className="admin-btn" disabled={saving} onClick={() => onSave('draft')}>
        {saving ? '저장 중…' : '임시저장'}
      </button>
      <button type="button" className="admin-btn admin-btn--primary" disabled={saving} onClick={() => onSave('publish')}>
        {saving ? '저장 중…' : '게시'}
      </button>
    </>
  )
}

export function draftStatus(unpublished: boolean, savedAt: string, savedMode: SaveMode | ''): string {
  if (savedAt && savedMode === 'draft') return `임시저장됨 (${savedAt}). 관리자 미리보기에서만 보이고, 게시 전에는 방문자에게 나오지 않습니다.`
  if (savedAt && savedMode === 'publish') return `게시됨 (${savedAt}). 방문자에게 공개되었습니다.`
  if (unpublished) return '게시되지 않은 임시저장이 있습니다. 미리보기는 로그인한 관리자에게만 그 내용을 보여 줍니다.'
  return ''
}
