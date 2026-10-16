import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
export function Dialog({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}) {
  const ref = useRef<HTMLDialogElement>(null),
    id = useId()
  useEffect(() => {
    const dialog = ref.current!,
      previous = document.activeElement as HTMLElement | null
    dialog.showModal()
    dialog.querySelector<HTMLInputElement>('input:not([type="file"])')?.focus()
    return () => {
      dialog.close()
      if (previous?.isConnected && !dialog.contains(previous)) previous.focus()
    }
  }, [])
  return (
    <dialog
      ref={ref}
      className={`dialog ${wide ? 'dialog-wide' : ''}`}
      aria-labelledby={id}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === ref.current) {
          const bounds = ref.current.getBoundingClientRect()
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          )
            onClose()
        }
      }}
    >
      <header className="dialog-heading">
        <h2 id={id}>{title}</h2>
        <button className="icon-button" aria-label="Закрыть окно" onClick={onClose}>
          <X size={21} />
        </button>
      </header>
      {children}
    </dialog>
  )
}
