# Архитектура и Python-стек

Версия 1.0 · 12 октября 2026. Архитектурное решение для команды, которая предпочитает Python для бэкенда. Node.js нужен только для инструментов React/Vite.

## Рекомендуемый стек

| Слой | Выбор | Обоснование |
| --- | --- | --- |
| Runtime | Python 3.13 как базовая версия; lock-файл и проверенная совместимость | единый Python-стек команды; допустима 3.12 при ограничениях хостинга |
| API/WS | FastAPI + Pydantic v2 + Uvicorn | async HTTP/WS, валидация входа, OpenAPI; обычный WebSocket без Socket.IO |
| Данные | PostgreSQL, SQLAlchemy 2 async + asyncpg, Alembic | транзакции, блокировка строки комнаты, миграции |
| Python deps | uv и pyproject.toml | повторяемая установка, фиксирование версий и проверка CI |
| Очередь обработки | Python Celery + Redis; один отдельный worker на старте | обработка FFmpeg вне event loop, ограничение параллелизма и повтор задач |
| Файлы | S3-совместимое приватное хранилище; MinIO локально | прямые upload/download по коротким подписанным URL, Range для seek |
| Аудио | FFprobe + FFmpeg | проверка и нормализация одного файла для всех клиентов |
| Frontend | React + TypeScript + Vite + Redux Toolkit/RTK Query + React Router | маршруты создания/входа/комнаты, HTTP cache и глобальные состояния |
| Tests | pytest + pytest-asyncio + httpx; Vitest + RTL + Playwright | Python API/domain, UI и сквозные сценарии |
| Quality | Ruff, Python typing checks, TypeScript strict, ESLint | единые проверки до merge |
| Deploy | Docker Compose, reverse proxy Caddy или Nginx, HTTPS/WSS | достаточный старт без Kubernetes и отдельного Node backend |

Конкретные patch-версии выбрать и закрепить при инициализации, не полагаться на теги latest. Один API-процесс Uvicorn в MVP: in-memory WS connection manager корректен только в одном процессе. Redis используется для Celery; не считать его автоматически решением межпроцессной синхронизации.

## Поток системы

```text
React A ─ HTTP/WS ─┐                 ┌─ PostgreSQL: комнаты, состояние, права
                  ├─ FastAPI API ────┤
React B ─ HTTP/WS ─┘                 └─ Redis → Celery Python worker → FFprobe/FFmpeg
   │                                                    │
   └──────── HTTPS signed GET/Range ── S3/MinIO ──────────┘
                       ↑ signed upload от ведущего
```

Музыка передаётся по HTTP из хранилища. WS передаёт небольшие JSON-команды и состояния. Сервер не пересылает поток звука одного клиента другому. Оба клиента используют идентичный immutable mediaVersion/asset hash. Такая схема подходит для подготовленных треков/файлов, не для live-аудио.

## Модель данных

| Сущность | Минимальные поля / ограничения |
| --- | --- |
| Session | id UUID, tokenHash, createdAt, expiresAt; секрет cookie отдельно от публичного id |
| Room | id UUID, title, hostParticipantId, status(active/closed/expired), inviteTokenHash, inviteTokenEncrypted, createdAt, expiresAt, emptySince, capacity=2 |
| Participant | id, roomId, sessionId, displayName, joinedAt, lastSeenAt, role, connectionGeneration; unique(roomId,sessionId) |
| PlaybackState | roomId PK, playbackRevision int64, trackId?, mediaVersion?, status(empty/paused/playing/ended), positionMs, anchorServerTimeMs, pendingTransition JSON?, epoch UUID |
| Track | id, scope(catalog/room), roomId?, title, artist?, durationMs, sourceAssetId, playbackAssetId?, status(uploading/processing/ready/failed), errorCode? |
| Asset | id, objectKey, checksum, contentType, sizeBytes, createdAt, expiresAt?, mediaVersion; objectKey не отдавать как публичное право |
| Upload | id, roomId, ownerParticipantId, objectKey, status, expectedSize, actualSize?, expiresAt, jobId?; upload complete идемпотентен |
| CommandReceipt | roomId, participantId, requestId, payloadHash, response, expiresAt; unique(roomId,participantId,requestId), TTL 10 минут |
| Outbox | id, roomId, revision, eventType, payload, createdAt, sentAt?; записывать в одной транзакции со state |
| QueueItem (P1) | id, roomId, trackId, addedBy, position; queueRevision отдельно от playbackRevision |

Presence/readiness хранятся в памяти API в MVP и восстанавливаются с WS. Постоянное состояние/роль/закрытие — в PostgreSQL. Индексы: sessions tokenHash, inviteTokenHash, participants(roomId), uploads(status,expiresAt), outbox(sentAt,createdAt). Комната и slot allocation создаются/обновляются транзакционно с row lock. Каскад удаления не должен удалять общие catalog assets.

## Синхронизация

1. Сервер — единственный источник текущего трека и timeline. Нельзя распространять `audio.currentTime` ведущего как истину или запускать сразу по приходу WS.
2. При WS-входе клиент делает 5 clock-probe. Времена t0/t3 клиентские, t1/t2 серверные. `offset=((t1-t0)+(t2-t3))/2`, `rtt=(t3-t0)-(t2-t1)`. Использовать медиану offsets 3 проб с минимальным RTT; повтор каждые 30 с и после reconnect/visibilitychange. Это оценка, не точная компенсация асимметричной сети.
3. На клиенте время: `baseEpoch + performance.now()`, где baseEpoch установлен при входе; не завязывать scheduler на изменения системных часов. Серверная шкала — wall clock, привязанная к monotonic clock API-процесса. Синхронизация времени хоста обязательна; скачок >100 мс или restart меняет epoch, переводит playing в paused и требует нового snapshot.
4. При ready клиента сообщаются trackId, mediaVersion, readiness, bufferedAheadMs. Старт с 0 только для выбранного ready-трека. Все подключённые участники с разрешённым звуком должны иметь ≥3 с буфера; проверить buffered range возле стартовой позиции (не менее min(3 секунд, остаток трека)), а не только событие canplaythrough.
5. Play/pause/seek планируются на `effectiveAt = serverNow + lead`, где `lead = clamp(500, 1500, 2 * maxRecentRtt + 250)` мс; при отсутствии RTT использовать 750 мс. Клиент готовит seek и запускает в этот момент. При опоздавшем событии вычисляет позицию на текущее время, не проигрывает просроченную команду с исходной точки.
6. Состояние содержит **committed timeline + pendingTransition**. До effectiveAt отображается прежний committed timeline. Pending: type, nextStatus, positionMs, effectiveAtServerTimeMs, trackId/mediaVersion. При effectiveAt сервер продвигает transition в committed anchor без второй смены revision. Snapshot до effectiveAt включает pending; после — committed. На время pending новые общие команды отклонять `PENDING_TRANSITION`, UI временно блокирует их. Select-track допускается только без pending.
7. Целевая позиция для playing: `clamp(0, durationMs, positionMs + estimatedServerNow - anchorServerTimeMs)`; для paused/ended — positionMs. Для pending считать старую шкалу до effectiveAt, новую — начиная с effectiveAt. Seek во время playing сохраняет playing, во время paused сохраняет paused; seek к duration даёт ended. Единицы сетевого протокола — миллисекунды, HTML audio — секунды.
8. Проверять drift раз в секунду активной вкладки: до 80 мс — ничего; 80–250 мс — до 3 с мягкой коррекции playbackRate в пределах 0,98–1,02 с preservesPitch; >250 мс или остаток после 3 с — seek к текущей целевой позиции. Не делать correction при seeking/buffering/pending; после восстановления сразу hard align, затем обычный цикл. При неподдерживаемом корректном rate использовать только seek. Гистерезис выхода <40 мс и rate=1 предотвращают постоянное переключение.
9. Сервер шлёт snapshot каждые 5 с и после state/role изменений; heartbeat каждые 5 с, offline после 15 с без подтверждений. Клиент просит snapshot при пробеле в state revision. Presence не увеличивает playbackRevision и имеет свой sequence.
10. Audio engine сообщает локальные autoplayBlocked/buffering/ready/error. Чужое buffering не автоматически паузит комнату. UI не пишет «Слушаете синхронно» при отсутствующем звуке/clock-probes/большом drift. Эталон — позиция воспроизведения; акустическая задержка устройства не компенсируется в MVP.

## Конкуренция и восстановление

Любая общая команда проходит авторизацию ведущего и проверку `expectedPlaybackRevision` внутри транзакции под lock комнаты. Revision увеличивается ровно на одно принятое изменение; duplicate requestId с тем же payload возвращает тот же receipt без нового события. Другой payload с тем же requestId — ошибка. Устаревшая команда возвращает CONFLICT и snapshot; клиент предлагает повторное действие, автоматически не воспроизводит старый intent.

State + receipt + outbox пишутся атомарно. Доставка WS допускает дубли/потерю; клиент сверяет revision, применяет snapshot, не считает ACK доказательством применения всеми. Outbox dispatcher отправляет после commit, при failure повторяет; periodic snapshot закрывает пробелы. Отдельный writer coroutine на connection и bounded queue 100 событий: медленный клиент получает свежий snapshot вместо старых snapshot/presence, при переполнении закрывается и reconnect.

При restart один API-процесс восстанавливает комнаты из PostgreSQL, завершает overdue pending transitions, но текущие playing timelines переводит в paused на вычисленной позиции (epoch reset). Это управляемая пауза для всех, после загрузки клиенты видят «Комната восстановлена, ведущий может продолжить». Background scheduler конца композиции проверяет revision/track перед записью и не переключает уже изменённый трек.

## Масштабирование после MVP

Перед запуском нескольких API workers: distributed room ownership с lease + fencing token или централизованный room actor; общая presence/readiness, маршрутизация WS, Redis Pub/Sub как fan-out, обязательный PostgreSQL state/outbox + snapshot recovery. Pub/Sub не является надёжным журналом доставки. Celery worker можно масштабировать раньше API независимо. CPU/audio tasks никогда не запускать в event loop; установить worker concurrency=1–2 и измерить RAM/CPU. CDN и immutable версии аудио разгружают API. Не вводить Kubernetes, микросервисы или WebRTC без измеренной потребности.

## Хранение и эксплуатация

Подписанные URL: upload 10 минут, download 5 минут, обновление заранее/по 403 без изменения asset. Незавершённые upload удалить через 1 час. Пользовательское аудио и metadata удалить не позже 24 часов после закрытия/истечения комнаты; каталог отдельный. Комнатную session/receipt очистить после TTL; технические логи хранить 7 дней, обезличенные агрегаты 30 дней. Политика сроков показывается при загрузке. Удаление активных assets по TTL не допускается.

Единый origin для React/API/WS, CORS allowlist в dev. HTTPS/WSS обязательно в опубликованной версии. Secret manager/environment, без ключей в клиентской сборке или git. CI build/test, health/readiness checks, backup/restore. Продовая конфигурация должна явно ограничивать размеры запросов, WS payload, upload quota и воркер timeouts.

## Проверенные первичные источники

FastAPI поддерживает WebSocket и зависимости авторизации: [официальная документация](https://fastapi.tiangolo.com/advanced/websockets/). Async-доступ к данным: [SQLAlchemy asyncio](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html). Очередь Python-задач: [Celery](https://docs.celeryq.dev/en/stable/getting-started/introduction.html). Ограничения доставки: [Redis Pub/Sub](https://redis.io/docs/latest/develop/pubsub/). Браузерные ограничения: [autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay), [currentTime](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime), [preservesPitch](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/preservesPitch), [performance.now](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now). Численные настройки синхронизации выше — наши проектные гипотезы, которые должны пройти QA, а не гарантии библиотек.
