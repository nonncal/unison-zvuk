import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { toast, useToasts, type Toast } from '@/shared/lib/toast'
import './toaster.css'
function Item({ item }: { item: Toast }) {
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    if (!item.ttl) return
    const timer = window.setTimeout(() => toast.dismiss(item.key), item.ttl)
    return () => clearTimeout(timer)
  }, [item])
  return (
    <li className={`toast tone-${item.tone ?? 0}`}>
      <span className="toast-mark" aria-hidden="true" />
      <div className="toast-body">
        <strong>{item.title}</strong>
        {item.text && <span>{item.text}</span>}
        {item.actions && (
          <div className="toast-actions">
            {item.actions.map((action) => (
              <button
                key={action.label}
                disabled={busy}
                onClick={async () => {
                  setBusy(true)
                  try {
                    await action.run()
                  } finally {
                    setBusy(false)
                    toast.dismiss(item.key)
                  }
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        className="toast-close"
        aria-label="Закрыть уведомление"
        onClick={() => toast.dismiss(item.key)}
      >
        <X size={16} />
      </button>
    </li>
  )
}
export function Toaster() {
  const items = useToasts()
  return (
    <ol className="toaster" aria-live="polite" aria-label="Уведомления">
      {items.map((item) => (
        <Item key={item.key} item={item} />
      ))}
    </ol>
  )
}
