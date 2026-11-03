import { Icon } from './Icon'

function buildPages(current, total) {
  const pages = []
  for (let page = 1; page <= total; page += 1) {
    if (page === 1 || page === total || Math.abs(page - current) <= 1) {
      pages.push(page)
    }
  }

  const result = []
  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) {
      result.push(`gap-${page}`)
    }
    result.push(page)
  })
  return result
}

export default function Pagination({
  page,
  total,
  pageSize,
  onPageChange,
  label = 'item',
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(total, page * pageSize)

  return (
    <nav className="pagination" aria-label="Navigasi halaman">
      <p className="pagination__meta">
        {from}–{to} <span>/ {total} {label}</span>
      </p>
      <div className="pagination__controls">
        <button
          type="button"
          className="pagination__btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Halaman sebelumnya"
        >
          <Icon name="chevronLeft" size={16} />
        </button>

        {buildPages(page, totalPages).map((entry) =>
          typeof entry === 'number' ? (
            <button
              key={entry}
              type="button"
              className={`pagination__btn${entry === page ? ' is-active' : ''}`}
              onClick={() => onPageChange(entry)}
              aria-label={`Halaman ${entry}`}
              aria-current={entry === page ? 'page' : undefined}
            >
              {String(entry).padStart(2, '0')}
            </button>
          ) : (
            <span key={entry} className="pagination__gap" aria-hidden="true">
              …
            </span>
          ),
        )}

        <button
          type="button"
          className="pagination__btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Halaman berikutnya"
        >
          <Icon name="chevronRight" size={16} />
        </button>
      </div>
    </nav>
  )
}
