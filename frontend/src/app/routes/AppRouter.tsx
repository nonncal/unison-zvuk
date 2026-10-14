import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { Home } from '@/pages/home'
import { Join } from '@/pages/join'
import { Room } from '@/pages/room'
import { Brand } from '@/shared/ui/Brand'
export default function App() {
  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-link">
        К основному содержимому
      </a>
      <div id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/join/:roomId" element={<Join />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route
            path="*"
            element={
              <div className="entry-page">
                <header className="site-header">
                  <Brand />
                </header>
                <main className="entry-main">
                  <h1>Здесь пока тихо.</h1>
                  <p className="entry-description">
                    Эта страница не существует.
                    <br />
                    Начните свой момент с главной.
                  </p>
                  <Link to="/" className="button button-primary">
                    На главную
                  </Link>
                </main>
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
