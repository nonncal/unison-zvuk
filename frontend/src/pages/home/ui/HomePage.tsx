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
        <span className="header-note">Музыка становится ближе</span>
        <a className="text-link" href="#how">
          Как это работает <ArrowUpRight size={16} />
        </a>
      </header>
      <ModeNotice />
      <main>
        <section className="home-hero">
          <div className="hero-copy">
            <div className="soft-label">
              <span className="little-dot" /> Когда вы на одной волне
            </div>
            <h1>
              Одна песня.
              <br />
              Один момент.
            </h1>
            <p className="hero-description">
              Между вами могут быть города.
              <br />
              Пусть музыка звучит вместе.
            </p>
            <button className="button button-primary hero-cta" onClick={() => setCreate(true)}>
              <Plus size={20} />
              Создать комнату
            </button>
            <p className="cta-caption">По ссылке. Без регистрации. До 10 человек.</p>
          </div>
          <div className="hero-scene">
            <div className="scene-note">
              <Headphones size={16} /> Сейчас звучит для двоих
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
                <strong>Ваш общий момент.</strong>
              </span>
            </div>
            <span className="scene-caption">Расстояние не имеет значения</span>
          </div>
        </section>
        <section id="how" className="how-section">
          <div className="section-intro">
            <span>Просто быть рядом</span>
            <h2>От ссылки до первой ноты</h2>
          </div>
          <div className="how-steps">
            <article>
              <span className="how-icon">
                <Link2 size={23} />
              </span>
              <h3>Пригласи своего человека</h3>
              <p>Создай комнату и отправь другу ссылку. Всё начинается с одного приглашения.</p>
            </article>
            <article>
              <span className="how-icon">
                <Music2 size={23} />
              </span>
              <h3>Выбери, что звучит</h3>
              <p>Открой подборку или загрузи свою композицию. Настроение выбираете вы.</p>
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
        <span>Создано для ваших моментов</span>
      </footer>
      {create && (
        <CreateRoomDialog onClose={() => setCreate(false)} onUnlock={() => audioEngine.unlock()} />
      )}
    </div>
  )
}
