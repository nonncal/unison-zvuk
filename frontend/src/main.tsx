import '@fontsource-variable/onest/wght.css'
import '@fontsource-variable/unbounded/wght.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './app/styles/index.css'
import App from './app/routes/AppRouter'
import { store } from './app/store'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)

// Installable shell only; the worker never caches API, WebSocket or audio traffic.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').catch(() => undefined)
  })
}
