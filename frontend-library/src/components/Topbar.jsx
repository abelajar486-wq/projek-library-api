import { Icon } from './Icon'
import { todayLabel } from '../lib/format'

export default function Topbar({
  meta,
  health,
  busy,
  onRefresh,
  onToggleMenu,
  menuExpanded,
  onCreateBook,
  onOpenLab,
}) {
  return (
    <header className="topbar">
      <div className="topbar__left">
        <button
          type="button"
          className="icon-btn topbar__menu"
          onClick={onToggleMenu}
          aria-label={
            menuExpanded ? 'Sembunyikan navigasi' : 'Tampilkan navigasi'
          }
          aria-expanded={menuExpanded}
          aria-controls="sidebar"
          title={menuExpanded ? 'Sembunyikan navigasi' : 'Tampilkan navigasi'}
        >
          <Icon name="menu" size={20} />
        </button>

        <div className="topbar__crumb">
          <span className="topbar__kicker">GRAFFIOTEKA</span>
          <span className="topbar__slash" aria-hidden="true">
            /
          </span>
          <span className="topbar__current">{meta.label}</span>
          <span className="topbar__code">{meta.code}</span>
        </div>
      </div>

      <div className="topbar__right">
        <span className="topbar__date">{todayLabel()}</span>

        <button
          type="button"
          className={`pill pill--${health.status} topbar__health`}
          onClick={onOpenLab}
          title="Buka API Lab"
        >
          <span className={`dot dot--${health.status}`} aria-hidden="true" />
          <span className="topbar__health-text">
            API{' '}
            {health.status === 'online'
              ? `${health.latency ?? 0}ms`
              : health.status === 'checking'
                ? '…'
                : 'OFF'}
          </span>
        </button>

        <button
          type="button"
          className="icon-btn topbar__refresh"
          onClick={onRefresh}
          aria-label="Muat ulang semua data"
          title="Muat ulang semua data"
        >
          <Icon
            name="refresh"
            size={17}
            className={busy ? 'is-spinning' : ''}
          />
        </button>

        <button
          type="button"
          className="btn btn--primary btn--sm topbar__add"
          onClick={onCreateBook}
        >
          <Icon name="plus" size={16} />
          <span className="topbar__add-text">Tambah buku</span>
        </button>
      </div>
    </header>
  )
}
