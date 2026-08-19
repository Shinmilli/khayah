import { pageWindow } from '../utils/paginate'
import '../styles/pagination.css'

export function Pagination({
  page,
  totalPages,
  onChange,
  label = '목록 페이지',
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
  label?: string
}) {
  if (totalPages <= 1) return null
  const items = pageWindow(page, totalPages)

  return (
    <nav className="pager" aria-label={label}>
      <button
        type="button"
        className="pager__btn"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        이전
      </button>
      {items.map((item, i) =>
        item === 'gap' ? (
          <span key={`gap-${i}`} className="pager__gap" aria-hidden>
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`pager__btn pager__num${item === page ? ' is-active' : ''}`}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        className="pager__btn"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        다음
      </button>
    </nav>
  )
}
