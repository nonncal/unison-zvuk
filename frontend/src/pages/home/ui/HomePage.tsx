import './home-page.css'
import { CreateRoomDialog } from '@/features/create-room'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Brand } from '@/shared/ui/Brand'
import { Cover } from '@/shared/ui/Cover'
import { ModeNotice } from '@/shared/ui/ModeNotice'
import { audioEngine } from '@/features/listen-together'
import { ResumeRooms } from '@/features/resume-room'
import { ThemeToggle } from '@/shared/ui/ThemeToggle'
export function Home() {
  const [create, setCreate] = useState(false)
  return (
    <div className="home-page">
      <header className="site-header">
        <Brand />
        <div className="header-actions">
          <a className="text-link" href="#how">
            Как это работает
          </a>
          <ThemeToggle />
        </div>
      </header>
      <ModeNotice />
      <main>
        <section className="home-hero">
          <div className="hero-copy">
            <ResumeRooms />
            <h1>
              Слушайте вместе<span>даже на расстоянии</span>
            </h1>
            <p className="hero-description">
              Создайте комнату и отправьте ссылку. Трек, пауза и перемотка общие, а громкость у
              каждого своя.
            </p>
            <button className="button button-primary hero-cta" onClick={() => setCreate(true)}>
              <Plus size={20} />
              Создать комнату
            </button>
            <p className="cta-caption">Регистрация не нужна. В комнате до 10 человек.</p>
          </div>
          <div className="hero-scene" aria-hidden="true">
            <Cover />
            <div className="scene-track">
              <span>К Элизе</span>
              <small>Людвиг ван Бетховен</small>
            </div>
            <div className="scene-timeline">
              <div />
              <span className="scene-cursor cursor-blue" />
              <span className="scene-cursor cursor-plum" />
            </div>
            <div className="scene-listeners">
              <span className="mini-avatar">К</span>
              <span className="mini-avatar plum">А</span>
              <span>Кирилл и Аня слушают вместе</span>
            </div>
          </div>
        </section>
        <section id="how" className="how-section">
          <div className="section-intro">
            <h2>Как это работает</h2>
          </div>
          <ol className="how-steps">
            <li>
              <h3>Создайте комнату</h3>
              <p>
                Назовите её, выберите число мест — от 2 до 10. Можно впускать только по вашему
                одобрению.
              </p>
            </li>
            <li>
              <h3>Отправьте ссылку</h3>
              <p>
                Друг открывает её в браузере, вводит имя и нажимает «Войти». Приложение ставить не
                нужно.
              </p>
            </li>
            <li>
              <h3>Включите песню</h3>
              <p>Выберите трек из подборки или загрузите свой файл. Звучит у всех одновременно.</p>
            </li>
          </ol>
        </section>
      </main>
      <footer className="site-footer">
        <Brand />
        <span>Слушаем вместе</span>
        <span>Демо-треки созданы командой, лицензия CC0</span>
      </footer>
      {create && (
        <CreateRoomDialog onClose={() => setCreate(false)} onUnlock={() => audioEngine.unlock()} />
      )}
    </div>
  )
}
