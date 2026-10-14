import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Copy,
  Headphones,
  Link2,
  LoaderCircle,
  LogOut,
  Music2,
  Pause,
  Play,
  Radio,
  RefreshCw,
  UploadCloud,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { Brand } from '@/shared/ui/Brand'
import { Cover } from '@/shared/ui/Cover'
import { Dialog } from '@/shared/ui/Dialog'
import { ModeNotice } from '@/shared/ui/ModeNotice'
import { Library } from '@/features/select-track'
import { Upload } from '@/features/upload-track'
import { gateway } from '@/entities/room'
import { RoomParticipants } from '@/widgets/room-participants'
import { formatTime } from '@/shared/lib/time'
import { useRoomPage } from '../model/use-room-page'
export function Room() {
  const {
    roomId,
    snapshot,
    participantId,
    connection,
    error,
    audio,
    tracks,
    dialog,
    setDialog,
    busy,
    invite,
    copied,
    inviteError,
    previewSeek,
    setPreviewSeek,
    allowNotReady,
    setAllowNotReady,
    setRetry,
    position,
    displayStatus,
    isHost,
    selected,
    host,
    reloadTracks,
    command,
    controlsDisabled,
    unlock,
    openInvite,
    copyInvite,
    leave,
    statusText,
    dismissError,
    toggleMute,
    setVolume,
    retryAudio,
  } = useRoomPage()
  if (!snapshot || snapshot.room.id !== roomId)
    return (
      <div className="entry-page">
        <header className="site-header">
          <Brand />
        </header>
        <main className="entry-main">
          <div className="entry-icon">
            {error ? <Radio size={30} /> : <LoaderCircle className="spin" size={30} />}
          </div>
          <h1>{error ? 'Комната недоступна' : 'Ваш момент уже близко'}</h1>
          <p className="entry-description" role={error ? 'alert' : 'status'}>
            {error || 'Подключаемся к комнате…'}
          </p>
          {error && (
            <div className="button-row">
              <button
                className="button button-secondary"
                onClick={() => setRetry((value) => value + 1)}
              >
                Попробовать снова
              </button>
              <Link className="button button-primary" to="/">
                На главную
              </Link>
            </div>
          )}
        </main>
      </div>
    )
  if (snapshot.room.status !== 'active')
    return (
      <div className="entry-page">
        <header className="site-header">
          <Brand />
        </header>
        <main className="entry-main">
          <div className="entry-icon">
            <Headphones size={32} />
          </div>
          <h1>Этот момент завершён.</h1>
          <p className="entry-description">
            Музыка остановилась. Следующая встреча
            <br />
            может начаться с новой комнаты.
          </p>
          <Link className="button button-primary" to="/">
            Создать новую комнату
          </Link>
        </main>
      </div>
    )
  return (
    <div className="room-page">
      <header className="site-header room-header">
        <Brand />
        <div className="room-title">
          <span className="little-dot" />
          <span>{snapshot.room.title}</span>
          <ChevronDown size={15} />
        </div>
        <div className="header-actions">
          {isHost && (
            <button
              className="button button-secondary invite-button"
              onClick={() => {
                void openInvite()
              }}
            >
              <Link2 size={17} />
              <span>Пригласить друга</span>
            </button>
          )}
          <button
            className="icon-button"
            aria-label="Выйти из комнаты"
            disabled={busy}
            onClick={() => {
              void leave()
            }}
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>
      <ModeNotice />
      <main className="room-main">
        <div className="room-intro">
          <span className="soft-label">Ваша музыкальная комната</span>
          <h1>Хорошо, когда вместе.</h1>
        </div>
        {error && (
          <div className="inline-banner error-banner" role="alert">
            <span>{error}</span>
            <button
              className="icon-button"
              aria-label="Закрыть уведомление"
              onClick={() => dismissError()}
            >
              <X size={18} />
            </button>
          </div>
        )}
        {connection !== 'connected' && (
          <div className="inline-banner" role="status">
            <RefreshCw size={17} />
            <span>
              {connection === 'closed'
                ? 'Соединение завершено'
                : 'Восстанавливаем соединение. Общий плеер пока недоступен.'}
            </span>
            <button className="text-link" onClick={() => setRetry((value) => value + 1)}>
              Подключиться снова
            </button>
          </div>
        )}
        <div className="room-layout">
          <section className="listening-area" aria-label="Общий плеер">
            <div className="music-stage">
              <div className={`album-wrap ${displayStatus === 'playing' ? 'is-playing' : ''}`}>
                <Cover theme={selected?.cover} />
                <span className="album-tag">
                  <Headphones size={14} />
                  {selected ? 'Сейчас в вашей комнате' : 'Здесь будет ваша музыка'}
                </span>
              </div>
              <div className="now-playing">
                {selected ? (
                  <>
                    <p className="soft-label">Сейчас звучит</p>
                    <h2>{selected.title}</h2>
                    <p>{selected.artist}</p>
                  </>
                ) : (
                  <>
                    <p className="soft-label">Первый трек — за вами</p>
                    <h2>
                      Выберите вашу
                      <br />
                      композицию.
                    </h2>
                    <p>
                      {isHost
                        ? 'Настроение начинается с одной песни.'
                        : 'Ведущий скоро выберет первую песню.'}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="player">
              <div className="player-status" aria-live="polite">
                <span
                  className={`little-dot ${displayStatus === 'playing' ? 'dot-playing' : ''}`}
                />
                {statusText}
                <span className="player-status-right">
                  {snapshot.participants.length}/2 в комнате
                </span>
              </div>
              <div className="seek-wrap">
                <input
                  type="range"
                  aria-label="Общая позиция композиции"
                  min={0}
                  max={snapshot.playback.durationMs || 1}
                  step={100}
                  value={previewSeek ?? position}
                  disabled={controlsDisabled || !selected}
                  onChange={(event) => setPreviewSeek(Number(event.target.value))}
                  onPointerUp={(event) => {
                    if (!controlsDisabled)
                      void command({
                        type: 'playback.seek',
                        payload: { positionMs: Number(event.currentTarget.value) },
                      })
                    setPreviewSeek(null)
                  }}
                  onKeyUp={(event) => {
                    if (
                      ['ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(
                        event.key,
                      )
                    ) {
                      void command({
                        type: 'playback.seek',
                        payload: { positionMs: Number(event.currentTarget.value) },
                      })
                      setPreviewSeek(null)
                    }
                  }}
                  style={
                    {
                      '--progress': `${((previewSeek ?? position) / (snapshot.playback.durationMs || 1)) * 100}%`,
                    } as React.CSSProperties
                  }
                />
                <div className="seek-times">
                  <span>{formatTime(previewSeek ?? position)}</span>
                  <span>{formatTime(snapshot.playback.durationMs)}</span>
                </div>
              </div>
              <div className="player-controls">
                <div className="volume-control">
                  <button
                    className="icon-button"
                    aria-label={audio.muted ? 'Включить звук у меня' : 'Выключить звук у меня'}
                    onClick={() => toggleMute()}
                  >
                    {audio.muted || audio.volume === 0 ? (
                      <VolumeX size={20} />
                    ) : (
                      <Volume2 size={20} />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={audio.muted ? 0 : audio.volume}
                    aria-label="Моя громкость"
                    onChange={(event) => setVolume(Number(event.target.value))}
                  />
                </div>
                <button
                  className="play-button"
                  disabled={controlsDisabled || !selected || audio.state === 'loading'}
                  aria-label={
                    displayStatus === 'playing' ? 'Пауза для всех' : 'Воспроизвести для всех'
                  }
                  onClick={() => {
                    void unlock()
                    void command(
                      displayStatus === 'playing'
                        ? { type: 'playback.pause', payload: {} }
                        : { type: 'playback.play', payload: { allowNotReady: false } },
                    )
                  }}
                >
                  {busy ? (
                    <LoaderCircle size={26} className="spin" />
                  ) : displayStatus === 'playing' ? (
                    <Pause size={25} fill="currentColor" />
                  ) : (
                    <Play size={25} fill="currentColor" />
                  )}
                </button>
                <span className="control-caption">
                  {isHost ? 'Общий плеер' : `Управляет ${host?.displayName ?? 'ведущий'}`}
                </span>
              </div>
              {audio.state === 'locked' && selected && (
                <button
                  className="button button-secondary unlock-button"
                  onClick={() => {
                    void unlock()
                  }}
                >
                  <Headphones size={18} />
                  Включить звук
                </button>
              )}
              {audio.state === 'error' && (
                <p className="error-message" role="alert">
                  Не удалось загрузить аудио.{' '}
                  <button
                    className="text-link"
                    onClick={() => {
                      retryAudio()
                    }}
                  >
                    Попробовать снова
                  </button>
                </p>
              )}
              {allowNotReady && (
                <div className="readiness-decision">
                  <p>Друг ещё не готов к воспроизведению.</p>
                  <div className="button-row">
                    <button
                      className="button button-secondary"
                      onClick={() => setAllowNotReady(false)}
                    >
                      Подождать
                    </button>
                    <button
                      className="button button-primary"
                      onClick={() => {
                        void command({ type: 'playback.play', payload: { allowNotReady: true } })
                      }}
                    >
                      Начать без ожидания
                    </button>
                  </div>
                </div>
              )}
            </div>
            {isHost && (
              <div className="source-actions">
                <button
                  className="button button-secondary"
                  disabled={controlsDisabled}
                  onClick={() => setDialog('library')}
                >
                  <Music2 size={18} />
                  Открыть подборку
                </button>
                <button
                  className="text-link"
                  disabled={controlsDisabled}
                  onClick={() => setDialog('upload')}
                >
                  <UploadCloud size={18} />
                  Загрузить файл
                </button>
              </div>
            )}
            <p className="player-footnote">Одна композиция для всех. Громкость — только ваша.</p>
          </section>
          <RoomParticipants
            snapshot={snapshot}
            participantId={participantId}
            isHost={isHost}
            onInvite={() => void openInvite()}
            onClose={() => setDialog('close')}
          />
        </div>
        <Link to="/" className="back-link">
          <ArrowLeft size={15} />
          Главная
        </Link>
        {isHost && (
          <button className="text-link mobile-close-room" onClick={() => setDialog('close')}>
            Закрыть комнату для всех
          </button>
        )}
      </main>
      <footer className="room-footer">
        <span>unison. Звучать вместе.</span>
        <span>Пусть этот момент будет вашим.</span>
      </footer>
      {dialog === 'library' && (
        <Dialog title="Ваша подборка" wide onClose={() => setDialog(null)}>
          <Library
            tracks={tracks}
            selected={snapshot.playback.trackId}
            busy={busy}
            onSelect={(track) => {
              void command({ type: 'playback.select', payload: { trackId: track.id } })
            }}
          />
          {gateway.mode === 'demo' && (
            <p className="field-hint">
              Шесть оригинальных инструментальных фрагментов по 24 секунды, созданных для проверки
              плеера.
            </p>
          )}
        </Dialog>
      )}
      {dialog === 'upload' && (
        <Dialog title="Своя композиция" onClose={() => setDialog(null)}>
          <Upload roomId={roomId} onDone={reloadTracks} />
        </Dialog>
      )}
      {dialog === 'invite' && (
        <Dialog title="Пусть друг будет рядом" onClose={() => setDialog(null)}>
          <p className="dialog-description">
            Отправьте ссылку человеку, с которым хотите разделить этот момент.
          </p>
          <label className="field">
            Ссылка на комнату
            <input
              readOnly
              value={invite}
              aria-label="Ссылка-приглашение"
              onFocus={(event) => event.target.select()}
            />
          </label>
          <button
            className="button button-primary full-width"
            disabled={!invite}
            onClick={() => {
              void copyInvite()
            }}
          >
            {copied ? <Check size={19} /> : <Copy size={19} />}{' '}
            {copied ? 'Ссылка скопирована' : 'Копировать ссылку'}
          </button>
          {inviteError && (
            <p className="error-message" role="alert">
              {inviteError}
            </p>
          )}
          <p className="field-hint">
            {gateway.mode === 'demo'
              ? 'Откройте ссылку в новом окне того же браузера. Между устройствами демокомнаты не работают.'
              : 'Войти сможет один слушатель. Регистрация не нужна.'}
          </p>
        </Dialog>
      )}
      {dialog === 'close' && (
        <Dialog title="Завершить ваш момент?" onClose={() => setDialog(null)}>
          <p className="dialog-description">
            Музыка остановится у обоих. Эта ссылка больше не позволит войти в комнату.
          </p>
          <div className="button-row">
            <button className="button button-secondary" onClick={() => setDialog(null)}>
              Продолжить слушать
            </button>
            <button
              className="button button-danger"
              disabled={busy}
              onClick={() => {
                void leave(true)
              }}
            >
              Закрыть для всех
            </button>
          </div>
        </Dialog>
      )}
    </div>
  )
}
