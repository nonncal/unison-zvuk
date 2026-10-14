import { lazy, Suspense } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
const Home = lazy(() => import('@/pages/home').then((module) => ({ default: module.Home })))
const Join = lazy(() => import('@/pages/join').then((module) => ({ default: module.Join })))
const Room = lazy(() => import('@/pages/room').then((module) => ({ default: module.Room })))
import { Brand } from '@/shared/ui/Brand'
export default function App() {
  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-link">
        К основному содержимому
      </a>
      <div id="main-content" tabIndex={-1}>
        <Suspense
          fallback={
            <p className="entry-main" role="status">
              Открываем ваш момент…
            </p>
          }
        >
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
        </Suspense>
      </div>
    </BrowserRouter>
  )
}
