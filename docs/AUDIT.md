# Аудит Unison (16 октября 2026)

Статус: **F** — исправлено и проверено, **O** — открыто/не проверено в этой среде. Всё ниже подтверждено кодом или командой, если не помечено «гипотеза».

| # | Приоритет | Проблема | Где | Воспроизведение / доказательство | Статус |
|---|---|---|---|---|---|
| 1 | P0 | CI «Check Python» падает: `mypy` находит 5 тестов без аннотаций (позже 11 ошибок union-attr) | `backend/tests/test_media_jobs.py:124,128`, `tests/integration/test_audio_worker.py:172,190`, `tests/integration/test_social_rooms.py:355` | `cd backend && uv run mypy app tests benchmarks` → 5 errors; после правки `Success: no issues found in 83 source files` | F |
| 2 | P0 | Контейнеры не стартуют: `migrate` падает с `password authentication failed for user "unison"` | `infra/configure.py` каждый запуск создаёт новый случайный пароль, а named volume `unison-local_postgres-data` (создан 14.10) хранит старый | Воспроизведено: старый том + новый env → `migrate exit 1`, зависимые сервисы не поднимаются. Со свежим проектом (`-p unison-audit`) весь стек healthy. Точный текст вашей ошибки мне неизвестен — это самая вероятная причина (**гипотеза для вашей машины**) | F (документировано, README «Если контейнеры не стартуют») |
| 3 | P1 | Артефакты звука в своих треках: клиппинг после MP3-кодирования | `backend/app/workers/transcoder.py` (ffmpeg: `-b:a 192k` без запаса по уровню) | Синтетический «горячий» мастер (пик 0 dBFS): старая цепочка при декодировании даёт пик 1.046 и 50 отсчётов >1.0 (клиппинг); новая — пик 0.921, 0 отсчётов. Реальные пользовательские файлы не мерились | F |
| 4 | P1 | Артефакты: двойная перекодировка MP3→MP3 на 192k, лишний ресемплинг 48→44.1 | там же | 256 kbps CBR (CBR оставлен ради точной перемотки), soxr, 48 кГц сохраняется | F |
| 5 | P1 | Артефакты в воспроизведении: коррекция дрейфа через `playbackRate` с `preservesPitch=true` (time-stretch) с порогом 60 мс без гистерезиса | `frontend/src/features/listen-together/lib/correction.ts`, `audio-engine.ts` | Код: ±1–3% на сотнях мс, включение/выключение у порога. Слуховая оценка не проводилась (**гипотеза**) | F (±0.5–2%, гистерезис 90/30 мс, `preservesPitch=false`) |
| 6 | P1 | Реакции «дёргано» исчезают при большом потоке | `frontend/src/features/send-reaction/ui/RoomReactions.tsx`, `entities/room/model/slice.ts` | `left` считался от индекса в отфильтрованном списке: каждое истечение/новая реакция сдвигала все летящие; `.slice(-20)` обрывал анимирующиеся | F (полоса от id, 60 в буфере, таймер только при активных) |
| 7 | P2 | `/favicon.ico` отдаёт `200 text/html` (index.html), нет manifest/apple-icon/PNG | `infra/nginx/templates/snippets/routes.conf.template`, `frontend/index.html` | `curl -sI localhost:8080/favicon.ico` до: `text/html`; после: `image/x-icon`, неизвестный `.png` → 404 | F |
| 8 | P2 | Нет PWA | — | manifest + sw + иконки | F |
| 9 | P2 | Embedded-обложки: в задании «отсутствует», в репозитории уже реализовано (`extract_cover`, коммит 47c040c) | `transcoder.py`, `audio.py` | e2e `embedded mp3/m4a artwork reaches both listeners` — зелёные на реальном стеке | Проверено |
| 10 | O | Акустическая синхронность на разных устройствах | — | Нет физических устройств; протокол в `docs/SYNC-BENCHMARK.md` | O |
| 11 | O | Клик при паузе/жёстком seek (резкий обрыв без fade) | `audio-engine.ts` | Гипотеза, не мерилось | O |
| 12 | O | GitHub Actions: точную ошибку из лога я не видел | `.github/workflows/checks.yml`, `frontend.yml` | Все шаги frontend.yml и Python-шаги checks.yml прошли локально; единственное найденное падение — п.1. Если после пуша остаётся ошибка — пришлите лог шага | O |

## Не подтверждено
Встроенный набор backend-интеграционных тестов (PostgreSQL/Redis/S3) и `tests/system` в этой сессии не запускались; 12 e2e на реальном бэкенде и 12 demo-e2e прошли.
