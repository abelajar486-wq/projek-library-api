import Modal from './Modal'
import { Icon } from './Icon'

export default function ConfirmDialog({
  open,
  title = 'Hapus dari tembok?',
  eyebrow = 'KONFIRMASI SPRAY',
  message,
  confirmLabel = 'Hapus',
  cancelLabel = 'Batal',
  loading = false,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      eyebrow={eyebrow}
      title={title}
      size="sm"
      dismissible={!loading}
      footer={
        <>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'MENGHAPUS…' : confirmLabel}
            {!loading ? <Icon name="trash" size={16} /> : null}
          </button>
        </>
      }
    >
      <div className="confirm">
        <span className="confirm__stamp" aria-hidden="true">
          <Icon name="alert" size={28} />
        </span>
        <div>
          <p className="confirm__message">{message}</p>
          <p className="confirm__note">
            Aksi ini langsung mengubah data di API dan tidak bisa dibatalkan
            dari sini.
          </p>
        </div>
      </div>
    </Modal>
  )
}
