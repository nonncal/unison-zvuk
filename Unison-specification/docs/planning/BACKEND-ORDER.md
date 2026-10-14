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

После2 — схемы и fixtures; после4 — create/join/invite/errors; после5 — hello/snapshot/presence; после6 — реальные tracks и URLs; после7 — clock и commands; после8 — recovery/roles/TTL; после9 — upload statuses; после12 — HTTPS origin и измеренный отчёт. Нельзя менять units/role rules без обновления схем и общего fixture.
