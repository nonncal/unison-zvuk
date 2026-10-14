import { Link } from 'react-router-dom'
export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Unison — на главную">
      <svg width="31" height="32" viewBox="0 0 31 32" fill="none" aria-hidden="true">
        <path
          d="M5 8v9a6 6 0 0012 0V8"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M14 8v9a6 6 0 0012 0V8"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <span>
        unison<span className="brand-dot">.</span>
      </span>
    </Link>
  )
}
