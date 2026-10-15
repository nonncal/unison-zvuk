# Docker: запуск, публикация и восстановление

Полный стек: React → Nginx → один FastAPI-процесс, PostgreSQL 17, Redis,
приватный MinIO, Celery и отдельный FFmpeg transcoder без сети, Prometheus и Grafana.
Миграции, создание bucket и шести демонстрационных треков выполняются автоматически.
Первый запуск дольше последующих: MinIO собирается из закреплённого исходного релиза.

Нужны Docker Engine с Compose **2.24.4+** (поддержка `!override`) и Python **3.10+**
для генерации конфигурации и резервного копирования. Для работы контейнеров
установка Python/Node/uv на хосте не требуется. Сборка поддерживает amd64/arm64;
на сервере используются Linux, tmpfs и seccomp. Начните с 4 CPU, 8 ГБ RAM
и диска с запасом для аудио, сборок и резервных копий; уточните ресурсы нагрузочным тестом.

## Локально: всё в контейнерах

Из корня физического checkout, без `::` в пути:

```bash
python3 infra/configure.py --output ../unison-runtime/docker
docker compose --env-file ../unison-runtime/docker/compose.env \
  -p unison -f compose.yaml -f compose.app.yaml up --build -d --wait
```

Конфигурация создаётся однократно вне Git; существующая папка не перезаписывается.
Не используйте вместо неё `backend/.env.example`: в нём фиктивные ключи.

| Адрес | Что доступно |
| --- | --- |
| http://localhost:8080 | React, API, WebSocket и подписанные аудиофайлы |
| http://localhost:8080/api/reference | Описание API |
| http://localhost:8080/health/ready | Готовность приложения и зависимостей |
| http://localhost:3000 | Grafana: пользователь `admin`, пароль в `grafana.password` |
| http://localhost:9090 | Prometheus: targets, правила и активные alerts |

Все опубликованные локальные порты привязаны к `127.0.0.1`. Отдельные порты
8000/5432/6379/9000/9001 сохранены для инструментов разработки.
Открывайте приложение именно по `APP_ORIGIN`, а не через другой вариант имени/IP:
Origin участвует в проверках CSRF и WebSocket.

```bash
python3 infra/smoke.py --grafana-password-file ../unison-runtime/docker/grafana.password
docker compose --env-file ../unison-runtime/docker/compose.env \
  -p unison -f compose.yaml -f compose.app.yaml ps
```

Базовый `compose.yaml` по-прежнему позволяет отдельно запускать backend-сервисы
для Vite и существующих нагрузочных сценариев. Для изменения порта полного стека
задайте нужный `--origin` при генерации, например `http://localhost:8081`.
`compose.test.yaml` используется только CI/выделенными функциональными тестами:
он увеличивает лимиты запросов для многократных сценариев с одного IP.
При обычном запуске и на сервере этот файл не подключается.
Интеграционные fixtures создают временные bucket: для них задайте в окружении
тестового процесса `S3_PUBLIC_ENDPOINT=http://localhost:9000` (как в CI).
Для системной проверки публичного S3-прокси задайте `UNISON_PROXY_URL=http://localhost:8080`;
эта проверка использует основной bucket и не требует обхода Nginx.

## Сервер: HTTPS/WSS

Нужен VPS/сервер с Docker, доменом и TLS-сертификатом. Обычный статический хостинг
не запускает PostgreSQL и обработчики аудио. Настройте DNS домена на сервер,
откройте TCP 80/443 и SSH. Не запускайте серверный экземпляр с одним базовым Compose.

```bash
python3 infra/configure.py --output /srv/unison-runtime \
  --origin https://music.example.com
```

Замените пример своим доменом. Получите сертификат через хостинг или ACME-клиент
(например, [Certbot](https://certbot.eff.org/)). Разместите **настоящие файлы**
сертификата и ключа по путям:

```text
/srv/unison-runtime/tls/fullchain.pem
/srv/unison-runtime/tls/privkey.pem
```

Ключ должен быть доступен только владельцу (`chmod 600`). Если источник —
`/etc/letsencrypt/live/...`, скопируйте содержимое файлов, а не символические ссылки:
Nginx видит только примонтированную папку `tls`. Настройте автоматическое продление
сертификата; после продления обновляйте оба файла и выполняйте `exec frontend nginx -s reload`
с теми же параметрами Compose. При standalone-проверке ACME нужен свободный порт 80;
удобнее DNS-проверка или сертификат, управляемый хостингом.

```bash
docker compose --env-file /srv/unison-runtime/compose.env -p unison \
  -f compose.yaml -f compose.app.yaml -f compose.production.yaml config --quiet
docker compose --env-file /srv/unison-runtime/compose.env -p unison \
  -f compose.yaml -f compose.app.yaml -f compose.production.yaml \
  up --build -d --wait
curl --fail https://music.example.com/health/ready
```

Серверный overlay закрывает наружные порты PostgreSQL, Redis, MinIO, API и Prometheus.
Nginx публикует только 80/443 и перенаправляет HTTP на HTTPS. Grafana остаётся
на loopback; откройте SSH-туннель `ssh -L 3000:127.0.0.1:3000 user@server`,
затем зайдите на http://localhost:3000. Закрытые `/internal`, `/metrics`, `/minio`,
`/grafana` и `/prometheus` возвращают 404 через публичный Nginx.

`APP_ORIGIN` и `S3_PUBLIC_ENDPOINT` равны `https://music.example.com`.
S3 проксируется по исходному пути `/<bucket>/<key>`, без добавленного `/media`:
host и path входят в подпись. Сохраняются `Range`, CORS и условный PUT;
bucket остаётся приватным. Nginx ограничивает аудиозагрузку 50 МиБ, JSON API — 64 КиБ.
Схемы `/api` и `/ws` не переписываются; Uvicorn запускается одним процессом.
Nginx заменяет входные forwarded-заголовки адресом клиента; API доверяет прокси
внутри Docker-сети, поэтому его порт нельзя публиковать отдельно на сервере.

Сохраните `/srv/unison-runtime` в защищённом хранилище отдельно от checkout.
Потеря ключей сессии/приглашений и S3-ключей не исправляется восстановлением одной БД.
Файлы секретов мониторинга читаются контейнерами; родительская папка имеет права 0700.
Не публикуйте вывод `docker compose config` без `--quiet`: там есть значения environment.

## Метрики и журналы

Prometheus собирает `/internal/metrics` API с bearer-токеном из Docker secret,
а также собственные метрики. Retention: 30 дней, максимум 2 ГБ данных метрик.
Дашборд **Unison — приложение и аудио** и datasource создаются автоматически:
доступность, HTTP p95, WS/комнаты, очередь и обработка аудио, дрейф и alerts.
Без событий воспроизведения график дрейфа может быть пустым.
Существующие audio-alerts подключены; добавлена недоступность API.
Доставка уведомлений наружу требует отдельной настройки Alertmanager/контактов.
Экспортеры CPU/RAM хоста и SQL-статистики в этот состав не входят.

Prometheus и Grafana хранят состояние в именованных томах. Логи API/worker
пишутся в `logs-data` с удалением старше семи дней (см. README).
Nginx не пишет подписанные URL и WS query-параметры в access log;
его error log отключён, поскольку может содержать эти URL.

## Обновление

Сначала сохраните резервную копию. Переключите checkout на проверенный релиз,
выполните ту же команду `up --build -d --wait` с тем же `-p`, env и набором `-f`.
Миграции выполняются до запуска API; готовые треки каталога не создаются повторно.
Будет короткий перерыв: один API-процесс держит состояние WS.
Возврат старого образа допустим только при совместимой схеме БД;
иначе восстанавливайте согласованную копию БД и аудио в новый проект.

Для остановки используйте `stop` или `down` **без `-v`**. Не удаляйте рабочие тома.

## Резервное копирование

Скрипт останавливает приложение, обработчики и хранилище, сохраняет PostgreSQL
в custom dump и весь том аудио (включая метаданные MinIO), записывает SHA-256,
затем запускает ранее работавшие сервисы. Это согласованная копия с перерывом
на обслуживание. Время перерыва зависит от размера аудио.

```bash
python3 infra/backup.py --env-file /srv/unison-runtime/compose.env \
  --project unison --production backup /srv/unison-backups/2026-10-15
```

Для локального экземпляра уберите `--production` и укажите его env/project.
Каталог назначения должен быть новым и находиться вне Git. Не запускайте
два backup/restore одновременно. Копируйте завершённую папку с `manifest.json`
на отдельный носитель; credentials храните отдельно и защищённо.

## Восстановление

Восстанавливайте в **новый Compose-проект**, с исходными runtime-ключами.
Скрипт проверяет контрольные суммы, отсутствие работающих обработчиков,
пустоту БД и аудиотома и отказывается перезаписывать существующие данные.

```bash
python3 infra/backup.py --env-file /srv/unison-runtime/compose.env \
  --project unison-restored --production restore /srv/unison-backups/2026-10-15
docker compose --env-file /srv/unison-runtime/compose.env -p unison-restored \
  -f compose.yaml -f compose.app.yaml -f compose.production.yaml \
  up --build -d --wait
```

Перед запуском восстановленного стека на том же сервере остановите старый,
чтобы освободить порты. Для изолированной локальной репетиции используйте копию
env с другими портами и локальным `APP_ORIGIN`/`S3_PUBLIC_ENDPOINT`, сохранив ключи.
После восстановления проверьте readiness, каталог, скачивание аудио, создание
и приглашение в комнату, загрузку и WS-reconnect. Временные Celery-задачи Redis
не копируются: backend восстанавливает незавершённую обработку из БД.

Финальная приёмка размещения — два независимых устройства на настоящем HTTPS-домене.
Локальные браузерные тесты не заменяют эту проверку.

Технические источники: [Nginx WebSocket](https://nginx.org/en/docs/http/websocket.html),
[proxy и сохранение URI](https://nginx.org/en/docs/http/ngx_http_proxy_module.html),
[Prometheus configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/),
[Grafana provisioning](https://grafana.com/docs/grafana/latest/administration/provisioning/).
