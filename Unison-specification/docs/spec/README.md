# README: полная спецификация Unison

Версия 1.0 · 12 октября 2026. Документ содержит требования продукта, Python-архитектуру, HTTP/WS-контракт, дизайн, 10 эпиков и 39 историй с критериями приёмки, QA и выпуск. MVP — для двух слушателей, P1/P2 описаны отдельно. Это спецификация будущей реализации, а не заявление о готовом приложении.

Отдельно: [Frontend flow](../frontend/README.md), [Backend flow](../backend/README.md), [Дизайн-промпт](../design/README.md).

## Содержание

1. Продукт и сценарии.
2. Архитектура и Python-стек.
3. Контракт HTTP и WebSocket.
4. Требования к дизайну.
5. Эпики и истории.
6. QA, порядок выпуска и риски.

---

# Unison: продуктовая спецификация

Версия 1.0 · 12 октября 2026 · Статус: согласованный Python-стек, предлагаемая детализация продукта. Численные лимиты и сроки ниже — проектные решения для реализации, а не требования организаторов.

## Задача и результат

Два человека в разных местах открывают одну музыкальную комнату и слушают одну композицию одновременно. Вместо пересылки песни и ручного отсчёта «три, два, один» ведущий создаёт комнату, отправляет ссылку и запускает общий плеер. Ощущение звонка дают быстрый вход, присутствие другого человека и единое состояние воспроизведения; микрофон и камера для этого не требуются.

Основание кейса на приложенном слайде: музыкальная комната для двух слушателей; выбор из подготовленной подборки или загрузка файла; приглашение по ссылке; синхронное воспроизведение. Реакции, общая очередь и комнаты для компании указаны как дополнительные функции. Скриншот звонка — источник кейса, а не образец внешнего вида продукта. Пользователь задал фронтенд React + TypeScript + Redux + WebSocket и Python для бэкенда. Приложенный frontend-design SKILL.md задаёт подход к дизайну, не добавляет продуктовых функций.

## Пользователи и границы

Основная аудитория: друзья и пары, которым хочется послушать музыку вместе без сложной регистрации. Дополнительная: небольшая компания, совместная подборка музыки, удалённая рабочая сессия. Интерфейс MVP на русском; строки вынести из компонентов для будущей локализации.

MVP: ровно до двух активных участников комнаты, один ведущий и один слушатель, одна текущая композиция. P1: реакции и совместная очередь. P2: до 10 участников, режим совместного управления. Учётные записи, история прослушивания, открытый каталог комнат, платёжные функции, рекомендации, текстовый чат, голос, видео, интеграции с внешними стримингами и нативное приложение — вне MVP. Загрузка URL YouTube/Spotify не поддерживается: ссылка-приглашение ведёт в комнату, а не извлекает звук из стороннего сервиса.

## Термины и роли

Комната — временная сессия с участниками, аудио и серверным состоянием. Ведущий — участник с правом менять общий трек, запускать, приостанавливать, перематывать и закрывать комнату. Слушатель — может входить/выходить, разрешать локальный звук и менять свою громкость. В MVP выбирать/загружать треки может ведущий. Приглашение — секретная ссылка с правом входа слушателя; она никогда не даёт права ведущего. Гость — пользователь без постоянного аккаунта, идентифицированный серверной сессией.

## Основные сценарии

1. **Создание:** главная → «Создать комнату» → имя 1–32 символа → сервер создаёт сессию и комнату → ведущий видит пустой плеер и «Пригласить друга». Пустое имя не допускается; повтор HTTP-запроса не создаёт вторую комнату.
2. **Приглашение:** ведущий копирует ссылку → передаёт её другу самостоятельно → друг открывает предпросмотр, вводит имя → нажимает «Войти и включить звук» → становится слушателем. Сервис не отправляет сообщения в сторонние мессенджеры сам.
3. **Подборка:** ведущий открывает библиотеку → поиск по названию/автору → выбирает доступную композицию → оба клиента загружают один нормализованный файл → трек готов к общему старту.
4. **Файл:** ведущий выбирает MP3/WAV/M4A → видит проверку, прогресс отправки, обработку → после успешной обработки выбирает трек. Неудачная загрузка не останавливает уже играющую композицию.
5. **Слушаем:** ведущий нажимает «Воспроизвести для всех» → сервер проверяет готовность и планирует старт → оба слышат трек с заданной позиции. Пауза/перемотка также применяются по серверному времени. Громкость каждого независима.
6. **Поздний вход:** друг входит во время трека → разрешает звук → загружает файл → присоединяется к актуальной позиции. Ведущий и уже готовые слушатели продолжают слушать.
7. **Потеря связи:** интерфейс показывает восстановление → локальный плеер ещё до 3 секунд продолжает работать → затем ставится на локальную паузу → после reconnect клиент получает snapshot и догоняет комнату. Команды, сделанные без связи, не проигрываются потом.
8. **Выход ведущего:** при явном выходе роль сразу передаётся подключённому слушателю; при внезапном отключении ждём 30 секунд после обнаружения offline. Возврат старого ведущего не отнимает роль у нового.
9. **Завершение:** «Выйти» удаляет только своё участие. «Закрыть комнату для всех» доступно ведущему, требует подтверждения внутри интерфейса и останавливает всех; повторный вход по ссылке показывает завершённую сессию.

## Функциональные требования

| ID | Требование | Приоритет |
| --- | --- | --- |
| FR-01 | Создать комнату с криптографически случайным ID и отдельным приглашением | MVP/P0 |
| FR-02 | Скопировать приглашение, обработать недоступность clipboard ручным выделением ссылки | MVP/P0 |
| FR-03 | Вход без регистрации, имя, предпросмотр, лимит участников, понятная ошибка ссылки | MVP/P0 |
| FR-04 | Состав комнаты, роли и локальные состояния готов/загружается/нет звука/нет связи | MVP/P0 |
| FR-05 | Подготовленная подборка не менее 6 доступных демонстрационных треков | MVP/P0 |
| FR-06 | Загрузка, проверка, обработка, повтор и отмена до завершения отправки | MVP/P0 |
| FR-07 | Общие play, pause, seek, выбор композиции, серверная авторизация | MVP/P0 |
| FR-08 | Позднее подключение и коррекция расхождения времени | MVP/P0 |
| FR-09 | Локальные volume/mute без влияния на остальных | MVP/P0 |
| FR-10 | Reconnect, heartbeat, обновление snapshot, смена ведущего, выход | MVP/P0 |
| FR-11 | Автоматическое завершение трека, истечение и закрытие комнаты | MVP/P0 |
| FR-12 | Адаптивный UI, клавиатура, ошибки, загрузки, reduced motion | MVP/P0 |
| FR-13 | Реакции с автором и ограничением частоты | P1 |
| FR-14 | Совместная очередь с порядком и автоматическим следующим треком | P1 |
| FR-15 | Комната до 10 человек, управление доступом, смена приглашения | P2 |

## Правила продукта и лимиты

- Имя: Unicode, trim, 1–32 символа; название комнаты 1–64; plain text, запрет управляющих символов. Совпадающие имена допустимы, различать аватаром/меткой «Вы».
- Сессия: 24 часа, серверная HttpOnly cookie. Комната: не более 24 часов со времени создания; истекает также после 30 минут без подключённых участников. Продление не входит в MVP.
- Два активных участника MVP. Резервация участника при reconnect — 30 секунд после признания offline. После освобождения слота старый гость может войти заново, если есть место; закрытая комната не возрождается.
- Одна активная вкладка на участника в комнате: новое подключение замещает старое; старая вкладка прекращает звук и показывает «Комната открыта в другой вкладке». Клиенты не создают дополнительного участника при refresh.
- Файлы: MP3, WAV, M4A без DRM, до 50 MiB, до 15 минут, максимум 10 успешных файлов и 200 MiB исходников на комнату, 2 незавершённые загрузки. Пределы проверяются и клиентом, и сервером. Ошибку длительности можно выявить только после анализа на сервере.
- Оригиналы не становятся общим публичным каталогом. В MVP все клиенты играют один подготовленный MP3; декодирование и проверка обязательны, MIME/расширения недостаточно. Метаданные plain text, обложки от загрузок не извлекать в MVP.
- Переключение композиции ставит комнату на паузу и сбрасывает позицию в 0. До готовности источника общие команды недоступны. Локальное ожидание гостя не останавливает других автоматически.
- Начальный play ждёт всех подключённых участников до 8 секунд. Если кто-то не готов, ведущий видит выбор «Подождать» / «Начать без ожидания»; по умолчанию остаётся пауза. Поздно вошедшие догоняют сами.
- Конец трека в MVP: сервер устанавливает ended с позицией duration; повтор play запускает с 0. Автопереход к следующему — P1. Клиентское событие ended само не меняет общую комнату.
- Неверное приглашение возвращает обобщённую ошибку; корректное истёкшее или закрытое — экран завершения. Полная комната не позволяет создавать лишнее участие.
- Bluetooth, AirPlay, разная задержка аудиоустройств и заблокированные фоновые вкладки не позволяют обещать одинаковый акустический момент у всех. Критерий синхронизации определяется отдельно в QA.

## Нефункциональные требования и измерение

| ID | Цель | Условия и проверка |
| --- | --- | --- |
| NFR-01 | p95 расхождения позиций ≤150 мс в steady state | 2 активных desktop-клиента, RTT ≤200 мс, jitter ≤50 мс, буфер ≥3 с; 10-минутный тест, исключить документированные интервалы seek/buffering |
| NFR-02 | p95 ≤300 мс для пары desktop/mobile | те же условия; отдельная матрица; точность не объявлять достигнутой до измерений |
| NFR-03 | Исполнение обычной команды ≤1,5 с p95 | от клика до применения обоими готовыми клиентами; ожидание загрузки учитывать отдельной метрикой |
| NFR-04 | Reconnect до актуального воспроизведения ≤5 с p95 | с момента восстановления доступной сети, активная вкладка и загруженный файл |
| NFR-05 | HTTP p95 ≤300 мс | без времени передачи аудио и обработки; 100 комнат / 200 WS на тестовом окружении, характеристики сервера записать |
| NFR-06 | LCP ≤2,5 с, INP ≤200 мс, CLS ≤0,1 как цели | мобильная контрольная конфигурация и реальные замеры; не подменять Lighthouse гарантией |
| NFR-07 | 99,5% доступности в месяц как цель production | внешний probe по созданию/входу/WS; для хакатона достаточно стабильного demo и smoke |
| NFR-08 | WCAG 2.2 AA для основных пользовательских сценариев | клавиатура, контраст, focus, подписи, ручная проверка screen reader |
| NFR-09 | Совместимость | последние 2 стабильные Chrome/Edge/Firefox/Safari на дату выпуска, Safari iOS и Chrome Android; фиксировать реальные версии |
| NFR-10 | Наблюдаемость и восстановление | метрики ошибок/дрейфа/RTT/WS/воркера; резервные копии PostgreSQL ежедневно, целевой RPO 24 ч / RTO 4 ч, проверка восстановления |

Все значения — цели приёмки, не доказанные свойства отсутствующей реализации. Дополнительные профили: RTT 500 мс и 1 с, нестабильная сеть, sleep/resume и Bluetooth: ожидаем корректное состояние и восстановление, синхронизация может ухудшаться.

## Метрики успеха

Анонимные события: room_created, invite_copied, join_success, audio_unlocked, playback_started, join_failed(reason), reconnect_result, upload_result. Основная воронка: создана комната → присоединился второй → оба воспроизводят хотя бы 60 секунд. Измерять время до совместного старта и долю успешных пар; исходная гипотеза ≥80% успешных пар на пользовательском тесте из 10–15 пар. Это гипотеза продукта, а не обещанный результат. Не передавать имена, invite token, исходные названия файлов или аудио в аналитику.

## Definition of Done проекта

Все истории MVP приняты, пройдены тесты двух независимых устройств, паузы/seek/позднего входа/обрыва сети/загрузки файла; права гостя проверены сервером; дизайн 360–1440 px работает с клавиатурой; инструкция запуска соответствует коду; demo URL работает по HTTPS; лимиты, очистка и логи проверены. Реакции и групповой режим не блокируют выпуск MVP. Открытые баги и фактические отклонения от NFR описаны до демонстрации.

## Связанные документы

[Архитектура](../02-ARCHITECTURE.md), [HTTP и WebSocket](../03-API-WS.md), [Frontend flow](../04-FRONTEND-FLOW.md), [Backend flow](../05-BACKEND-FLOW.md), [Дизайн](../06-DESIGN.md), [Backlog](../07-EPICS-STORIES.md), [QA и релиз](../08-QA-RELEASE.md), [Figma-промпт](../09-FIGMA-PROMPT.md).


---

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


---

# Контракт HTTP и WebSocket

Версия протокола v1. Это спецификация для реализации, не описание существующего API. JSON UTF-8, camelCase на проводе, UUID как строки, timestamp UTC Unix milliseconds. Длительность/позиция — integer milliseconds. Python-модели используют aliases. HTTP OpenAPI генерируется FastAPI; WS-схемы Pydantic экспортируются в JSON Schema и типы TypeScript в CI. Успешные ответы не содержат приватные поля и хеши токенов.

## HTTP

Origin один: SPA `/`, API `/api/v1`, WS `/ws/v1`. Все меняющие запросы требуют Origin allowlist, session cookie (кроме первичного создания) и CSRF token из bootstrap. Cookie `HttpOnly; Secure; SameSite=Lax`, Path=/, 24 ч; HTTPS обязателен вне localhost. Создание и загрузки поддерживают `Idempotency-Key` UUID, TTL 10 мин; повтор с иным payload возвращает 409.

| Метод и путь | Тело / результат | Доступ |
| --- | --- | --- |
| GET /api/v1/bootstrap | csrfToken, protocolVersion, limits | публичный, не раскрывает комнаты |
| POST /api/v1/rooms | {displayName,title?} → 201 {roomId,participantId,inviteUrl,expiresAt,snapshot}; ставит cookie | новый ведущий |
| POST /api/v1/invites/preview | {inviteToken} → {roomId,title,status,participantCount,capacity,expiresAt} | ограниченный preview без имён/URL аудио |
| POST /api/v1/rooms/{roomId}/join | {inviteToken,displayName} → {participantId,role,snapshot}; создаёт/использует cookie | валидный invite, slot под lock |
| GET /api/v1/rooms/{roomId} | snapshot без invitation secret | только участник |
| GET /api/v1/rooms/{roomId}/invite | {inviteUrl,expiresAt} | ведущий; хранение plaintext secret сервером шифрованным для повторного копирования |
| POST /api/v1/rooms/{roomId}/leave | {} → 204; invalidate участие, явный host transfer | участник |
| POST /api/v1/rooms/{roomId}/close | {expectedPlaybackRevision} → final snapshot | ведущий |
| GET /api/v1/tracks?query=&cursor=&limit=20 | {items:[id,title,artist,durationMs,coverUrl?],nextCursor} | session; только catalogue ready |
| GET /api/v1/rooms/{roomId}/tracks | доступные catalog + room tracks, статусы | участник |
| POST /api/v1/rooms/{roomId}/uploads | {fileName,contentType,sizeBytes} → 201 {uploadId,uploadUrl,requiredHeaders,expiresAt} | ведущий, quota |
| PUT signed uploadUrl | binary file, expected content type/length/checksum если поддержано storage | временное право на один object |
| POST /api/v1/rooms/{roomId}/uploads/{uploadId}/complete | {checksum?} → 202 {trackId,status:"processing"}; повтор тот же | владелец upload и ведущий |
| GET /api/v1/rooms/{roomId}/tracks/{trackId} | {id,title,artist,durationMs,status,errorCode?,mediaVersion?} | участник; retry статуса |
| POST /api/v1/rooms/{roomId}/tracks/{trackId}/playback-url | {} → {url,expiresAt,mediaVersion,checksum,contentType} | ready, разрешённая область track |
| GET /health/live | 200, API process alive | probe |
| GET /health/ready | 200 когда доступны DB/storage/queue, иначе 503 | probe; без секретов |

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
  "payload": {"positionMs": 65000}
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

| type | payload | expectedPlaybackRevision / права |
| --- | --- | --- |
| clock.probe | {clientSentAtMs,probeId} | null / участник |
| heartbeat.pong | {pingId} | null / участник |
| room.snapshot.request | {} | null / участник |
| participant.readiness | {trackId,mediaVersion,state,bufferedAheadMs,autoplayAllowed} | null / свой участник |
| playback.select | {trackId} | integer / ведущий |
| playback.play | {allowNotReady:false} | integer / ведущий; true только после явного выбора |
| playback.pause | {} | integer / ведущий |
| playback.seek | {positionMs} | integer / ведущий; 0≤position≤duration |
| sync.telemetry | {trackId,mediaVersion,driftMs,rttMs,localState} | null / свой; ≤1/5 с |
| reaction.send (P1) | {emoji} | null / участник, allowlist |
| queue.add/remove/reorder (P1) | {trackId} / {itemId} / {itemIds,expectedQueueRevision} | отдельная queueRevision / правила из backlog |

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


---

# Требования к дизайну Unison

## Направление

Unison — музыкальная комната для двоих, а не панель видеоконференции. Узнаваемый образ: одна звуковая дорожка и два курсора слушателей, сходящиеся в общий момент. Это единственный выразительный мотив; всё вокруг спокойно и функционально. Курсоры не имитируют точность реальной синхронизации: при отсутствии готовности показывают ожидание, при offline — разрыв. Иллюстрации камер/микрофонов и копирование скриншота звонка не нужны.

Применён подход приложенного frontend-design: предметная визуальная идея, короткая система токенов, план и критика перед макетами. Предпочтительно светлое пространство с прохладным синим и глубоким сливовым акцентами, асимметричная композиция плеера и людей. Не строить экран из одинаковых карточек; не использовать декоративные градиенты, заголовки с одним произвольно раскрашенным словом, кислотный accent на чёрном или uppercase labels без причины.

## Токены

| Token | Значение | Назначение |
| --- | --- | --- |
| canvas | #F2F6FB | прохладный фон приложения |
| surface | #FFFFFF | библиотека, диалог, элементы ввода |
| ink | #182747 | основной текст |
| muted | #536580 | вторичный текст |
| primary | #274BC8 | общие действия и ведущий |
| companion | #784A83 | второй слушатель и реакции |

Дополнительные semantic colors: success #176747, warning #8B570E, danger #AD283B, border #CFD9E8. Border для декоративного разделения; значимые контуры inputs/focus проверять на contrast≥3:1. Текст AA≥4,5:1, крупный текст≥3:1; сочетания этих tokens ещё нужно измерить в макетах. Цвет дополняется подписью/иконкой, не является единственным сигналом.

Типографика: Golos Text для русского UI и заголовков; единственная семья с разными начертаниями. Открытую лицензию и источник проверить при реализации, локально разместить WOFF2. При недоступности — системный sans. Шкала 12/14/16/20/28/40/56 px; body16 line-height24, secondary14/20; крупное имя композиции 40/44 desktop,28/34 mobile, hero56/60 desktop,36/42 mobile. Длинные тексты в пределах 72–80 знаков, преимущественно левое выравнивание. Время плеера с tabular numerals, без monospace как декоративного штампа.

Шаг spacing4px, основные интервалы 8/12/16/24/32/48. Content max1280px, desktop margin48–64, mobile16. Radius: inputs/buttons10, overlay16, avatar circle; не один радиус для всего. Тени только overlays, мягкие и короткие; основные зоны отделяются пространством/контентом. Focus2px с offset2px; проверять контраст с фоном.

## Экраны и состав

1. **Главная:** название Unison, фраза «Одна песня. Один момент.», короткое пояснение, «Создать комнату», поле имени при старте, маленькая предметная демонстрация общей дорожки. Создание и вход понятны без маркетинговых обещаний. Вход по приглашению обычно прямой, ручной ввод всей ссылки можно оставить вспомогательным действием.
2. **Предпросмотр/вход:** имя комнаты, два места с честным состоянием занятости, своё имя, «Войти и включить звук», короткий текст о локальном разрешении звука. Отдельные состояния invalid/full/expired/closed. Не запрашивать микрофон/камеру.
3. **Пустая комната ведущего:** header с названием и кнопкой приглашения; два места участников; пустой плеер «Выберите первую композицию»; действия «Открыть подборку» и «Загрузить файл».
4. **Комната:** крупная обложка/честный placeholder, title/artist, синхронизационная дорожка, времени elapsed/duration, общий play/pause/seek, локальный volume/mute; участники рядом, статус «Слушаете вместе» только при готовности. Bibli отека — боковой drawer, а не постоянный тяжёлый dashboard.
5. **Слушатель:** общие controls read-only, «Воспроизведением управляет Кирилл», локальный звук активен; не скрывать состояние трека и возможность выйти.
6. **Подборка:** поиск, список треков с названием/автором/длительностью и явным «Выбрать» для ведущего; поиск без результатов «Ничего не найдено. Попробуйте другое название». P1 отдельное «Добавить в очередь», не путать с немедленным переключением.
7. **Загрузка:** выбор/drag-drop, формат/размер/срок хранения, отправка с percentage и отменой; processing без выдуманного процента; ready; каждая ошибка с действием исправления. Заголовок файла сокращать, не двигать layout.
8. **Приглашение:** копируемая ссылка, «Копировать ссылку» → toast «Ссылка скопирована»; при отказе clipboard — доступное поле с ручным копированием.
9. **Системные состояния:** «Включить звук», «Загружаем композицию», «Восстанавливаем соединение», «Теперь вы ведущий», ожидание второго, готовность не всех с явным выбором ведущего, новая вкладка, завершение комнаты, подтверждение закрытия.
10. **P1/P2 макеты отдельно:** реакции, общая очередь, до 10 аватаров/list, управление очередью/ролями. В MVP нет неработающих controls расширений.

## Компоновка и адаптивность

```text
Desktop1440
┌ Unison  Название комнаты                Пригласить  Выйти ┐
│                                                         │
│   обложка + композиция        Кирилл / ведущий            │
│   общий timeline             Аня / слушает               │
│   общий плеер + local volume                            │
│   Подборка / Загрузить                                   │
└─────────────────────────────────────────────────────────┘

Mobile390
┌ Unison              Пригласить / меню ┐
│ Кирилл        Аня                     │
│ обложка / название                    │
│ timeline и статус                     │
│ общий play/pause                      │
│ локальная громкость                   │
│ Подборка / Загрузить                   │
└───────────────────────────────────────┘
```

Desktop≥1024: плеер занимает примерно 2/3, участники 1/3; library drawer шириной 420–480. Tablet768–1023: участники над плеером, side drawer поверх контента. Mobile360–767: одна колонка, без горизонтального scroll; библиотека и upload как полноэкранный sheet/dialog, controls не перекрывают содержимое и safe area. Проверить 320px как стресс-тест текста, основная поддержка от 360. Целевые hit areas≥44×44, между соседними опасными действиями≥8px. Landscape и 200% zoom не ломают ключевые действия.

## Компоненты и интеракции

Button primary/secondary/quiet/danger с default/hover/focus/pressed/disabled/loading; IconButton с доступным именем; TextField default/focus/error/disabled; Dialog/Sheet с trap focus, Esc и возвратом focus; Toast success/error; ParticipantTile host/listener/ready/loading/offline; AudioPlayer host/listener; Timeline idle/syncing/synced/paused; SeekSlider и VolumeSlider; TrackRow selected/ready/disabled; UploadPanel состояния; ConnectionBanner; EmptyState; ReactionButton P1; QueueItem P1.

Не смешивать общую паузу с локальным mute: разные символы и подписи. Tooltip помогает, но не заменяет доступное имя. Status announcements через aria-live polite, критические ошибки assertive дозированно. Прогресс не озвучивать каждую секунду. Не использовать waveform как seek control без корректного slider; waveform возможна только по реальному файлу, иначе честная абстрактная дорожка.

Motion140–220 мс для действия/перехода drawer/feedback, одна краткая сцена сближения курсоров при подтверждённом совместном старте. Нет бесконечных пульсаций, эквалайзера «для красоты» и появления каждой карточки fade-up. Reduced motion — немедленные переходы, статичная линия, без параллакса. В состоянии paused движение останавливается.

## Тексты

Использовать sentence case и глаголы: «Создать комнату», «Пригласить друга», «Войти и включить звук», «Выбрать композицию», «Загрузить файл», «Воспроизвести для всех», «Пауза для всех», «Выключить звук у меня», «Выйти», «Закрыть комнату для всех». Ошибки конкретны: «Файл больше 50 МБ. Выберите файл меньшего размера»; «Не удалось обработать аудио. Выберите MP3, WAV или M4A»; «Комната уже заполнена»; «Связь восстановлена. Возвращаемся к композиции». Пример UI округляет 50MiB до «50 МБ», точный предел объясняется в help.

Demo content: room «Вечер на двоих», ведущий Кирилл, слушатель Аня; вымышленные треки «После дождя» / «Тихий берег» /03:42, «Последний трамвай» / «Медленный город» /04:10, «Окна напротив» / «Плёнка» /03:18. Эти названия — макетный контент; реальные demo audio подбираются отдельно с подтверждённым разрешением.

## Результат в Figma и приёмка

Страницы: Brief & flows; Foundations; Components; Desktop; Mobile; States; Prototype; Handoff. Auto Layout, reusable components, variants, semantic color/spacing/type variables, рабочие constraints. Один complete flow для ведущего, один для слушателя и один восстановления. Frames1440,1024,768,390,360. Все кнопки/поля иметь состояния, все routes/error cases макеты. Handoff: token mapping, component names, размеры, role behavior, motion/reduced motion, список asset sources, поведение overflow/zoom, доступность и приёмочный checklist. Дизайн не обещает точность синхронизации цифрами в обычном UI; отладочные миллисекунды только в dev overlay.


---

# Эпики и истории Unison

10 эпиков, 39 историй: 33 MVP, 3 P1, 3 P2. P0 — обязательное для MVP, P1/P2 — следующие фазы. Story IDs отличаются от ID задач YouGile. Исполнители, оценки и сроки назначаются командой.

| Эпик | Результат | Фаза |
| --- | --- | --- |
| E01 Основа проекта и контракты | Повторяемый старт React и Python API, единые типы и тестовые fixtures. | MVP |
| E02 Комнаты, приглашения и роли | Два пользователя входят по ссылке и видят корректное присутствие и полномочия. | MVP |
| E03 Подборка и загрузка аудио | Один доступный для обоих аудиоисточник с безопасной обработкой файла. | MVP |
| E04 Синхронное воспроизведение | Серверная временная шкала и согласованные play/pause/seek/late join. | MVP |
| E05 Восстановление и жизненный цикл | Сессия сохраняет корректность при потере связи, выходе и restart. | MVP |
| E06 Интерфейс и доступность | Полный адаптивный опыт с честными локальными состояниями. | MVP |
| E07 Защита и эксплуатационные ограничения | Серверные права, лимиты, сроки хранения и наблюдаемость. | MVP |
| E08 Проверка и выпуск MVP | Измеренная синхронизация, совместимость и повторяемая демонстрация. | MVP |
| E09 Реакции и общая очередь | Выражение присутствия и совместный выбор следующих треков. | P1 |
| E10 Комнаты для компании | До 10 участников с управляемыми правами и приглашением. | P2 |

Все MVP-истории начинают в «Бэклог MVP», расширения в «После MVP». Статусы: бэклог → в работе → на проверке → готово. Эпики находятся отдельно и связаны с историями как с подзадачами. Зависимости задают технический порядок; UI по mock-данным можно делать параллельно. Не назначать исполнителей и даты без данных команды.

# E01 Основа проекта и контракты

Повторяемый старт React и Python API, единые типы и тестовые fixtures.

Приёмка эпика: все истории удовлетворяют своим критериям, интеграция проверена по QA.

## US-01.01: Инициализация React и Python

Как разработчик, хочу воспроизводимое окружение, чтобы быстро начать работу.

Эпик: E01 · Фаза: MVP · Приоритет: P0

Зависимости: нет

**Фронтенд:** Настроить React, Vite, TypeScript strict, Redux, Router и сборку.

**Бэкенд:** Настроить FastAPI, uv, Uvicorn, Compose и проверки здоровья.

**Критерии приёмки:**

- [ ] Чистый checkout запускается по инструкции без личных путей.
- [ ] API и SPA доступны с одного origin.
- [ ] Секретов в git нет, примеры окружения содержат placeholders.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-01.02: Контракт HTTP и WS

Как разработчик, хочу единые схемы, чтобы фронт и бэк интегрировались без расхождений.

Эпик: E01 · Фаза: MVP · Приоритет: P0

Зависимости: US-01.01

**Фронтенд:** Сгенерировать типы TypeScript и общие тестовые JSON-примеры.

**Бэкенд:** Описать Pydantic, OpenAPI и версионированные WS-схемы.

**Критерии приёмки:**

- [ ] Общие примеры проходят валидацию Python и TypeScript.
- [ ] Позиции и время передаются в миллисекундах, неизвестные поля отклоняются.
- [ ] Несовместимая версия и повреждённый JSON дают управляемую ошибку.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-01.03: Domain model и миграции

Как разработчик, хочу явную модель комнаты, чтобы избежать противоречивого состояния.

Эпик: E01 · Фаза: MVP · Приоритет: P0

Зависимости: US-01.01, US-01.02

**Фронтенд:** Разделить состояния соединения, комнаты и локального аудио.

**Бэкенд:** Создать модели, миграции, ограничения и транзакционный outbox.

**Критерии приёмки:**

- [ ] Миграции проверены на чистом PostgreSQL.
- [ ] У комнаты один ведущий, участие уникально на пару room/session.
- [ ] Состояние, receipt и outbox сохраняются атомарно.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

# E02 Комнаты, приглашения и роли

Два пользователя входят по ссылке и видят корректное присутствие и полномочия.

Приёмка эпика: все истории удовлетворяют своим критериям, интеграция проверена по QA.

## US-02.01: Создать комнату

Как ведущий, хочу создать комнату, чтобы пригласить друга.

Эпик: E02 · Фаза: MVP · Приоритет: P0

Зависимости: US-01.03

**Фронтенд:** Реализовать имя, загрузку, ошибки и переход в пустую комнату.

**Бэкенд:** Создавать сессию, комнату, ведущего и приглашение идемпотентно.

**Критерии приёмки:**

- [ ] Валидное имя создаёт комнату и роль ведущего.
- [ ] Повтор запроса с тем же ключом создаёт ровно одну комнату.
- [ ] Невалидное имя отклоняется без потери текста формы.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-02.02: Ссылка-приглашение

Как ведущий, хочу скопировать приглашение, чтобы друг вошёл в мою комнату.

Эпик: E02 · Фаза: MVP · Приоритет: P0

Зависимости: US-02.01

**Фронтенд:** Сделать диалог ссылки, копирование и ручной fallback.

**Бэкенд:** Создать отдельный секрет приглашения, проверять права получения ссылки.

**Критерии приёмки:**

- [ ] Ссылка содержит комнату и секрет во fragment.
- [ ] Приглашение даёт только роль слушателя.
- [ ] При отказе clipboard ссылку можно выделить и скопировать вручную.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-02.03: Вход без регистрации

Как слушатель, хочу войти по ссылке, чтобы быстро слушать вместе.

Эпик: E02 · Фаза: MVP · Приоритет: P0

Зависимости: US-02.02

**Фронтенд:** Сделать предпросмотр, ввод имени и явное разрешение звука.

**Бэкенд:** Проверять приглашение, cookie, срок и лимит под блокировкой комнаты.

**Критерии приёмки:**

- [ ] Два независимых браузера входят с разными сессиями и ролями.
- [ ] Два одновременных входа на последний слот дают один успех.
- [ ] Неверная, полная и закрытая комнаты имеют отдельные понятные состояния.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-02.04: Присутствие и готовность

Как участник, хочу видеть другого слушателя и его готовность.

Эпик: E02 · Фаза: MVP · Приоритет: P0

Зависимости: US-02.03, US-01.02

**Фронтенд:** Показывать имена, роли, загрузку, звук и отсутствие связи.

**Бэкенд:** Отправлять присутствие и готовность текущей версии аудио.

**Критерии приёмки:**

- [ ] Список участников обновляется в пределах одного heartbeat-интервала.
- [ ] Гость без разрешения звука не отображается готовым.
- [ ] Готовность старой версии трека или соединения игнорируется.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-02.05: Права ведущего и смена роли

Как участник, хочу однозначное управление плеером.

Эпик: E02 · Фаза: MVP · Приоритет: P0

Зависимости: US-02.04

**Фронтенд:** Различать управление ведущего и слушателя, показать смену роли.

**Бэкенд:** Проверять ведущего в каждой команде и передавать роль транзакционно.

**Критерии приёмки:**

- [ ] Поддельная команда слушателя отклоняется сервером.
- [ ] Явный выход ведущего сразу передаёт роль подключённому слушателю.
- [ ] Вернувшийся после передачи старый ведущий становится слушателем.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

# E03 Подборка и загрузка аудио

Один доступный для обоих аудиоисточник с безопасной обработкой файла.

Приёмка эпика: все истории удовлетворяют своим критериям, интеграция проверена по QA.

## US-03.01: Подготовленная подборка

Как ведущий, хочу выбрать готовую композицию, чтобы начать без загрузки.

Эпик: E03 · Фаза: MVP · Приоритет: P0

Зависимости: US-01.03, US-02.03

**Фронтенд:** Сделать библиотеку, поиск, метаданные и выбор.

**Бэкенд:** Подготовить каталог и защищённый доступ к его аудио.

**Критерии приёмки:**

- [ ] Доступны не менее шести подготовленных композиций.
- [ ] Поиск, отсутствие результатов и выбор работают.
- [ ] Источник и разрешение использования каждого демонстрационного файла записаны.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-03.02: Отправить свой аудиофайл

Как ведущий, хочу загрузить свою композицию.

Эпик: E03 · Фаза: MVP · Приоритет: P0

Зависимости: US-02.05, US-01.03

**Фронтенд:** Сделать выбор файла, валидацию, прогресс и отмену отправки.

**Бэкенд:** Выдавать подписанную загрузку, проверять размер, роль и квоты.

**Критерии приёмки:**

- [ ] MP3/WAV/M4A до 50 MiB принимаются, превышение отклоняется.
- [ ] Отмена работает, повтор complete не создаёт второй трек.
- [ ] Лимиты 200 MiB, десять файлов и две незавершённые загрузки проверяет сервер.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-03.03: Обработка и нормализация

Как участник, хочу воспроизводимый файл одинаковой версии.

Эпик: E03 · Фаза: MVP · Приоритет: P0

Зависимости: US-03.02

**Фронтенд:** Показать обработку, готовность, ошибку и резервное обновление статуса.

**Бэкенд:** Обрабатывать FFprobe/FFmpeg отдельным Celery-воркером с лимитами.

**Критерии приёмки:**

- [ ] Оба клиента получают один mediaVersion и checksum.
- [ ] Повреждённый, защищённый или длиннее 15 минут файл становится failed.
- [ ] Повтор задачи и timeout не создают второй готовый файл и не блокируют API.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-03.04: Загрузка источника в плеер

Как слушатель, хочу получать звук и перематывать без скачивания через WS.

Эпик: E03 · Фаза: MVP · Приоритет: P0

Зависимости: US-03.01, US-03.03

**Фронтенд:** Загружать аудио, проверять буфер и обновлять истёкший URL.

**Бэкенд:** Проверять доступ, поддерживать Range, CORS и Content-Type.

**Критерии приёмки:**

- [ ] Аудио скачивается по HTTP, через WS идут только состояния.
- [ ] Истёкший URL обновляется для той же версии файла.
- [ ] Чужой или неготовый трек не выдаёт URL воспроизведения.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

# E04 Синхронное воспроизведение

Серверная временная шкала и согласованные play/pause/seek/late join.

Приёмка эпика: все истории удовлетворяют своим критериям, интеграция проверена по QA.

## US-04.01: Оценка серверного времени

Как слушатель, хочу согласованное время старта.

Эпик: E04 · Фаза: MVP · Приоритет: P0

Зависимости: US-02.04

**Фронтенд:** Реализовать пять проверок времени и монотонный планировщик.

**Бэкенд:** Отвечать отметками времени и управлять epoch.

**Критерии приёмки:**

- [ ] Формула offset и RTT проверена на примерах задержки и jitter.
- [ ] Reconnect и возвращение вкладки обновляют оценку времени.
- [ ] Смена epoch отменяет старые запланированные действия.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-04.02: Общий запуск и пауза

Как ведущий, хочу запускать и ставить на паузу для обоих.

Эпик: E04 · Фаза: MVP · Приоритет: P0

Зависимости: US-04.01, US-03.04, US-02.05

**Фронтенд:** Сделать общий play/pause, ожидание готовности и feedback.

**Бэкенд:** Планировать переход по effectiveAt, сохранять receipt и outbox.

**Критерии приёмки:**

- [ ] Готовые клиенты применяют переход по серверному времени, задержка измерена.
- [ ] До effectiveAt snapshot содержит прежний timeline и pending.
- [ ] Начало без неготового участника требует явного решения ведущего.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-04.03: Общая перемотка

Как ведущий, хочу перематывать композицию для всех.

Эпик: E04 · Фаза: MVP · Приоритет: P0

Зависимости: US-04.02

**Фронтенд:** Сделать доступный seek с предпросмотром и одной отправкой на release.

**Бэкенд:** Проверять позицию, статус, revision и планировать перемотку.

**Критерии приёмки:**

- [ ] Seek сохраняет playing или paused согласно исходному состоянию.
- [ ] Позиции вне диапазона отклоняются, duration переводит в ended.
- [ ] Устаревшая revision не меняет timeline, drag не создаёт поток команд.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-04.04: Коррекция расхождения

Как слушатель, хочу оставаться на общей позиции.

Эпик: E04 · Фаза: MVP · Приоритет: P0

Зависимости: US-04.02, US-04.03

**Фронтенд:** Реализовать мягкую коррекцию, seek, гистерезис и диагностику.

**Бэкенд:** Периодически отправлять snapshot и собирать агрегаты расхождения.

**Критерии приёмки:**

- [ ] Пороги 80/250 мс и возврат playbackRate к единице проверены.
- [ ] Коррекция не конфликтует с загрузкой, seek и pending.
- [ ] Десятиминутный тест показывает p50/p95/max и число коррекций.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-04.05: Присоединение во время песни

Как слушатель, хочу услышать текущий момент, даже если вошёл позже.

Эпик: E04 · Фаза: MVP · Приоритет: P0

Зависимости: US-04.04

**Фронтенд:** Присоединять после загрузки и разрешения звука к текущей позиции.

**Бэкенд:** Выдавать свежий snapshot, не останавливая уже играющих участников.

**Критерии приёмки:**

- [ ] Вход на 45-й секунде не перезапускает ведущего.
- [ ] Вход до и после effectiveAt учитывает соответствующий timeline.
- [ ] Устаревшие callbacks не запускают предыдущий трек.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-04.06: Локальный звук и завершение трека

Как участник, хочу свою громкость и понятный конец композиции.

Эпик: E04 · Фаза: MVP · Приоритет: P0

Зависимости: US-04.02, US-04.03

**Фронтенд:** Сделать независимые volume/mute и состояние окончания.

**Бэкенд:** Планировать конец трека с проверкой revision и повтор с нуля.

**Критерии приёмки:**

- [ ] Громкость одного клиента не меняет другого.
- [ ] Локальное ended не управляет общим состоянием.
- [ ] Повтор play после ended начинает с нуля, старый timer не завершает новый трек.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

# E05 Восстановление и жизненный цикл

Сессия сохраняет корректность при потере связи, выходе и restart.

Приёмка эпика: все истории удовлетворяют своим критериям, интеграция проверена по QA.

## US-05.01: Переподключение

Как участник, хочу продолжить после краткого обрыва связи.

Эпик: E05 · Фаза: MVP · Приоритет: P0

Зависимости: US-04.05

**Фронтенд:** Реализовать backoff, баннер, локальную паузу и догон позиции.

**Бэкенд:** Контролировать heartbeat, offline и выдавать свежий snapshot.

**Критерии приёмки:**

- [ ] При потере связи общие команды выключаются сразу, звук паузится через три секунды.
- [ ] Восстановление до актуальной позиции измерено по NFR.
- [ ] Старые команды не повторяются, terminal-ошибки не вызывают бесконечный reconnect.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-05.02: Refresh и несколько вкладок

Как участник, хочу не дублироваться при обновлении страницы.

Эпик: E05 · Фаза: MVP · Приоритет: P0

Зависимости: US-05.01

**Фронтенд:** Восстанавливать комнату по cookie и останавливать заменённую вкладку.

**Бэкенд:** Проверять уникальное участие и generation соединения.

**Критерии приёмки:**

- [ ] Refresh сохраняет участие и корректную роль.
- [ ] Новая вкладка замещает старую, звучит только активная.
- [ ] Поздний disconnect старого сокета не удаляет новое присутствие.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-05.03: Выход, закрытие и TTL

Как ведущий, хочу закончить комнату и знать срок её действия.

Эпик: E05 · Фаза: MVP · Приоритет: P0

Зависимости: US-02.05, US-05.01

**Фронтенд:** Сделать выход, подтверждение закрытия и terminal-экраны.

**Бэкенд:** Реализовать grace ведущего, TTL и закрытие под lock.

**Критерии приёмки:**

- [ ] Возврат ведущего в grace сохраняет роль, после передачи — не отнимает её.
- [ ] Закрытие останавливает всех и запрещает повторный вход.
- [ ] TTL считается сервером, активные файлы преждевременно не удаляются.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-05.04: Восстановление API после restart

Как участник, хочу корректно продолжить после перезапуска сервера.

Эпик: E05 · Фаза: MVP · Приоритет: P0

Зависимости: US-05.01, US-01.03

**Фронтенд:** Показать восстановленную комнату на паузе и продолжение ведущим.

**Бэкенд:** Восстановить DB/outbox, обработать pending и сменить epoch.

**Критерии приёмки:**

- [ ] После restart клиенты получают paused и новую epoch.
- [ ] Повтор outbox не вызывает повторного изменения timeline.
- [ ] Ведущий может продолжить с сохранённым треком и позицией.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

# E06 Интерфейс и доступность

Полный адаптивный опыт с честными локальными состояниями.

Приёмка эпика: все истории удовлетворяют своим критериям, интеграция проверена по QA.

## US-06.01: Основные экраны по дизайну

Как участник, хочу простой цельный интерфейс музыкальной комнаты.

Эпик: E06 · Фаза: MVP · Приоритет: P0

Зависимости: US-01.02

**Фронтенд:** Собрать основные экраны на токенах и компонентах дизайна.

**Бэкенд:** Предоставить данные и ошибки для всех экранов по контракту.

**Критерии приёмки:**

- [ ] Все основные экраны работают для ведущего и слушателя.
- [ ] В MVP нет неработающих кнопок расширений.
- [ ] Длинные значения не ломают layout, общая пауза отличается от local mute.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-06.02: Мобильная версия

Как слушатель с телефона, хочу полноценно войти и слушать.

Эпик: E06 · Фаза: MVP · Приоритет: P0

Зависимости: US-06.01

**Фронтенд:** Адаптировать layouts, sheets и safe areas для телефона.

**Бэкенд:** Использовать одинаковый контракт для desktop и mobile.

**Критерии приёмки:**

- [ ] На 360 px нет горизонтального overflow, цели нажатия не меньше 44 px.
- [ ] При 200% zoom и landscape доступны основные действия.
- [ ] Реальный Safari iOS и Chrome Android проверены с аудио.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-06.03: Доступность и motion

Как пользователь клавиатуры, хочу управлять комнатой без мыши.

Эпик: E06 · Фаза: MVP · Приоритет: P0

Зависимости: US-06.01, US-06.02

**Фронтенд:** Реализовать клавиатуру, focus, dialogs, aria-live и reduced motion.

**Бэкенд:** Предоставить стабильные коды и тексты ошибок.

**Критерии приёмки:**

- [ ] Основные сценарии проходят клавиатурой с видимым focus.
- [ ] Контраст AA измерен, статус понятен без цвета.
- [ ] Screen reader получает подписи, reduced motion отключает автоматическую анимацию.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-06.04: Ошибки, загрузки и пустые состояния

Как участник, хочу понимать проблему и следующий шаг.

Эпик: E06 · Фаза: MVP · Приоритет: P0

Зависимости: US-06.01, US-05.01, US-03.03

**Фронтенд:** Сделать полную матрицу ошибок, загрузок и пустых состояний.

**Бэкенд:** Возвращать стабильные ошибки, лимиты и requestId.

**Критерии приёмки:**

- [ ] Полная комната, неверная ссылка, нет звука, загрузка и offline имеют следующий шаг.
- [ ] Обработка не показывает выдуманный процент, playing подтверждён фактически.
- [ ] Повтор сохраняет форму, временная ошибка не уничтожает состояние комнаты.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

# E07 Защита и эксплуатационные ограничения

Серверные права, лимиты, сроки хранения и наблюдаемость.

Приёмка эпика: все истории удовлетворяют своим критериям, интеграция проверена по QA.

## US-07.01: Серверная защита комнаты

Как участник, хочу закрытый доступ по приглашению.

Эпик: E07 · Фаза: MVP · Приоритет: P0

Зависимости: US-02.03, US-02.05, US-03.04

**Фронтенд:** Очищать fragment после входа и безопасно отображать plain text.

**Бэкенд:** Проверять Origin, CSRF, cookie, права и частоту запросов.

**Критерии приёмки:**

- [ ] Команда гостя не проходит, публичный roomId не даёт доступа.
- [ ] Чужой asset и неверный Origin отклоняются.
- [ ] Секреты, cookie и подписанные URL не попадают в логи и сборку.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-07.02: Квоты и очистка файлов

Как пользователь, хочу понятные ограничения и сроки хранения.

Эпик: E07 · Фаза: MVP · Приоритет: P0

Зависимости: US-03.03, US-05.03

**Фронтенд:** Показывать ограничения файлов и сроки хранения.

**Бэкенд:** Ограничить обработку и сделать идемпотентную очистку.

**Критерии приёмки:**

- [ ] Незавершённая загрузка удаляется после часа, файлы комнаты — в установленный срок.
- [ ] Очистка не удаляет каталог и активные файлы.
- [ ] Подмена MIME, вредоносный путь и большой output не обходят лимиты.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-07.03: Диагностика без личных данных

Как команда, хочу видеть сбои и дрейф без записи музыки.

Эпик: E07 · Фаза: MVP · Приоритет: P0

Зависимости: US-04.04, US-05.01

**Фронтенд:** Добавить обезличенную воронку и отдельную диагностику разработки.

**Бэкенд:** Собрать структурированные логи, метрики и условия оповещений.

**Критерии приёмки:**

- [ ] Метрики отделяют блокировку звука и загрузку от стабильной синхронизации.
- [ ] Имена, аудио, токены и названия файлов не отправляются в аналитику.
- [ ] Сбои воркера и рост очереди видны, технические логи хранятся семь дней.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

# E08 Проверка и выпуск MVP

Измеренная синхронизация, совместимость и повторяемая демонстрация.

Приёмка эпика: все истории удовлетворяют своим критериям, интеграция проверена по QA.

## US-08.01: Контрактные и интеграционные тесты

Как команда, хочу проверить критические правила до выпуска.

Эпик: E08 · Фаза: MVP · Приоритет: P0

Зависимости: US-01.03, US-04.03, US-03.03

**Фронтенд:** Проверить математику, UI и два независимых browser context.

**Бэкенд:** Проверить API, PostgreSQL, обработку, блокировки и идемпотентность.

**Критерии приёмки:**

- [ ] CI проверяет типы, lint, сборку, схемы и содержательные тесты.
- [ ] Гонки входа, stale revision и повтор команд проверены на PostgreSQL.
- [ ] Ошибки обработки, outbox и generation проверены интеграционно.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-08.02: Замер синхронизации и browser QA

Как команда, хочу доказать совместное воспроизведение.

Эпик: E08 · Фаза: MVP · Приоритет: P0

Зависимости: US-04.06, US-05.02, US-06.03, US-08.01

**Фронтенд:** Провести desktop/mobile и реальные аудиопрогоны.

**Бэкенд:** Провести нагрузку 200 WS/100 комнат, записать условия.

**Критерии приёмки:**

- [ ] Выполнены три десятиминутных прогона для каждого профиля.
- [ ] Цели 150/300 мс проверены, фактические отклонения явно записаны.
- [ ] Акустическая проверка отделена от currentTime, mock audio не заменяет browser QA.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-08.03: Публикация и эксплуатация

Как команда, хочу воспроизводимый доступный demo.

Эпик: E08 · Фаза: MVP · Приоритет: P0

Зависимости: US-08.01, US-07.01, US-07.02

**Фронтенд:** Настроить production-сборку, origin и fallback маршрутов.

**Бэкенд:** Настроить HTTPS/WSS, Compose, миграции и backup/restore.

**Критерии приёмки:**

- [ ] Demo работает на двух независимых устройствах по HTTPS.
- [ ] Новый deploy и восстановление выполняются по инструкции.
- [ ] Обработка не блокирует API, несколько API-процессов не включены без координации.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-08.04: Приёмка и демонстрация MVP

Как команда, хочу представить завершённый основной сценарий.

Эпик: E08 · Фаза: MVP · Приоритет: P0

Зависимости: US-08.02, US-08.03, US-06.04, US-05.04, US-07.03

**Фронтенд:** Пройти демонстрационный сценарий и исправить оставшиеся блокеры.

**Бэкенд:** Подготовить demo assets, сброс и актуальную инструкцию.

**Критерии приёмки:**

- [ ] Все MVP-истории приняты, оставшиеся ограничения описаны.
- [ ] Сценарий на три–пять минут повторяем на двух устройствах.
- [ ] README запуска соответствует коду, выводы о синхронизации основаны на замерах.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

# E09 Реакции и общая очередь

Выражение присутствия и совместный выбор следующих треков.

Приёмка эпика: все истории удовлетворяют своим критериям, интеграция проверена по QA.

## US-09.01: Реакции во время песни

Как слушатель, хочу показать эмоцию другому участнику.

Эпик: E09 · Фаза: P1 · Приоритет: P1

Зависимости: US-08.04

**Фронтенд:** Сделать реакции с автором и reduced motion.

**Бэкенд:** Проверять emoji, участие и частоту, рассылать eventId.

**Критерии приёмки:**

- [ ] Реакция видна обоим и не меняет playback.
- [ ] Спам ограничен и не тормозит команды.
- [ ] Без анимации реакция остаётся понятной, функция выпускается после MVP.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-09.02: Совместная очередь

Как слушатель, хочу предложить следующую композицию.

Эпик: E09 · Фаза: P1 · Приоритет: P1

Зависимости: US-08.04

**Фронтенд:** Сделать список очереди, добавление, удаление и порядок.

**Бэкенд:** Хранить очередь с revision и проверять права изменений.

**Критерии приёмки:**

- [ ] Слушатель добавляет готовый трек и удаляет только своё.
- [ ] Ведущий управляет всем, stale revision даёт conflict.
- [ ] Изменение очереди не переключает текущую композицию.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-09.03: Автоматический следующий трек

Как участник, хочу слушать очередь без ручного переключения.

Эпик: E09 · Фаза: P1 · Приоритет: P1

Зависимости: US-09.02

**Фронтенд:** Предзагружать следующий трек и показывать переход.

**Бэкенд:** Переключать очередь авторитетно и потреблять элемент один раз.

**Критерии приёмки:**

- [ ] После окончания следующий готовый элемент включается ровно один раз.
- [ ] Переход соблюдает правила готовности и явного решения ведущего.
- [ ] Пустая очередь даёт ended, ошибочный элемент помечается и пропускается с объяснением.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

# E10 Комнаты для компании

До 10 участников с управляемыми правами и приглашением.

Приёмка эпика: все истории удовлетворяют своим критериям, интеграция проверена по QA.

## US-10.01: Комната до десяти участников

Как компания, хочу слушать вместе большей группой.

Эпик: E10 · Фаза: P2 · Приоритет: P2

Зависимости: US-08.04, US-09.03

**Фронтенд:** Сделать адаптивный состав группы и полный список участников.

**Бэкенд:** Увеличить capacity и проверить нагрузку/готовность группы.

**Критерии приёмки:**

- [ ] Десять участников входят, одиннадцатый получает full.
- [ ] Синхронизация измерена для десяти, медленный гость не паузит всех автоматически.
- [ ] На телефоне состав доступен без горизонтального overflow.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-10.02: Управление приглашением и доступом

Как ведущий, хочу прекратить нежелательный вход.

Эпик: E10 · Фаза: P2 · Приоритет: P2

Зависимости: US-10.01

**Фронтенд:** Сделать смену ссылки и удаление участника с подтверждением.

**Бэкенд:** Ротировать token, отзывать участие и закрывать sockets.

**Критерии приёмки:**

- [ ] Старая ссылка не даёт новых входов, существующие участники сохраняются.
- [ ] Удалённый теряет право API/новых URL, сокет закрывается.
- [ ] Доступ по уже выданному URL истекает в пределах пяти минут, ограничения анонимного ban описаны.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.

## US-10.03: Совместное управление и передача роли

Как ведущий, хочу дать друзьям управлять музыкой.

Эпик: E10 · Фаза: P2 · Приоритет: P2

Зависимости: US-10.01, US-10.02

**Фронтенд:** Сделать режим совместного управления и явную передачу роли.

**Бэкенд:** Проверять permission mode и сериализовать конкурентные команды.

**Критерии приёмки:**

- [ ] По умолчанию управляет ведущий, shared включает только он.
- [ ] Конкурентные команды имеют один порядок и проверку revision.
- [ ] Ручная передача оставляет одного ведущего, слушатель не расширяет права сам.

**Проверка:** Проверить критерии выбранным методом из QA; сценарии с аудио проверить на двух независимых устройствах, контракт и гонки — автоматизированно.

**Done:** реализация проверена, критерии приняты, контракт/макет/документы актуальны; создание карточки не означает завершение работы.



---

# QA, план выпуска и риски

## Порядок реализации

Этап 0: договориться о MVP/ролях/лимитах, принять макеты ключевых состояний, утвердить JSON fixtures. Этап 1: frontend shell + Python API/DB + рабочее создание/вход/WS. Этап 2: готовый catalog track, clock probes, play/pause/seek/late join. Этап 3: upload/worker и ошибки, reconnect/host transfer/TTL. Этап 4: browser/mobile/keyboard/security/load QA и demo deploy. Этап 5: реакции/очередь, затем группы. Frontend и backend работают по одним контрактам; готовые mock fixtures позволяют делать UI до API.

Каждый этап имеет gate: 0 — scope+contract; 1 — два отдельных session/context в одной комнате; 2 — 10 минут измеренной синхронизации; 3 — собственный файл и восстановление без дубликатов; 4 — повторяемая демонстрация по HTTPS. P1/P2 не начинать, пока основные gates не пройдены. Оценка времени зависит от состава команды и deadline; даты в YouGile не назначаются автоматически. Сначала вертикальный сценарий, затем покрытие edge cases, затем polish.

## Матрица приёмки

| Проверка | Действие | Ожидаемый результат |
| --- | --- | --- |
| Создание | двойной клик/retry POST с idempotency key | одна комната, ведущий, одна invitation |
| Вход | два параллельных join на последний slot | один успех, один ROOM_FULL |
| Два устройства | host desktop + guest отдельно | один track/mediaVersion, корректные роли |
| Начальный старт | оба разрешили звук и буферизовали | применение в effectiveAt, измерение NFR |
| Autoplay | чистый Safari без разрешения | явная кнопка, нет false-ready и скрытого звука |
| Play/pause/seek | host0→30→pause→resume→конец | единый timeline, сохранение playing/paused, end0 при replay |
| Pending | два control подряд | один transition, второй PENDING_TRANSITION без потери state |
| Поздний вход | guest на 45-й секунде | догоняет current target, не перезапускает host |
| Buffering | замедлить download гостя | локальная загрузка, host продолжает, hard-align после готовности |
| Reconnect | offline10 с и 60 с | через 3 с локальная пауза; fresh snapshot, нет replay старой команды |
| Ведущий offline | disconnect, возврат в grace/после | до transfer прежняя роль, после — новый host, один host |
| Вкладки | открыть комнату дважды одной cookie | замена connection, старый звук остановлен |
| Sleep/mobile | background/lock/resume | честное degraded state, повтор clock probes/align |
| Race | одинаковые/устаревшие commands | receipt idem, revision conflict, один state change |
| Security | guest raw WS host action, чужой track, bad Origin | сервер отклоняет, данные/URL не раскрываются |
| Upload | valid MP3/WAV/M4A + corrupt/oversize/long | один ready asset или конкретная ошибка без повреждения current track |
| Worker | повтор задачи/timeout/restart | idempotent, bounded resources, API responsive |
| Signed URL | истёк URL при seek | refreshed same asset, не новый track |
| Close/TTL | host close,24 ч lifetime,30 мин empty | terminal state, no resurrection, assets cleanup в срок |
| API restart | playing + pending | документированная общая пауза, epoch reset, можно продолжить |
| DB/storage outage | временно отключить | нет false ACK/ready, 503/ошибка и recover |
| UI | 360/390/768/1024/1440 и 200% zoom | readable, no horizontal overflow, controls reachable |
| Accessibility | keyboard+screen reader | focus visible, dialogs managed, roles/statuses озвучиваются |

## Как измерять синхронизацию

Использовать контрольный трек с короткими звуковыми импульсами и одинаковый нормализованный asset. В foreground после 3 секунд стабилизации сэмплировать currentTime/target на обоих клиентах каждые 100 мс в тестовом режиме, timestamps привести к server clock, интерполировать на общий момент. Считать pairwise |positionA-positionB| и p50/p95/max, отдельно offset confidence, RTT, correction counts. Периоды buffering/seek и запрещённого autoplay не скрывать: отдельно их продолжительность/доля, в steady-state percentile не включать только при явной маркировке. Результат с currentTime — приближение позиции, не доказательство одинакового акустического выхода.

Минимум 3 прогона по 10 мин для desktop пары и desktop/mobile. NFR≤150 мс desktop и≤300 мс mixed проверять отдельно на RTT≤200/jitter≤50; slow network — отдельный профиль. Для акустической проверки записать оба устройства внешним рекордером на проводном выводе/одинаковых динамиках и сопоставить импульсы. Bluetooth latency сообщить как ограничение; не подгонять цифры отбрасыванием неудобных платформ. Если цели не достигнуты, измерения и фактическое ограничение записать до выпуска.

## Нагрузка и эксплуатация

Python load test или k6 как dev-инструмент:100 комнат/200 sockets, snapshots/heartbeat/control, плюс 2 uploads. Записать CPU/RAM/hardware и network,30 мин нагрузка; API p95≤300 мс, без unbounded queues/connection leaks, FFmpeg не блокирует event loop. Синтетические WS клиенты не проверяют звук; нужен отдельный browser тест. Проверить graceful disconnect и восстановление outbox, worker queue после restart, cleanup и restore backup.

CI: frontend type/lint/build + meaningful unit/integration; Python lint/type/domain/API/contract; миграции на fresh PostgreSQL; integration services; Playwright happy path с 2contexts. Export схемы API и проверить TS fixtures. Тестовые аудио должны быть маленькими и с подтверждённым разрешением. Проверки секретов, dependencies и контейнеров перед release.

## Риски и решения

| Риск | Решение / доказательство |
| --- | --- |
| Браузер блокирует autoplay/фон | explicit gesture, честные локальные статусы, real Safari QA |
| Устройства имеют разные audio latency | цели по timeline, отдельно acoustic test; компенсация hardware вне MVP |
| Clock offset inaccurate | low RTT probes, epoch/monotonic, коррекция, degraded status |
| CPU transcoding перегружает API | отдельный worker, quotas/timeouts/resource limits |
| Multi-worker теряет room state |1 API process MVP; distributed ownership до масштабирования |
| WS события теряются/дублируются | revision, receipts, outbox, snapshots |
| Внешний streaming недоступен | prepared assets/upload; интеграции отдельный проект |
| Команда не успевает | этапы/gates, defer P1/P2, не ослаблять основной sync сценарий |
| Неясны права на demo music | только материалы с подтверждённым разрешением, хранить источник/условия; не утверждать автоматически, что любой upload законен |

## Demo и Definition of Ready/Done

Demo3–5 мин: создать комнату → скопировать invite → открыть другим устройством → выбрать track → совместный старт → pause/seek → latejoin/reconnect → загрузить файл → закончить. Подготовить резервный local demo и видео, но не подменять живой сценарий видео без объяснения. README запуска и env example обновить после появления кода.

Story Ready: понятная роль/ценность, dependencies приняты, контракт/макет есть, критерии измеримы, owner из команды назначен человеком. Story Done: поведение и ошибки реализованы, соответствующий meaningful test/ручная проверка пройдены, код проверен другим участником, contract/docs актуальны, нет критического regression. Общий MVP Done — в продуктовой спецификации. При переносе в YouGile все stories в backlog, не выполнены; оценки и исполнители не выдумываются.


