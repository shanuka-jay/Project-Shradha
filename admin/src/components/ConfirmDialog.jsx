import { useEffect, useRef } from 'react'
import './ConfirmDialog.css'

/**
 * Modern confirmation dialog — replaces window.confirm()
 *
 * Usage:
 *   const [confirm, setConfirm] = useState(null)
 *
 *   // trigger:
 *   setConfirm({ title: 'Delete Temple', message: '...', onConfirm: () => doDelete() })
 *
 *   // render:
 *   <ConfirmDialog config={confirm} onClose={() => setConfirm(null)} />
 */
export default function ConfirmDialog({ config, onClose }) {
  const cancelRef = useRef(null)

  useEffect(() => {
    if (config) cancelRef.current?.focus()
  }, [config])

  useEffect(() => {
    function onKey(e) {
      if (!config) return
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [config, onClose])

  if (!config) return null

  const {
    title = 'Are you sure?',
    message,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    variant = 'danger',   // 'danger' | 'warning' | 'info'
    onConfirm,
  } = config

  function handleConfirm() {
    onClose()
    onConfirm?.()
  }

  return (
    <div className="cd-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="cd-title">
      <div className="cd-panel" onClick={e => e.stopPropagation()}>

        <div className={`cd-icon-wrap cd-icon-${variant}`}>
          {variant === 'danger'  && <TrashIcon />}
          {variant === 'warning' && <WarnIcon />}
          {variant === 'info'    && <InfoIcon />}
        </div>

        <h2 className="cd-title" id="cd-title">{title}</h2>

        {message && <p className="cd-message">{message}</p>}

        <div className="cd-actions">
          <button
            ref={cancelRef}
            className="cd-btn cd-cancel"
            onClick={onClose}
          >
            {cancelLabel}
          </button>
          <button
            className={`cd-btn cd-confirm cd-confirm-${variant}`}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </button>
        </div>

      </div>
    </div>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  )
}

function WarnIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}
