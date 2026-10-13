export type MaintenanceDocument = {
  version: 1
  enabled: boolean
  titleKo: string
  titleEn: string
  messageKo: string
  messageEn: string
}

export const MAINTENANCE_TITLE_MAX = 80
export const MAINTENANCE_MESSAGE_MAX = 600

export const DEFAULT_MAINTENANCE: MaintenanceDocument = {
  version: 1,
  enabled: false,
  titleKo: '잠시 점검 중입니다',
  titleEn: "We'll be back soon",
  messageKo:
    '더 안정적인 서비스를 위해 사이트를 점검하고 있습니다.\n조금만 기다려 주시면 곧 다시 찾아뵙겠습니다.',
  messageEn:
    'Khayah is temporarily unavailable while we carry out maintenance.\nPlease visit again in a little while.',
}

export const MAINTENANCE_CHANGED_EVENT = 'khayah-maintenance-changed'
const CACHE_KEY = 'khayah-maintenance-enabled'
const PREVIEW_PARAM = 'maintenance'
const PREVIEW_VALUE = 'preview'

export function isMaintenancePreview(search: string): boolean {
  return new URLSearchParams(search).get(PREVIEW_PARAM) === PREVIEW_VALUE
}

export function previewPath(locale: 'ko' | 'en'): string {
  return locale === 'en' ? `/en?${PREVIEW_PARAM}=${PREVIEW_VALUE}` : `/?${PREVIEW_PARAM}=${PREVIEW_VALUE}`
}

export function searchWithMaintenancePreview(search: string): string {
  const next = new URLSearchParams(search)
  next.set(PREVIEW_PARAM, PREVIEW_VALUE)
  return `?${next.toString()}`
}

export function searchWithoutMaintenancePreview(search: string): string {
  const next = new URLSearchParams(search)
  next.delete(PREVIEW_PARAM)
  const value = next.toString()
  return value ? `?${value}` : ''
}

export function readCachedMaintenanceEnabled(): boolean {
  try {
    return sessionStorage.getItem(CACHE_KEY) === '1'
  } catch {
    return false
  }
}

export function writeCachedMaintenanceEnabled(enabled: boolean): void {
  try {
    sessionStorage.setItem(CACHE_KEY, enabled ? '1' : '0')
  } catch {
    /* private mode */
  }
}
