# Инфраструктура

Всё, что нужно, чтобы запустить Unison целиком: Compose-файлы лежат в корне репозитория, здесь конфигурации сервисов и скрипты.

## Состав

| Что | Где |
| --- | --- |
| Генерация ключей вне репозитория | `configure.py` |
| Проверка работающего стека | `smoke.py` |
| Резервная копия и восстановление PostgreSQL и аудио | `backup.py` |
| Nginx: статика, прокси API, WebSocket и S3, заголовки безопасности | `nginx/` |
| Prometheus, правила оповещений, Grafana | `monitoring/` |
| MinIO из закреплённого исходного релиза | `minio/` |
| Профиль seccomp для транскодера | `transcoder/seccomp.json` |

Compose-файлы в корне: `compose.yaml` (сервисы), `compose.app.yaml` (фронтенд и Nginx), `compose.test.yaml` (порты на localhost для проверок), `compose.production.yaml` (HTTPS), `compose.load.yaml` (нагрузка).

## Запуск

См. [docs/DEPLOYMENT.md](../docs/DEPLOYMENT.md): локальный запуск в контейнерах, HTTPS на сервере, мониторинг, резервные копии и восстановление.

```bash
python3 infra/configure.py --output ../unison-runtime/docker
docker compose --env-file ../unison-runtime/docker/compose.env \
  -p unison -f compose.yaml -f compose.app.yaml up --build -d --wait
python3 infra/smoke.py --help
```

## Безопасность обработки аудио

Загруженный файл разбирает контейнер `transcoder`: без сети, под `bwrap`, с лимитами процессора, памяти, времени и размера результата и с профилем seccomp. Он видит только файл текущей задачи. Воркер и транскодер обмениваются файлами через ограниченный общий том, доступ к Docker socket не нужен.

## Мониторинг и журналы

- `/internal/metrics` отдаёт метрики Prometheus по ключу `METRICS_TOKEN` (без ключа выключен). Правила оповещений в `monitoring/alerts.yml`, дашборд Grafana в `monitoring/grafana/`.
- Журналы приложения лежат в томе `logs-data` (`api.jsonl`, `worker.jsonl`): категории событий, случайный requestId и тип исключения. Имена, аудио и заголовки не пишутся. Файлы хранятся 7 дней.

## Если контейнеры не стартуют

- `password authentication failed for user "unison"` у `migrate`: том PostgreSQL помнит пароль первого запуска, а `configure.py` каждый раз создаёт новый. Используйте один и тот же `compose.env` или удалите тома (`docker compose -p <проект> down -v` сотрёт данные комнат).
- Порты 8080, 5432, 6379, 9000 должны быть свободны, Docker Desktop нужно ≥ 4 ГБ памяти: MinIO собирается из исходников.
