import { Icon } from './Icon'

export function EmptyState({
  icon = 'spray',
  kicker = 'RAK MASIH KOSONG',
  title = 'Belum ada yang nongkrong di sini.',
  message,
  action = null,
}) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon" aria-hidden="true">
        <Icon name={icon} size={30} />
      </span>
      <p className="eyebrow">{kicker}</p>
      <h3 className="empty-state__title">{title}</h3>
      {message ? <p className="empty-state__message">{message}</p> : null}
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  )
}

export function ErrorState({
  error,
  onRetry,
  title = 'TEMBOK API GELAP.',
  kicker = 'KONEKSI PUTUS',
}) {
  return (
    <div className="empty-state empty-state--error">
      <span className="empty-state__icon" aria-hidden="true">
        <Icon name="wifiOff" size={30} />
      </span>
      <p className="eyebrow eyebrow--pink">{kicker}</p>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__message">
        {error?.message ||
          'Data belum bisa diambil. Pastikan server Laravel hidup, lalu muat ulang.'}
      </p>
      <p className="empty-state__hint">
        <Icon name="terminal" size={14} />
        <span>php artisan serve</span>
      </p>
      {onRetry ? (
        <div className="empty-state__action">
          <button type="button" className="btn btn--primary" onClick={onRetry}>
            Coba lagi
            <Icon name="refresh" size={16} />
          </button>
        </div>
      ) : null}
    </div>
  )
}
