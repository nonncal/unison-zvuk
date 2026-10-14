# README: flow Python-бэкенда Unison

Сначала пошаговый план реализации с условиями готовности, затем подробные потоки и технические правила. [Полная спецификация](../spec/README.md), [дизайн-промпт](../design/README.md).

# Порядок реализации Python-бэкенда

Python + FastAPI + Uvicorn + Pydantic + PostgreSQL + SQLAlchemy async + Alembic. Redis/Celery для обработки; S3/MinIO для аудио. В MVP один API-процесс; отдельный worker. Node.js не используется для серверной логики.

## 1. Окружение — US-01.01

Создать pyproject/uv lock, FastAPI lifespan, config, structured logger, live/ready health. Поднять Compose PostgreSQL/Redis/MinIO, один API и worker. Настроить Ruff и typing, env example без секретов. **Готово:** clean setup и проверки здоровья проходят, API не зависит от пользовательских путей.

## 2. Контракт до обработчиков — US-01.02

Описать DTO HTTP/WS, ошибки, поля времени и version1. Экспортировать OpenAPI/JSON Schema, согласовать fixtures с фронтендом. **Готово:** Python и TS принимают одни и те же сообщения, неизвестные поля и невалидные числа отвергаются.

## 3. Данные и транзакции — US-01.03

Создать Session/Room/Participant/Playback/Track/Asset/Upload/Receipt/Outbox и миграции. Реализовать repositories, room lock и idempotency. **Готово:** миграции проверены на PostgreSQL, state/receipt/outbox атомарны, один участник на room/session и один ведущий.

## 4. Создание, ссылка и вход — US-02.01…US-02.03

Создавать гостевую session cookie, room, host и секрет invitation. Сделать preview/join/GET room/invite с membership, TTL/capacity. Поставить Origin/CSRF/rate limit сразу. **Готово:** две sessions входят, invite не даёт host, concurrent join на последний слот не превышает capacity, create retry идемпотентен.

## 5. WebSocket и присутствие — US-02.04, US-05.02

Handshake auth, hello/snapshot, connection generation, отдельные reader/writer, queue bound, heartbeat, readiness и presence sequence. **Готово:** два клиента видят роли/готовность, reconnect не создаёт лишнее участие, старый disconnect не убивает новый socket.

## 6. Каталог и готовое аудио — US-03.01, US-03.04

Подготовить шесть tracks, metadata, разрешения использования, immutable assets. Реализовать authorized download URL, Range/CORS, track scope. **Готово:** оба клиента получают один asset, чужой или неготовый track закрыт, URL истекает/обновляется корректно.

## 7. Clock и domain playback — US-04.01…US-04.03

Сначала проверить чистыми domain tests timeline/effectiveAt/seek/pending/revision. Затем подключить WS commands: host check, expected revision, receipt, readiness decision, lead, commit/outbox/ACK. **Готово:** обычный play/pause/seek согласованы, duplicate не создаёт новое изменение, stale/pending отвергаются.

## 8. Snapshot, конец и восстановление — US-04.04…US-04.06, US-05.01, US-05.03, US-05.04

Периодические snapshot, scheduler конца с revision check, late join, offline grace, host transfer, close/TTL, startup recovery и epoch reset. **Готово:** ведущий передаётся однозначно, restart приводит к документированной паузе, overdue transition не теряется, закрытая комната не оживает.

## 9. Загрузка и отдельный worker — US-03.02, US-03.03

Reservation/PUT/complete с quota и HEAD-проверкой; Celery job, bounded FFprobe/FFmpeg, нормализованный MP3/hash, ready/failed outbox. **Готово:** валидный файл ready, повреждённый/длинный failed, повтор job идемпотентен, API responsive во время обработки.

## 10. Ограничения и очистка — US-07.01, US-07.02

Проверить все endpoint/WS resource permissions, cookies/CSRF/Origin, URL lifetime и логирование. Cleanup abandoned uploads, room assets, expired sessions/receipts, catalog exemption. **Готово:** quotas невозможно обойти подменой metadata, cleanup проверен fake clock, секретов в логах нет.

## 11. Диагностика и CI — US-07.03, US-08.01

Метрики HTTP/WS/worker/drift/RTT и агрегаты, meaningful domain/API/DB/worker/contract tests. Outbox retry, bounded queues и corruption scenarios. **Готово:** CI воспроизводим, отклонения и зависший worker обнаруживаются, race tests проходят на PostgreSQL.

## 12. Нагрузка, развёртывание и demo — US-08.02…US-08.04

Проверить 100 комнат/200 WS и два uploads, зафиксировать hardware/p95/RAM. Настроить HTTPS/WSS, миграции, backup/restore, one-process deployment. Совместно с фронтендом измерить звук и подготовить демонстрацию. **Готово:** работающее demo, фактические ограничения записаны, инструкции запуска/восстановления проверены.

## После MVP

Сначала реакции и queueRevision/порядок, затем server next-track, потом capacity10 и управление доступом. Перед несколькими API-процессами добавить distributed room ownership, общую presence/readiness и надёжное восстановление state; один Redis Pub/Sub этого не обеспечивает. Celery можно масштабировать независимо.

## Что передавать фронтенду по этапам

После 2 — схемы и fixtures; после 4 — create/join/invite/errors; после 5 — hello/snapshot/presence; после 6 — реальные tracks и URLs; после 7 — clock и commands; после 8 — recovery/roles/TTL; после 9 — upload statuses; после 12 — HTTPS origin и измеренный отчёт. Нельзя менять units/role rules без обновления схем и общего fixture.


---

# Backend flow — Python / FastAPI

Самостоятельный документ для Python-команды. Детальные схемы: [API/WS](../03-API-WS.md); правила timeline: [архитектура](../02-ARCHITECTURE.md). Задача сервера — авторитетное состояние комнаты и безопасность; точный момент звука выполняет клиент.

## Организация кода

`app/main.py` lifespan и health; `api/` HTTP routers; `ws/` connection manager, reader/writer, schemas; `domain/` rooms/playback/roles; `services/` clock/storage/uploads; `db/` SQLAlchemy models/repositories; `workers/` Celery audio/cleanup; `tests/` domain/integration/contract. Pydantic Settings для конфигурации, Alembic для схем. На запрос/задачу отдельный AsyncSession; одну session не разделять между конкурентными coroutines. Sync SDK storage вызывать через threadpool или использовать проверенный async SDK.

## Flow 1: создание / вход

```text
HTTP create → validate + rate limit + idempotency → transaction
   → session + room + host participant + invite secret/hash + empty playback
   → commit → set HttpOnly cookie → snapshot + invite URL

HTTP join → session/create guest + hash invite → lock room
   → проверить active/TTL + reserved capacity + existing participation
   → выделить один слот или reuse → commit → snapshot
```

Третьему человеку вернуть ROOM_FULL. Пара конкурентных joins не может занять последний слот дважды. Повтор join одной session не создаёт лишнего пользователя. Participant определяется по cookie; отправленный role игнорируется/запрещён схемой. Invite позволяет только listener. Все room/track endpoints проверяют membership и допустимую scope файла.

## Flow 2: WS

Handshake → Origin/session/member/room validation → increment connectionGeneration → закрыть старое подключение участника → hello+snapshot → пара reader/writer tasks → heartbeat. Send только через один writer, timeouts и bounded queue. При disconnect очистить readiness/presence только если это текущая generation. Новое подключение не уничтожать late-disconnect событием старого socket.

Clock probe принимает client timestamp, отвечает server receive/send timestamps. Readiness привязывать к текущему track/mediaVersion и соединению, expire вместе с heartbeat. Telemetry не становится state mutation. Ping каждые 5 с, offline после 15 с. ServerTimeMs вычислять из process monotonic anchor, проверять дрейф host clock.

## Flow 3: общий playback

Валидировать Pydantic schema → rate limit → resolve actor → транзакция с `SELECT FOR UPDATE` room/playback → проверить current host, active status, expected revision, receipt, track ready и позицию → выбрать lead/effectiveAt → записать pending/committed состояние + increment revision + receipt + outbox → commit → ACK → broadcast outbox. Duplicate requestId проверяется до revision conflict, чтобы честный retry возвращал прежний ACK; несовпадение payload не допускается.

Для select: paused, position0, track/mediaVersion меняются сразу; broadcast после commit. Play: если ended использовать position0; если paused продолжить с position; готовность проверяется, при NOT_ALL_READY состояние не меняется. Ведущий повторяет с allowNotReady после явного решения UI. Pause target вычислить по прежнему timeline на effectiveAt; seek заменяет позицию в effectiveAt, статус сохраняется кроме duration→ended. При pending новый control отвергать; после effectiveAt promotion выполнять лениво при чтении/команде и scheduler, idempotent под lock без новой revision.

Scheduler конца track планирует deadline по timeline, повторно сверяет revision/track/epoch в транзакции, устанавливает ended и outbox. При pause/seek отменить устаревший timer. На startup восстановить просроченные transitions и перевести playing в paused с epoch reset; не выдумывать точность после restart.

## Flow 4: загрузка и аудио

Reservation: validate size/ext/MIME/quota и роль → уникальный objectKey без пользовательского path → DB upload → signed PUT. Complete: HEAD object для actualSize/contentType/checksum → проверить quota атомарно → mark processing + enqueue job через outbox → вернуть 202. Нельзя доверять заявленным fileName/duration или самому факту upload complete.

Python worker: скачать bounded исходник → FFprobe с timeout → проверить контейнер/реальный аудиопоток/длительность≤15 мин/отсутствие DRM → FFmpeg в изолированной рабочей директории, без shell interpolation и сетевого доступа → MP3, 44,1 kHz, stereo, 192 kbps → вычислить hash/duration и загрузить immutable asset → транзакция ready + track.updated outbox. Не использовать произвольные URL как input. Санитизировать title/artist, ограничить текст, при отсутствии metadata использовать безопасное имя файла без расширения. В WAV допустимо большое исходное потребление, лимит размера действует до decode.

Timeout job120 с, max output100 MiB, worker concurrency1–2 и лимиты CPU/RAM/temp disk; transient failures retry2 с backoff, повреждённые файлы без retry. FFmpeg subprocess через аргументы, no shell; запрет protocol кроме file/pipe и отключённая сеть контейнера обработки. Не выполнять uploaded file. Job idempotent: один ready asset на upload, crash между upload/commit не создаёт бесконечно новые assets, orphan cleanup. Celery redelivery не считается exactly-once.

Catalogue: ≥6 prepared tracks c metadata/cover/license/source; уже нормализованные, ready. Они не расходуют room upload quota. Пользовательские треки доступны только своей комнате. Подписанные ссылки обновляются по авторизованному HTTP; storage поддерживает GET Range/206, корректный Content-Type и CORS только нужного origin.

## Flow 5: выход / роли / очистка

Leave: lock room → invalidate участие → немедленный выбор нового ведущего из online participants по joinedAt/id → role event + snapshot. Offline: lastSeen timeout → grace30 с → тот же выбор, если старый host всё ещё offline. Возврат в grace восстанавливает host, после transfer возвращается listener. Если никто online, не назначать несуществующего host, ожидать разрешённого reconnect; первый допустимый online участник получает роль под lock. Закрытие комнаты: host check → closed → cancel timers → final event → sockets close → cleanup schedule.

Empty room: emptySince когда нет online после учета grace, expires через 30 мин; hard expiresAt24 ч независимо от участия. Cleanup idempotent: abandoned uploads через 1 ч; пользовательские assets и metadata не позднее 24 ч после закрытия; invite/session/receipts по TTL. Catalog нельзя удалять при cleanup комнаты. В cleanup логировать агрегаты, не file content или invite.

## Конфигурация и эксплуатация

APP_ORIGIN, DATABASE_URL, REDIS_URL, SESSION_SECRET/INVITE_ENCRYPTION_KEY, S3_ENDPOINT/BUCKET/ACCESS_KEY/SECRET_KEY, UPLOAD limits, TTL, WS timing, FFmpeg timeouts. `.env.example` только с placeholders, секреты в env/secret store. Structured logs с requestId/roomId hashed, метрики HTTP/WS/DB/worker queue depth/drift aggregate. Аудио, cookie, invitation fragment и signed URLs не логировать. Системы аналитики не получают исходные файлы/имена.

MVP run: 1 API Uvicorn process + 1 Celery worker + PostgreSQL + Redis + MinIO/reverse proxy через Compose. API остаётся responsive во время transcoding. `--workers >1` запрещён до реализации distributed presence и room ownership. Миграции отдельным release step перед API. Rolling restart MVP вызывает документированную общую паузу, после которой ведущий продолжает.

Тесты Python: timezone/offset math, authorization и state transitions, row lock race joins/commands, receipt idempotency, expiry, late generation disconnect, worker duplicate/corrupt/oversize, DB outage, outbox retry. Интеграционные tests на PostgreSQL/Redis/S3, а не только SQLite: блокировки и типы различаются. Результат: reproducible run, API contracts, healthy WS, проверенные quotas/cleanup, worker вне event loop, фактические нагрузочные показатели.
