import '../styles/list-status.css'

type ListStatusVariant = 'loading' | 'empty' | 'error'

type ListStatusProps = {
  variant: ListStatusVariant
  message?: string
  /** 스켈레톤 줄 수 (loading일 때만) */
  lines?: number
  className?: string
}

const DEFAULTS: Record<ListStatusVariant, string> = {
  loading: '불러오는 중…',
  empty: '등록된 글이 없습니다.',
  error: '목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.',
}

export function ListStatus({ variant, message, lines = 4, className = '' }: ListStatusProps) {
  const text = message ?? DEFAULTS[variant]
  return (
    <div
      className={`list-status list-status--${variant}${className ? ` ${className}` : ''}`}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live="polite"
      aria-busy={variant === 'loading' ? true : undefined}
    >
      {variant === 'loading' ? (
        <>
          <span className="list-status__spinner" aria-hidden />
          <p className="list-status__text">{text}</p>
          <div className="list-status__skeleton" aria-hidden>
            {Array.from({ length: Math.max(1, Math.min(8, lines)) }, (_, i) => (
              <span key={i} className="list-status__bone" style={{ width: `${88 - (i % 3) * 12}%` }} />
            ))}
          </div>
        </>
      ) : (
        <p className="list-status__text">{text}</p>
      )}
    </div>
  )
}
