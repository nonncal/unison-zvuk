import { useState } from 'react'
export function Cover({
  theme = 'blue',
  small = false,
  src,
  alt = 'Обложка композиции',
}: {
  theme?: string
  small?: boolean
  src?: string
  alt?: string
}) {
  const [failed, setFailed] = useState('')
  return (
    <div className={`cover cover-${theme} ${small ? 'cover-small' : ''}`}>
      {src && failed !== src ? (
        <img
          className="cover-image"
          src={src}
          alt={alt}
          loading={small ? 'lazy' : 'eager'}
          onError={() => setFailed(src)}
        />
      ) : (
        <div aria-hidden="true">
          <div className="cover-orbit orbit-a" />
          <div className="cover-orbit orbit-b" />
          <div className="cover-orbit orbit-c" />
          <span className="cover-mark">u.</span>
          <span className="cover-line" />
        </div>
      )}
    </div>
  )
}
