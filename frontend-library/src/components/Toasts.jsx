import { Icon } from './Icon'

const TYPE_META = {
  success: { label: 'TERKIRIM', icon: 'check' },
  error: { label: 'GAGAL', icon: 'alert' },
  info: { label: 'CATATAN', icon: 'info' },
}

export default function Toasts({ toasts, onDismiss }) {
  if (toasts.length === 0) return null

  return (
    <div className="toasts" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => {
        const meta = TYPE_META[toast.type] || TYPE_META.info
        return (
          <div
            key={toast.id}
            className={`toast toast--${toast.type}`}
            role="status"
          >
            <span className="toast__icon">
              <Icon name={meta.icon} size={18} />
            </span>
            <div className="toast__copy">
              <p className="toast__label">{meta.label}</p>
              <p className="toast__message">{toast.message}</p>
            </div>
            <button
              type="button"
              className="toast__close"
              onClick={() => onDismiss(toast.id)}
              aria-label="Tutup notifikasi"
            >
              <Icon name="x" size={14} />
            </button>
            <span
              className="toast__progress"
              style={{ animationDuration: `${toast.duration}ms` }}
              aria-hidden="true"
            />
          </div>
        )
      })}
    </div>
  )
}
