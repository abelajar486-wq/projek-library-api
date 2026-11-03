import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon'

export default function Modal({
  open,
  onClose,
  title,
  eyebrow = 'LEMBAR KERJA',
  children,
  footer = null,
  size = 'md',
  dismissible = true,
  ariaLabel,
}) {
  const panelRef = useRef(null)
  const closeRef = useRef(onClose)
  const dismissibleRef = useRef(dismissible)
  const titleId = useId()

  useEffect(() => {
    closeRef.current = onClose
    dismissibleRef.current = dismissible
  }, [onClose, dismissible])

  useEffect(() => {
    if (!open) return undefined

    const panel = panelRef.current
    const previouslyFocused = document.activeElement
    document.body.classList.add('has-modal')

    const getFocusable = () =>
      Array.from(
        panel?.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) || [],
      ).filter((element) => element.offsetParent !== null)

    const focusTimer = setTimeout(() => {
      const target =
        panel?.querySelector('[data-autofocus]') || getFocusable()[0] || panel
      target?.focus?.()
    }, 60)

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && dismissibleRef.current) {
        event.stopPropagation()
        closeRef.current?.()
        return
      }

      if (event.key !== 'Tab') return
      const focusable = getFocusable()
      if (focusable.length === 0) {
        event.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKeyDown)
      document.body.classList.remove('has-modal')
      previouslyFocused?.focus?.()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      className="modal"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && dismissibleRef.current) {
          closeRef.current?.()
        }
      }}
    >
      <div
        ref={panelRef}
        className={`modal__panel modal__panel--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-label={ariaLabel}
        tabIndex={-1}
      >
        <span className="tape tape--tl" aria-hidden="true" />
        <span className="tape tape--br" aria-hidden="true" />

        <header className="modal__head">
          <div>
            <p className="eyebrow eyebrow--dark">{eyebrow}</p>
            <h2 id={titleId} className="modal__title">
              {title}
            </h2>
          </div>
          <button
            type="button"
            className="icon-btn icon-btn--paper modal__close"
            onClick={() => closeRef.current?.()}
            aria-label="Tutup dialog"
            disabled={!dismissible}
          >
            <Icon name="x" size={18} />
          </button>
        </header>

        <div className="modal__body">{children}</div>
        {footer ? <footer className="modal__foot">{footer}</footer> : null}
      </div>
    </div>,
    document.body,
  )
}
