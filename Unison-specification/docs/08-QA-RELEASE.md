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
