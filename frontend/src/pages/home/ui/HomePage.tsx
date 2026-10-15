import './home-page.css'
import { CreateRoomDialog } from '@/features/create-room'
import { useState } from 'react'
import { ArrowUpRight, Headphones, Link2, Music2, Plus } from 'lucide-react'
import { Brand } from '@/shared/ui/Brand'
import { Cover } from '@/shared/ui/Cover'
import { ModeNotice } from '@/shared/ui/ModeNotice'
import { audioEngine } from '@/features/listen-together'
export function Home() {
  const [create, setCreate] = useState(false)
  return (
    <div className="home-page">
      <header className="site-header">
        <Brand />
        <span className="header-note">Музыкальные комнаты</span>
        <a className="text-link" href="#how">
          Как это работает <ArrowUpRight size={16} />
        </a>
      </header>
      <ModeNotice />
      <main>
        <section className="home-hero">
          <div className="hero-copy">
            <h1>
              Слушай.
              <br />
              Делись. Вместе.
            </h1>
            <p className="hero-description">
              Соберите друзей в одной музыкальной комнате.
              <br />
              Выбирайте треки и слушайте одновременно.
            </p>
            <button className="button button-primary hero-cta" onClick={() => setCreate(true)}>
              <Plus size={20} />
              Создать комнату
            </button>
            <p className="cta-caption">По ссылке. Без регистрации. До 10 человек.</p>
          </div>
          <div className="hero-scene">
            <div className="scene-note">
              <Headphones size={16} /> Ваша следующая встреча
            </div>
            <Cover />
            <div className="scene-track">
              <span>После дождя</span>
              <small>Тихий берег</small>
            </div>
            <div className="scene-timeline">
              <div />
              <span className="scene-cursor cursor-blue" />
              <span className="scene-cursor cursor-plum" />
            </div>
            <div className="scene-listeners">
              <span className="mini-avatar">К</span>
              <span className="mini-avatar plum">А</span>
              <span>
                Один трек.
                <br />
                <strong>Два слушателя.</strong>
              </span>
            </div>
            <span className="scene-caption">Общая очередь, пауза и перемотка</span>
          </div>
        </section>
        <section id="how" className="how-section">
          <div className="section-intro">
            <h2>Три шага — и вы слушаете вместе</h2>
          </div>
          <div className="how-steps">
            <article>
              <span className="how-icon">
                <Link2 size={23} />
              </span>
              <h3>Пригласи друзей</h3>
              <p>Создай комнату на 2–10 человек. Отправь ссылку или включи вход с одобрением.</p>
            </article>
            <article>
              <span className="how-icon">
                <Music2 size={23} />
              </span>
              <h3>Выбери, что звучит</h3>
              <p>Добавь музыку из подборки или загрузи файл. Выдай друзьям права менять очередь.</p>
            </article>
            <article>
              <span className="how-icon">
                <Headphones size={23} />
              </span>
              <h3>Слушайте в один момент</h3>
              <p>Один плеер, общая пауза и перемотка. Громкость каждый оставляет своей.</p>
            </article>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <Brand />
        <span>Звучать вместе. Даже на расстоянии.</span>
        <span>Unison / Слушаем вместе</span>
      </footer>
      {create && (
        <CreateRoomDialog onClose={() => setCreate(false)} onUnlock={() => audioEngine.unlock()} />
      )}
    </div>
  )
}
