# Контракт HTTP и WebSocket

Версия протокола v1. Это спецификация для реализации, не описание существующего API. JSON UTF-8, camelCase на проводе, UUID как строки, timestamp UTC Unix milliseconds. Длительность/позиция — integer milliseconds. Python-модели используют aliases. HTTP OpenAPI генерируется FastAPI; WS-схемы Pydantic экспортируются в JSON Schema и типы TypeScript в CI. Успешные ответы не содержат приватные поля и хеши токенов.

## HTTP

Origin один: SPA `/`, API `/api/v1`, WS `/ws/v1`. Все меняющие запросы требуют Origin allowlist, session cookie (кроме первичного создания) и CSRF token из bootstrap. Cookie `HttpOnly; Secure; SameSite=Lax`, Path=/, 24 ч; HTTPS обязателен вне localhost. Создание и загрузки поддерживают `Idempotency-Key` UUID, TTL 10 мин; повтор с иным payload возвращает 409.

| Метод и путь                                              | Тело / результат                                                                              | Доступ                                                                             |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| GET /api/v1/bootstrap                                     | csrfToken, protocolVersion, limits                                                            | публичный, не раскрывает комнаты                                                   |
| POST /api/v1/rooms                                        | {displayName,title?} → 201 {roomId,participantId,inviteUrl,expiresAt,snapshot}; ставит cookie | новый ведущий                                                                      |
| POST /api/v1/invites/preview                              | {inviteToken} → {roomId,title,status,participantCount,capacity,expiresAt}                     | ограниченный preview без имён/URL аудио                                            |
| POST /api/v1/rooms/{roomId}/join                          | {inviteToken,displayName} → {participantId,role,snapshot}; создаёт/использует cookie          | валидный invite, slot под lock                                                     |
| GET /api/v1/rooms/{roomId}                                | snapshot без invitation secret                                                                | только участник                                                                    |
| GET /api/v1/rooms/{roomId}/invite                         | {inviteUrl,expiresAt}                                                                         | ведущий; хранение plaintext secret сервером шифрованным для повторного копирования |
| POST /api/v1/rooms/{roomId}/leave                         | {} → 204; invalidate участие, явный host transfer                                             | участник                                                                           |
| POST /api/v1/rooms/{roomId}/close                         | {expectedPlaybackRevision} → final snapshot                                                   | ведущий                                                                            |
| GET /api/v1/tracks?query=&cursor=&limit=20                | {items:[id,title,artist,durationMs,coverUrl?],nextCursor}                                     | session; только catalogue ready                                                    |
| GET /api/v1/rooms/{roomId}/tracks                         | доступные catalog + room tracks, статусы                                                      | участник                                                                           |
| POST /api/v1/rooms/{roomId}/uploads                       | {fileName,contentType,sizeBytes} → 201 {uploadId,uploadUrl,requiredHeaders,expiresAt}         | ведущий, quota                                                                     |
| PUT signed uploadUrl                                      | binary file, expected content type/length/checksum если поддержано storage                    | временное право на один object                                                     |
| POST /api/v1/rooms/{roomId}/uploads/{uploadId}/complete   | {checksum?} → 202 {trackId,status:"processing"}; повтор тот же                                | владелец upload и ведущий                                                          |
| GET /api/v1/rooms/{roomId}/tracks/{trackId}               | {id,title,artist,durationMs,status,errorCode?,mediaVersion?}                                  | участник; retry статуса                                                            |
| POST /api/v1/rooms/{roomId}/tracks/{trackId}/playback-url | {} → {url,expiresAt,mediaVersion,checksum,contentType}                                        | ready, разрешённая область track                                                   |
| GET /health/live                                          | 200, API process alive                                                                        | probe                                                                              |
| GET /health/ready                                         | 200 когда доступны DB/storage/queue, иначе 503                                                | probe; без секретов                                                                |

Invite URL: `${APP_ORIGIN}/join/{roomId}#invite={randomToken}`; 32 random bytes base64url. Fragment не передаётся в обычный HTTP GET. Клиент читает token, сохраняет только в памяти до join и после успешного входа заменяет URL на `/room/{roomId}`. Referrer-Policy: no-referrer, no third-party scripts на join. В БД tokenHash для проверки + шифрованный secret для восстановления ссылки ведущим; ключ шифрования только у сервера. Публичный roomId сам по себе не разрешает вход или чтение.

Ошибка HTTP: `{error:{code,message,requestId,details?}}`; детали не содержат токены, stack trace, storage keys. 400 bad request, 401 expired session, 403 forbidden, 404 not found, 409 conflict/full/pending, 410 closed/expired, 413 file too large, 415 unsupported media, 422 validation, 429 rate limited (`Retry-After`), 503 unavailable. Неверное приглашение: единая INVITE_INVALID без сведений о существовании комнаты.

## WS handshake и конверты

WS `/ws/v1/rooms/{roomId}` с session cookie. Проверить Origin, session и участие до accept; никаких длинноживущих bearer tokens в URL. После подключения сервер присылает hello с connectionId, epoch, protocolVersion и snapshot. Неверная версия: protocol_error + close 1002; нет прав: 1008; replacement: private close 4001; slow client: 4008; закрытая комната: room.closed + 4004.

Команда:

```json
{
  "v": 1,
  "type": "playback.seek",
  "requestId": "uuid",
  "expectedPlaybackRevision": 12,
  "payload": { "positionMs": 65000 }
}
```

Серверное событие:

```json
{
  "v": 1,
  "type": "playback.state",
  "eventId": "uuid",
  "serverTimeMs": 1790000000000,
  "playbackRevision": 13,
  "payload": {
    "roomId": "uuid",
    "epoch": "uuid",
    "trackId": "uuid",
    "mediaVersion": "asset-v1",
    "status": "playing",
    "positionMs": 42000,
    "anchorServerTimeMs": 1789999980000,
    "durationMs": 215000,
    "pendingTransition": {
      "type": "seek",
      "nextStatus": "playing",
      "positionMs": 65000,
      "effectiveAtServerTimeMs": 1790000000750
    }
  }
}
```

Это пример формата, timestamp не привязан к текущему дню. Поля committed timeline описывают прежнее воспроизведение до effectiveAt. `pendingTransition=null` после применения. Авторитетные данные — только серверные; клиент не передаёт roomId/role/actorId как основание права.

## Команды клиента

| type                          | payload                                                      | expectedPlaybackRevision / права                   |
| ----------------------------- | ------------------------------------------------------------ | -------------------------------------------------- |
| clock.probe                   | {clientSentAtMs,probeId}                                     | null / участник                                    |
| heartbeat.pong                | {pingId}                                                     | null / участник                                    |
| room.snapshot.request         | {}                                                           | null / участник                                    |
| participant.readiness         | {trackId,mediaVersion,state,bufferedAheadMs,autoplayAllowed} | null / свой участник                               |
| playback.select               | {trackId}                                                    | integer / ведущий                                  |
| playback.play                 | {allowNotReady:false}                                        | integer / ведущий; true только после явного выбора |
| playback.pause                | {}                                                           | integer / ведущий                                  |
| playback.seek                 | {positionMs}                                                 | integer / ведущий; 0≤position≤duration             |
| sync.telemetry                | {trackId,mediaVersion,driftMs,rttMs,localState}              | null / свой; ≤1/5 с                                |
| reaction.send (P1)            | {emoji}                                                      | null / участник, allowlist                         |
| queue.add/remove/reorder (P1) | {trackId} / {itemId} / {itemIds,expectedQueueRevision}       | отдельная queueRevision / правила из backlog       |

Readiness.state: loading/ready/buffering/autoplayBlocked/error. Обновление rate limit 2/с с burst 5; передавать лишь изменение или существенную разницу буфера. Общие команды 5/с с burst 10; минимальный interval seek 200 мс, клиент отправляет после отпускания ползунка. Не принимать ready на старый mediaVersion. Max WS JSON 16 KiB, запрет неизвестных полей, конечные числа, не отрицательные позиции.

## События сервера

hello `{connectionId,epoch,protocolVersion,snapshot}`; room.snapshot `{room,participants,playback,presenceSeq}`; clock.reply `{probeId,clientSentAtMs,serverReceivedAtMs,serverSentAtMs}`; heartbeat.ping `{pingId}`; presence.changed `{presenceSeq,participants}`; host.changed `{participantId}`; playback.state `{playback}`; track.updated `{track}`; room.closed `{reason}`; command.ack `{requestId,acceptedPlaybackRevision,effectiveAtServerTimeMs?}`; command.error `{requestId,code,message,snapshot?}`. Реакции P1: reaction.created, очередь: queue.state с queueRevision. Track events/presence имеют собственную идентификацию, не создают фальшивый playback conflict.

Room snapshot: id,title,status,capacity,expiresAt,hostParticipantId; participants: id,displayName,role,connectionState,readiness; playback — committed + pending. Секрет invite, cookie, objectKey и полные telemetry других клиентов не входят в snapshot.

## Ошибки и delivery

FORBIDDEN, ROOM_CLOSED, ROOM_EXPIRED, ROOM_FULL, TRACK_NOT_READY, TRACK_NOT_FOUND, INVALID_POSITION, NOT_ALL_READY, PENDING_TRANSITION, CONFLICT, DUPLICATE_REQUEST_MISMATCH, RATE_LIMITED, PROTOCOL_MISMATCH, INTERNAL_ERROR. Обработку каждой реализовать в UI; INTERNAL_ERROR — повторная ручная попытка с requestId для поддержки, без раскрытия stack trace.

ACK означает commit принятого intent, а не одновременный физический звук всех устройств. Client хранит current revision и epoch; отбрасывает меньшее revision, одинаковое допускает обновление serverTime/promotion pending→committed, большее на >1 вызывает запрос snapshot. Snapshot от текущего соединения заменяет состояние целиком, но не громкость пользователя. При смене epoch сбрасываются clock offset и scheduled tasks. Старая connectionGeneration не может изменить presence или получить роль. При reconnect команды не повторять автоматически; запросить snapshot, потом разрешить новое действие.

## Безопасность и лимиты API

Room create: 5/мин на session/IP; join/preview: 20/мин; upload reservation: 5/мин и quota комнаты; reactions P1 3/с с burst 6, duration 2 с. Эти значения конфигурируемые, требуют проверки demo-сети и NAT. Каждый ресурс проверяет membership/role на сервере. Invite-rotation/ban — P2, end-to-end encryption — вне MVP; HTTPS защищает передачу, сервер имеет доступ к файлам. Cancel upload до complete не означает delete готового трека.

Contract tests: export OpenAPI/JSON Schema → frontend type generation → одинаковые fixtures на Python/TS; проверить unauthorized guest, malformed JSON, stale revision, duplicate request, late event, expiry, two concurrent joins. Моковые fixtures не заменяют тест двух реальных браузеров.

## Дополнения 16 октября: предложения и подготовка следующего трека

- `POST /api/v1/rooms/{roomId}/suggestions` — `{trackId}`; доступ активному участнику, готовый трек в каталоге или этой комнате. Повтор одного трека не создаёт новую заявку. Лимит 3 на участника / 20 на комнату.
- `POST /api/v1/rooms/{roomId}/suggestions/{id}` — `{accept: boolean}`; только ведущий. Принятие добавляет трек в очередь и повышает revision, но не переключает воспроизведение. Повтор решения безопасен. Полная очередь оставляет заявку на месте и возвращает `QUEUE_FULL`.
- Оба endpoint возвращают `Snapshot`; изменённое состояние рассылается участникам. `playlist.suggestions` содержит `{id, trackId, participantId, displayName}`. Поля задаёт сервер, клиент не подставляет автора.
- `playlist.nextTrackId` — следующий трек для автоматического перехода, включая shuffle/repeat, либо `null`. Это подсказка предзагрузки, не команда воспроизведения. Сервер повторно проверяет доступность перед переходом. Изменение очереди может изменить подсказку.

Точные схемы находятся в `backend/contracts`; типы клиента генерируются из них.

### Сверка часов и telemetry

`serverReceivedAtMs` снимается сразу после чтения WS-кадра; `serverSentAtMs` — в отправляющей корутине после очереди, перед `send_json`. Поля wire-протокола не изменились. Клиент отправляет пробы последовательно и вычисляет offset по быстрым ответам, чтобы собственная пачка запросов не создавала очередь. Просроченные (>3 с) пробы и некорректный порядок timestamps игнорируются.

`sync.telemetry` отправляется клиентом не чаще раза в 6 с для текущего трека и версии. Знак `driftMs` — серверная целевая позиция минус фактическая позиция аудио; положительное значение означает отставание клиента. `rttMs` — медиана RTT трёх самых быстрых сохранённых проб. Это диагностические измерения браузера, не задержка динамиков или Bluetooth.
