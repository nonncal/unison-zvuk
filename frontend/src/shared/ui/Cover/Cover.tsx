export function Cover({ theme = 'blue', small = false }: { theme?: string; small?: boolean }) {
  return (
    <div className={`cover cover-${theme} ${small ? 'cover-small' : ''}`} aria-hidden="true">
      <div className="cover-orbit orbit-a" />
      <div className="cover-orbit orbit-b" />
      <div className="cover-orbit orbit-c" />
      <span className="cover-mark">u.</span>
      <span className="cover-line" />
    </div>
  )
}
