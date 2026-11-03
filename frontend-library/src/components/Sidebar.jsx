import { Icon } from './Icon'
import { API_BASE } from '../api'
import { formatClock } from '../lib/format'

const NAV_ITEMS = [
  { key: 'beranda', href: '#/beranda', label: 'Beranda', icon: 'home', code: '01' },
  { key: 'buku', href: '#/buku', label: 'Buku', icon: 'book', code: '02' },
  {
    key: 'kategori',
    href: '#/kategori',
    label: 'Kategori',
    icon: 'tag',
    code: '03',
  },
  {
    key: 'lab',
    href: '#/lab',
    label: 'API Lab',
    icon: 'terminal',
    code: '04',
  },
]

export default function Sidebar({
  route,
  booksCount,
  categoriesCount,
  health,
  isOpen,
  collapsed,
  onClose,
  onDismiss,
}) {
  const statusLabel =
    health.status === 'online'
      ? 'ONLINE'
      : health.status === 'checking'
        ? 'NYAMBUNG…'
        : 'OFFLINE'

  return (
    <aside
      id="sidebar"
      className={`sidebar${isOpen ? ' is-open' : ''}${collapsed ? ' is-collapsed' : ''}`}
    >
      <div className="sidebar__head">
        <a className="brand" href="#/beranda" onClick={onClose}>
          <span className="brand__mark">
            <Icon name="spray" size={24} strokeWidth={1.6} />
          </span>
          <span className="brand__type">
            <span className="brand__name">Graffioteka</span>
            <span className="brand__sub">Perpustakaan Jalanan</span>
          </span>
        </a>
        <button
          type="button"
          className="icon-btn sidebar__close"
          onClick={onDismiss}
          aria-label="Sembunyikan navigasi"
          title="Sembunyikan navigasi"
        >
          <Icon name="chevronLeft" size={18} />
        </button>
      </div>

      <div className="sidebar__strip" aria-hidden="true">
        <span>PILOX EDITION</span>
        <span>SEJAK 2026</span>
        <span>BACA TERUS</span>
      </div>

      <nav className="sidebar__nav" aria-label="Navigasi utama">
        <p className="nav-label">
          <span>Ruang baca</span>
          <span className="nav-label__line" />
        </p>
        {NAV_ITEMS.slice(0, 3).map((item) => (
          <a
            key={item.key}
            href={item.href}
            className={`nav-item${route === item.key ? ' is-active' : ''}`}
            onClick={onClose}
            aria-current={route === item.key ? 'page' : undefined}
          >
            <span className="nav-item__icon">
              <Icon name={item.icon} size={19} />
            </span>
            <span className="nav-item__label">{item.label}</span>
            {item.key === 'buku' ? (
              <span className="nav-item__count">{booksCount}</span>
            ) : null}
            {item.key === 'kategori' ? (
              <span className="nav-item__count">{categoriesCount}</span>
            ) : null}
            <span className="nav-item__code">{item.code}</span>
          </a>
        ))}

        <p className="nav-label nav-label--spaced">
          <span>Bengkel API</span>
          <span className="nav-label__line" />
        </p>
        {NAV_ITEMS.slice(3).map((item) => (
          <a
            key={item.key}
            href={item.href}
            className={`nav-item${route === item.key ? ' is-active' : ''}`}
            onClick={onClose}
            aria-current={route === item.key ? 'page' : undefined}
          >
            <span className="nav-item__icon">
              <Icon name={item.icon} size={19} />
            </span>
            <span className="nav-item__label">{item.label}</span>
            <span className="nav-item__code">{item.code}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar__spacer" />

      <div className="sidebar__status">
        <div className="sidebar__status-head">
          <span className="mono-label">Status tembok</span>
          <span className={`dot dot--${health.status}`} aria-hidden="true" />
        </div>
        <p className={`sidebar__status-word text-${health.status}`}>
          {statusLabel}
        </p>
        <p className="sidebar__status-line">
          <span>{health.latency != null ? `${health.latency} ms` : '—'}</span>
          <span>{health.checkedAt ? formatClock(health.checkedAt) : '—'}</span>
        </p>
        <p className="sidebar__status-base" title={API_BASE}>
          {API_BASE}
        </p>
        <button
          type="button"
          className="link-btn"
          onClick={health.check}
          disabled={health.status === 'checking'}
        >
          {health.status === 'checking' ? 'MENEMBAK…' : 'CEK ULANG'}
          <Icon name="refresh" size={13} />
        </button>
      </div>

      <div className="sidebar__foot">
        <span className="sticker sticker--paper" aria-hidden="true">
          EST. 2026
        </span>
        <p>
          REACT × LARAVEL
          <br />
          TEMBOK DIPILOX, JIWA DIBAWA.
        </p>
      </div>
    </aside>
  )
}
