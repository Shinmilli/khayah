export type AdminEditLocale = 'ko' | 'en'

const LOCALES: { id: AdminEditLocale; label: string }[] = [
  { id: 'ko', label: '국문' },
  { id: 'en', label: '영문' },
]

export function AdminLocaleTabs({
  value,
  onChange,
  className = 'admin-segmented',
}: {
  value: AdminEditLocale
  onChange: (next: AdminEditLocale) => void
  className?: string
}) {
  return (
    <div className={className} role="group" aria-label="편집 언어">
      {LOCALES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={`admin-segmented__btn${value === id ? ' admin-segmented__btn--active' : ''}`}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export function AdminLocaleEmptyNote({ locale }: { locale: AdminEditLocale }) {
  if (locale !== 'en') return null
  return (
    <p className="admin-panel__foot" role="status">
      영문 내용은 비워 둘 수 있습니다. 입력한 영문만 영어 화면에 쓰입니다.
    </p>
  )
}
