import { TrackSuggestions } from '@/features/suggest-track'
import { useState } from 'react'
import { RoomPlayer } from '@/widgets/room-player'
import './room-page.css'
import { useDispatch, useSelector } from 'react-redux'
import { RoomPlaylist } from '@/features/room-playlist'
import { RoomReactions } from '@/features/send-reaction'
import { RoomSwitcher } from '@/features/switch-room'
import { RoomSettings, WaitingRoom, ParticipantActions } from '@/features/manage-room'
import { CreateRoomDialog } from '@/features/create-room'
import { EditCover } from '@/features/edit-cover'
import { SongLyrics } from '@/features/song-lyrics'
import { audioEngine } from '@/features/listen-together'
import { apiOrigin } from '@/shared/config'
import { roomActions, selectRoomState } from '@/entities/room'
import { Link } from 'react-router-dom'
import {
  Check,
  ChevronDown,
  Copy,
  Headphones,
  Link2,
  LoaderCircle,
  LogOut,
  Music2,
  Radio,
  RefreshCw,
  UploadCloud,
  X,
} from 'lucide-react'
import { Brand } from '@/shared/ui/Brand'
import { Cover } from '@/shared/ui/Cover'
import { ThemeToggle } from '@/shared/ui/ThemeToggle'
import { Dialog } from '@/shared/ui/Dialog'
import { ModeNotice } from '@/shared/ui/ModeNotice'
import { Library } from '@/features/select-track'
import { Upload } from '@/features/upload-track'
import { gateway } from '@/entities/room'
import { RoomParticipants } from '@/widgets/room-participants'
import { useRoomPage } from '../model/use-room-page'
export function Room() {
  const [panel, setPanel] = useState<'queue' | 'people'>('queue')
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
    canEdit,
    playerAction,
    react,
    selected,
    host,
    reloadTracks,
    command,
    controlsDisabled,
    unlock,
    openInvite,
    copyInvite,
    rotateInvite,
    leave,
    statusText,
    dismissError,
    toggleMute,
    setVolume,
    retryAudio,
  } = useRoomPage()
  const dispatch = useDispatch(),
    { reactions } = useSelector(selectRoomState)
  const received = (value: NonNullable<typeof snapshot>) => dispatch(roomActions.received(value))
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
          <h1>{error ? 'Комната недоступна' : 'Подключение к комнате'}</h1>
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
          <h1>Комната закрыта.</h1>
          <p className="entry-description">
            Ведущий закрыл её, музыка остановлена. Чтобы послушать ещё, создайте новую комнату.
          </p>
          <Link className="button button-primary" to="/">
            Создать новую комнату
          </Link>
        </main>
      </div>
    )
  return (
    <div className={`room-page room-panel-${panel}`}>
      <header className="site-header room-header">
        <Brand />
        <button
          className="room-title room-switch-trigger"
          aria-label="Сменить комнату"
          onClick={() => setDialog('rooms')}
        >
          <span className="little-dot" />
          <span>{snapshot.room.title}</span>
          <ChevronDown size={15} />
        </button>
        <div className="header-actions">
          <ThemeToggle />
          {isHost && (
            <button
              className="button button-secondary invite-button"
              aria-label="Пригласить друга"
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
        <h1 className="visually-hidden">{snapshot.room.title}</h1>
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
        <div className="room-panel-tabs" aria-label="Раздел комнаты">
          <button aria-pressed={panel === 'queue'} onClick={() => setPanel('queue')}>
            Очередь
          </button>
          <button aria-pressed={panel === 'people'} onClick={() => setPanel('people')}>
            Участники ({snapshot.participants.length})
          </button>
        </div>
        <div className="room-layout">
          <section className="listening-area" aria-label="Общий плеер">
            <div className="music-stage">
              <div className={`album-wrap ${displayStatus === 'playing' ? 'is-playing' : ''}`}>
                <Cover
                  theme={selected?.cover}
                  src={
                    selected?.coverUrl
                      ? `${apiOrigin}/api/v1/rooms/${roomId}/${selected.coverUrl}`
                      : undefined
                  }
                  alt={`Обложка: ${selected?.title ?? 'композиция'}`}
                />
              </div>
              <div className="now-playing">
                {selected ? (
                  <>
                    <h2>{selected.title}</h2>
                    <p>{selected.artist || 'Исполнитель не указан'}</p>
                  </>
                ) : (
                  <>
                    <h2>Выберите первую песню</h2>
                    <p>
                      {canEdit
                        ? 'Откройте подборку или загрузите свой файл — музыка зазвучит у всех сразу.'
                        : `${host?.displayName ?? 'Ведущий'} ещё не выбрал песню. Когда он это сделает, она появится здесь.`}
                    </p>
                  </>
                )}
              </div>
            </div>
            {canEdit && selected?.source === 'upload' && gateway.mode === 'api' && (
              <EditCover roomId={roomId} trackId={selected.id} onDone={reloadTracks} />
            )}
            <RoomPlayer
              snapshot={snapshot}
              audio={audio}
              selected={selected}
              previewSeek={previewSeek}
              setPreviewSeek={setPreviewSeek}
              position={position}
              controlsDisabled={controlsDisabled}
              command={command}
              displayStatus={displayStatus}
              busy={busy}
              unlock={unlock}
              canEdit={canEdit}
              host={host}
              playerAction={playerAction}
              statusText={statusText}
              toggleMute={toggleMute}
              setVolume={setVolume}
              retryAudio={retryAudio}
              allowNotReady={allowNotReady}
              setAllowNotReady={setAllowNotReady}
            />
            {gateway.mode === 'api' && (
              <SongLyrics
                roomId={roomId}
                track={selected}
                positionMs={position}
                canEdit={canEdit}
                onSeek={
                  canEdit && !controlsDisabled
                    ? (ms) => void command({ type: 'playback.seek', payload: { positionMs: ms } })
                    : undefined
                }
                onChanged={reloadTracks}
              />
            )}
            {canEdit && (
              <div className="source-actions">
                <button
                  className={`button ${selected ? 'button-secondary' : 'button-primary'}`}
                  disabled={controlsDisabled}
                  onClick={() => setDialog('library')}
                >
                  <Music2 size={18} />
                  Открыть подборку
                </button>
                <button
                  className="button button-secondary"
                  disabled={controlsDisabled}
                  onClick={() => setDialog('upload')}
                >
                  <UploadCloud size={18} />
                  Загрузить файл
                </button>
              </div>
            )}

            {gateway.mode === 'api' && (
              <RoomReactions
                reactions={reactions}
                participants={snapshot.participants}
                disabled={connection !== 'connected'}
                onReact={react}
              />
            )}
          </section>
          <div className="room-side">
            {gateway.mode === 'api' && (
              <div className="side-queue">
                <RoomPlaylist
                  snapshot={snapshot}
                  tracks={tracks}
                  canEdit={canEdit}
                  busy={busy || controlsDisabled}
                  onAction={(payload) => void playerAction(payload)}
                  onSelect={(track) =>
                    void command({ type: 'playback.select', payload: { trackId: track.id } })
                  }
                />
                <TrackSuggestions
                  snapshot={snapshot}
                  tracks={tracks}
                  isHost={isHost}
                  disabled={connection !== 'connected'}
                  onSnapshot={received}
                />
              </div>
            )}
            <RoomParticipants
              snapshot={snapshot}
              participantId={participantId}
              isHost={isHost}
              onInvite={() => void openInvite()}
              onClose={() => setDialog('close')}
              renderActions={
                gateway.mode === 'api'
                  ? (p) => (
                      <ParticipantActions
                        roomId={roomId}
                        id={p.id}
                        name={p.displayName}
                        canEdit={p.canEdit ?? false}
                        onSnapshot={received}
                      />
                    )
                  : undefined
              }
              extra={
                isHost && gateway.mode === 'api' ? (
                  <>
                    <button className="text-link" onClick={() => setDialog('settings')}>
                      Настройки комнаты
                    </button>
                    {snapshot.room.moderated && <WaitingRoom roomId={roomId} />}
                  </>
                ) : null
              }
            />
          </div>
        </div>

        {isHost && (
          <button className="text-link mobile-close-room" onClick={() => setDialog('close')}>
            Закрыть комнату для всех
          </button>
        )}
      </main>
      {dialog === 'rooms' && (
        <RoomSwitcher
          currentId={roomId}
          onClose={() => setDialog(null)}
          onCreate={() => setDialog('create')}
        />
      )}
      {dialog === 'create' && (
        <CreateRoomDialog onClose={() => setDialog(null)} onUnlock={() => audioEngine.unlock()} />
      )}
      {dialog === 'settings' && isHost && (
        <RoomSettings snapshot={snapshot} onClose={() => setDialog(null)} onSnapshot={received} />
      )}
      {dialog === 'library' && (
        <Dialog title="Подборка" wide onClose={() => setDialog(null)}>
          <Library
            tracks={tracks}
            roomId={roomId}
            onAdd={
              gateway.mode === 'api'
                ? (track) => void playerAction({ action: 'add', trackId: track.id })
                : undefined
            }
            selected={snapshot.playback.trackId}
            busy={busy}
            onSelect={(track) => {
              void command({ type: 'playback.select', payload: { trackId: track.id } })
            }}
          />
          {gateway.mode === 'demo' && (
            <p className="field-hint">Шесть известных произведений классики в свободных записях.</p>
          )}
        </Dialog>
      )}
      {dialog === 'upload' && (
        <Dialog title="Загрузить свою песню" onClose={() => setDialog(null)}>
          <Upload roomId={roomId} onDone={reloadTracks} />
        </Dialog>
      )}
      {dialog === 'rotate' && (
        <Dialog title="Заменить приглашение?" onClose={() => setDialog(null)}>
          <p className="dialog-description">
            Старая ссылка перестанет впускать новых гостей. Текущие участники останутся. Заявки в
            зале ожидания будут отменены.
          </p>
          <button
            className="button button-danger full-width"
            disabled={busy}
            onClick={() => void rotateInvite()}
          >
            Заменить ссылку
          </button>
        </Dialog>
      )}
      {dialog === 'invite' && (
        <Dialog title="Пригласить в комнату" onClose={() => setDialog(null)}>
          <p className="dialog-description">
            Отправьте ссылку — человек откроет её в браузере и войдёт в комнату.
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
          {isHost && gateway.mode === 'api' && (
            <button className="text-link" onClick={() => setDialog('rotate')}>
              Сменить ссылку-приглашение
            </button>
          )}
          <p className="field-hint">
            {gateway.mode === 'demo'
              ? 'Откройте ссылку в новом окне того же браузера. Между устройствами демокомнаты не работают.'
              : snapshot.room.moderated
                ? `Мест: ${snapshot.room.capacity}. Каждого гостя нужно будет впустить вручную.`
                : `Мест: ${snapshot.room.capacity}. Регистрация гостям не нужна.`}
          </p>
        </Dialog>
      )}
      {dialog === 'close' && (
        <Dialog title="Закрыть комнату для всех?" onClose={() => setDialog(null)}>
          <p className="dialog-description">
            Музыка остановится у всех, а ссылка-приглашение перестанет работать.
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
