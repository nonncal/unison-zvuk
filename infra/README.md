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

## Запуск локально

```bash
python3 infra/configure.py --output ../unison-runtime/docker
docker compose --env-file ../unison-runtime/docker/compose.env \
  -p unison -f compose.yaml -f compose.app.yaml up --build -d --wait
python3 infra/smoke.py --grafana-password-file ../unison-runtime/docker/grafana.password
```

Приложение на http://localhost:8080, Grafana на :3000 (пароль в `grafana.password`), Prometheus на :9090; все порты только на `127.0.0.1`. Открывайте приложение именно по `APP_ORIGIN`: он участвует в проверках CSRF и WebSocket. Первый запуск дольше: MinIO собирается из исходников. `compose.test.yaml` нужен только CI: он поднимает лимиты запросов для тестов.

## Деплой на сервер

Нужны VPS с Docker Compose 2.24.4+, домен, настроенный на сервер, открытые 80/443 и SSH. Обычный статический хостинг не подойдёт: нужны PostgreSQL и обработчик аудио. Начните с 4 CPU, 8 ГБ RAM и запаса диска под аудио и резервные копии.

1. Склонируйте репозиторий на сервер и создайте ключи вне checkout:
   ```bash
   python3 infra/configure.py --output /srv/unison-runtime --origin https://music.example.com
   ```
2. Положите **настоящие файлы** (не символические ссылки) сертификата и ключа с правами `600` и настройте автопродление:
   `/srv/unison-runtime/tls/fullchain.pem`, `/srv/unison-runtime/tls/privkey.pem`. После продления обновите файлы и выполните `docker compose ... exec frontend nginx -s reload`.
3. Проверьте конфигурацию и запустите:
   ```bash
   docker compose --env-file /srv/unison-runtime/compose.env -p unison \
     -f compose.yaml -f compose.app.yaml -f compose.production.yaml config --quiet
   docker compose --env-file /srv/unison-runtime/compose.env -p unison \
     -f compose.yaml -f compose.app.yaml -f compose.production.yaml up --build -d --wait
   curl --fail https://music.example.com/health/ready
   ```
4. Проверьте на двух независимых устройствах по HTTPS: вход по ссылке, общий пуск, загрузку файла.

Серверный `compose.production.yaml` закрывает наружные порты PostgreSQL, Redis, MinIO, API и Prometheus; Nginx публикует только 80 и 443 и перенаправляет HTTP на HTTPS. Grafana остаётся на loopback: `ssh -L 3000:127.0.0.1:3000 user@server`. Порт API нельзя публиковать отдельно: он доверяет заголовкам прокси внутри Docker-сети. Один процесс API держит состояние комнат, поэтому масштабировать его репликами нельзя.

**Обновление:** сделайте резервную копию, переключите checkout на проверенный коммит и выполните ту же команду `up --build -d --wait` с тем же `-p`, env и набором `-f`. Миграции идут до запуска API, будет короткий перерыв. Для остановки используйте `stop` или `down` без `-v`: `-v` удалит данные.

**Резервная копия и восстановление:**
```bash
python3 infra/backup.py --env-file /srv/unison-runtime/compose.env --project unison --production backup /srv/unison-backups/2026-10-15
python3 infra/backup.py --env-file /srv/unison-runtime/compose.env --project unison-restored --production restore /srv/unison-backups/2026-10-15
```
Копия коротко останавливает приложение, сохраняет PostgreSQL и том аудио с контрольными суммами. Восстанавливайте только в новый проект с прежними ключами; скрипт откажется перезаписывать непустые данные. Папку `/srv/unison-runtime` храните отдельно и защищённо: без ключей сессий и приглашений копия БД не поможет.

## Безопасность обработки аудио

Загруженный файл разбирает контейнер `transcoder`: без сети, под `bwrap`, с лимитами процессора, памяти, времени и размера результата и с профилем seccomp. Он видит только файл текущей задачи. Воркер и транскодер обмениваются файлами через ограниченный общий том, доступ к Docker socket не нужен.

## Мониторинг и журналы

- `/internal/metrics` отдаёт метрики Prometheus по ключу `METRICS_TOKEN` (без ключа выключен). Правила оповещений в `monitoring/alerts.yml`, дашборд Grafana в `monitoring/grafana/`.
- Журналы приложения лежат в томе `logs-data` (`api.jsonl`, `worker.jsonl`): категории событий, случайный requestId и тип исключения. Имена, аудио и заголовки не пишутся. Файлы хранятся 7 дней.

## Если контейнеры не стартуют

- `password authentication failed for user "unison"` у `migrate`: том PostgreSQL помнит пароль первого запуска, а `configure.py` каждый раз создаёт новый. Используйте один и тот же `compose.env` или удалите тома (`docker compose -p <проект> down -v` сотрёт данные комнат).
- Порты 8080, 5432, 6379, 9000 должны быть свободны, Docker Desktop нужно ≥ 4 ГБ памяти: MinIO собирается из исходников.
