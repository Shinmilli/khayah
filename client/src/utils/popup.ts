export type PopupItem = {
  id: string
  enabled: boolean
  imageUrl: string
  linkUrl?: string
  buttonEnabled?: boolean
  buttonLabel?: string
  buttonUrl?: string
}

export type PopupConfig = {
  items: PopupItem[]
}

const CONFIG_KEY = 'khayah.popup.config'
const HIDE_TODAY_PREFIX = 'khayah.popup.hideToday.'

/** 같은 탭에서도 팝업 설정 반영용 (savePopupConfig에서 발행) */
export const POPUP_CONFIG_CHANGED_EVENT = 'khayah-popups-config-changed'

const SESSION_DISMISSED_KEY = 'khayah.popup.sessionDismissedIds'

function readSessionDismissedIds(): Set<string> {
  try {
    const raw = sessionStorage.getItem(SESSION_DISMISSED_KEY)
    const arr = JSON.parse(raw || '[]') as unknown
    if (!Array.isArray(arr)) return new Set()
    return new Set(arr.filter((x): x is string => typeof x === 'string' && x.length > 0))
  } catch {
    return new Set()
  }
}

/** 닫기(X·배경)로만 건너뛴 팝업 — 탭을 닫기 전까지 홈에서 다시 뜨지 않음 */
export function rememberPopupDismissedThisSession(popupId: string) {
  const s = readSessionDismissedIds()
  s.add(popupId)
  sessionStorage.setItem(SESSION_DISMISSED_KEY, JSON.stringify([...s]))
}

function uid(): string {
  return `p_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`
}

export function getDefaultPopupItem(): PopupItem {
  return {
    id: uid(),
    enabled: false,
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=800&fit=crop',
    linkUrl: '',
    buttonEnabled: false,
    buttonLabel: '자세히 보기',
    buttonUrl: '',
  }
}

export function getDefaultPopupConfig(): PopupConfig {
  return { items: [getDefaultPopupItem()] }
}

function coerceItem(raw: Partial<PopupItem>): PopupItem {
  return {
    id: typeof raw.id === 'string' && raw.id.trim() ? raw.id : uid(),
    enabled: Boolean(raw.enabled),
    imageUrl: typeof raw.imageUrl === 'string' && raw.imageUrl.trim() ? raw.imageUrl : getDefaultPopupItem().imageUrl,
    linkUrl: typeof raw.linkUrl === 'string' ? raw.linkUrl.trim() : '',
    buttonEnabled: Boolean(raw.buttonEnabled),
    buttonLabel: typeof raw.buttonLabel === 'string' ? raw.buttonLabel : getDefaultPopupItem().buttonLabel,
    buttonUrl: typeof raw.buttonUrl === 'string' ? raw.buttonUrl.trim() : '',
  }
}

export function loadPopupConfig(): PopupConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    if (!raw) return getDefaultPopupConfig()
    const parsed = JSON.parse(raw) as unknown

    // Backward compat: old shape {enabled,imageUrl,linkUrl}
    if (parsed && typeof parsed === 'object' && !('items' in (parsed as Record<string, unknown>))) {
      const legacy = parsed as Partial<PopupItem>
      return { items: [coerceItem({ ...legacy, id: uid() })] }
    }

    const itemsRaw = (parsed as { items?: unknown }).items
    if (!Array.isArray(itemsRaw)) return getDefaultPopupConfig()
    const items = itemsRaw.map((i) => coerceItem((i ?? {}) as Partial<PopupItem>)).slice(0, 20)
    return { items: items.length ? items : [getDefaultPopupItem()] }
  } catch {
    return getDefaultPopupConfig()
  }
}

export function savePopupConfig(config: PopupConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
  window.dispatchEvent(new Event(POPUP_CONFIG_CHANGED_EVENT))
}

/** 홈에서 순차 표시할 팝업 목록(활성 + 오늘 그만보기 제외 + 이번 탭에서 닫은 항목 제외, 배열 순서 유지) */
export function buildVisiblePopupQueue(): PopupItem[] {
  const cfg = loadPopupConfig()
  const sessionSkip = readSessionDismissedIds()
  return cfg.items.filter(
    (p) => p.enabled && !isPopupHiddenToday(p.id) && !sessionSkip.has(p.id),
  )
}

function todayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

export function isPopupHiddenToday(popupId: string): boolean {
  return localStorage.getItem(`${HIDE_TODAY_PREFIX}${popupId}`) === todayKey()
}

export function hidePopupToday(popupId: string) {
  localStorage.setItem(`${HIDE_TODAY_PREFIX}${popupId}`, todayKey())
}

