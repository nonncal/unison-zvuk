# Unison: бэкенд

Python 3.13, FastAPI, Pydantic, SQLAlchemy 2 (async) и Alembic, PostgreSQL, Redis, Celery, S3 (MinIO). Один процесс API владеет комнатами, отдельный воркер обрабатывает загруженное аудио.

```text
app/api         HTTP-маршруты (комнаты, загрузки, обложки, текст песен, социальные функции)
app/ws          WebSocket: соединения, heartbeat, часы, рассылка событий
app/domain      правила комнаты, плеера, очереди, медиа
app/services    хранилище, обработка, очистка, метрики, каталог, текст песен
app/workers     воркер Celery и транскодер
app/contracts   схемы HTTP и WebSocket (источник контрактов)
catalog/        подборка музыки с тестами прав и текстами песен
migrations/     Alembic
contracts/      сгенерированные JSON-схемы и общие примеры
```

## Запуск для разработки

Нужны Docker Compose, Python 3.13 и [uv](https://docs.astral.sh/uv/).

```bash
mkdir -p ../../unison-runtime && chmod 700 ../../unison-runtime
uv sync --frozen
uv run python -m app.config --write-env ../../unison-runtime/local.env
cd .. && docker compose --env-file ../unison-runtime/local.env up --build -d
docker compose --env-file ../unison-runtime/local.env run --rm api uv run --no-sync python -m app.init_storage
docker compose --env-file ../unison-runtime/local.env run --rm worker /app/.venv/bin/python -m app.init_catalog
```

API на http://localhost:8000, описание на `/api/reference`, проверки `/health/live` и `/health/ready`. Миграции выполняет сервис `migrate`. Команда `init_catalog` повторяема. Для запуска без контейнера API:

```bash
UNISON_ENV_FILE=../../unison-runtime/local.env uv run uvicorn app.main:create_app --factory --workers 1 --no-access-log
```

Перед изменяющими запросами клиент получает `/api/v1/bootstrap` (анонимная HttpOnly-сессия и `csrfToken`), затем шлёт точный `Origin` и `X-CSRF-Token`. Создание комнаты требует `Idempotency-Key`. Поля на проводе в camelCase, неизвестные поля отклоняются. `APP_ORIGIN` должен совпадать с адресом браузера.

## Аудио

Загрузка идёт подписанным PUT в S3 с проверкой размера, типа и запретом перезаписи. Воркер передаёт файл транскодеру, который выдаёт MP3 256 кбит/с CBR, 44,1 или 48 кГц, stereo, с запасом по уровню −1,5 дБ и мягким ограничителем против клиппинга. Из тегов берутся название, исполнитель, обложка и текст песни. Обработка восстанавливается после сбоя (до трёх попыток), результат старой попытки не меняет состояние. Незавершённые загрузки удаляются через час, файлы закрытой комнаты через 24 часа; каталог сохраняется.

## Каталог музыки

В `catalog/` девять записей CC0 / public domain: шесть узнаваемых произведений классики и три песни с текстом. `manifest.json` хранит источники, права и хэши; тесты проверяют целостность.

| Песня | Как подан текст | Основание использования записи |
| --- | --- | --- |
| Тихая ночь (Silent Night), Catharine Eastman | `lyrics/silent-night-eastman.lrc` с таймкодами | [CC0](https://commons.wikimedia.org/wiki/File:Silent_Night_Librivox_2009.ogg) |
| Старое доброе время (Auld Lang Syne), Bautsch | `lyrics/auld-lang-syne-bautsch.txt` без таймкодов | [CC0](https://commons.wikimedia.org/wiki/File:AuldLangSyne.ogg) |
| Amazing Grace, Southern Aire (оркестр ВВС США) | текст с таймкодами в теге MP3 (`USLT`) | [Public domain](https://commons.wikimedia.org/wiki/File:Amazing_Grace_(vocalist_with_guitar)_-_Southern_Aire_-_United_States_Air_Force_Reserve_Band.mp3) |

Тайминги «Тихой ночи» и Amazing Grace построены по этим записям распознаванием речи и паузами; третий куплет «Тихой ночи» выровнен по шагу припева и на слух не сверен. Как устроен текст песен: [docs/KARAOKE.md](../docs/KARAOKE.md).

Записи перекодированы в MP3 192 кбит/с, 44,1 кГц, `loudnorm`. Для первых пяти записей `sourceDownloadUri` указывает на исходник; для Баха использована полная общедоступная версия со страницы исполнителя. `LicenseRef-Public-Domain` в манифесте означает передачу записи в общественное достояние, а не CC0. Все композиторы и авторы текстов умерли до 1926 года. Фронтенд копирует аудио и метаданные для деморежима командой `npm run audio:generate`.

## Проверки

```bash
uv run ruff check app tests migrations
uv run ruff format --check app tests migrations
uv run mypy app tests
uv run pytest
```

Интеграционные проверки используют отдельные схемы локальной базы: поднимите PostgreSQL и укажите `UNISON_ENV_FILE=...`. Проверка всей цепочки загрузки и изоляции транскодера:

```bash
UNISON_ENV_FILE=../../unison-runtime/local.env UNISON_SYSTEM_URL=http://localhost:8000 uv run pytest tests/system/test_audio_pipeline.py
UNISON_TRANSCODER_CONTAINER=unison-local-transcoder-1 uv run pytest tests/system/test_transcoder_isolation.py
```

## Контракты

Pydantic задаёт схемы HTTP и WebSocket версии 1. TypeScript-типы и валидаторы генерируются из тех же схем, общие JSON-примеры проверяются с обеих сторон. После изменения моделей:

```bash
UNISON_ENV_FILE=../../unison-runtime/local.env uv run python -m app.contracts.export --output contracts
cd ../frontend && npm run contracts:generate && npm run contracts:check && npm run contracts:test
```

## Нагрузка

Отдельный Compose-проект с `compose.load.yaml` (случайные порты, свои тома, 2 CPU и 2 ГиБ для API; повышенные лимиты только в этом профиле):

```bash
uv run python -m benchmarks.load --base-url http://localhost:PORT --rooms 100 --seconds 1800 --project unison-load --report ../../unison-runtime/load/result.json
```

Сценарий открывает 200 WebSocket, выполняет clock probes, heartbeat, play/pause/seek и параллельную загрузку. Он измеряет сервер и транспорт; слышимую синхронизацию проверяйте на независимых устройствах (см. [docs/SYNC-BENCHMARK.md](../docs/SYNC-BENCHMARK.md)).
