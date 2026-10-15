import '@fontsource/pt-sans/cyrillic-400.css'
import '@fontsource/pt-sans/cyrillic-700.css'
import '@fontsource/pt-sans/latin-400.css'
import '@fontsource/pt-sans/latin-700.css'
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
