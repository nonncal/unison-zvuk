# README: flow фронтенда Unison

Сначала пошаговый план реализации с условиями готовности, затем подробные потоки и технические правила. [Полная спецификация](../spec/README.md), [дизайн-промпт](../design/README.md).

# Порядок реализации фронтенда

План рассчитан на React + TypeScript + Redux Toolkit + обычный WebSocket + React Router. Работы выполняются по шагам; backend API можно временно заменить общими JSON fixtures. Каждый шаг завершается наблюдаемым результатом, а не только созданием файлов.

## 1. Каркас и качество — US-01.01

Создать Vite-проект, включить TypeScript strict, настроить Router, store, стили-токены, ESLint, форматирование и build. Добавить страницы главной, приглашения, комнаты и неизвестного маршрута. Вывести environment API origin через конфигурацию без секретов. **Готово:** чистый checkout собирается, прямое открытие `/room/:id` работает, route fallback настроен.

## 2. Схемы и mock-данные — US-01.02, US-01.03

Подключить типы HTTP/WS, fixtures snapshot/hello/pending/errors. Разделить Redux slices комнаты, участников, общего playback, соединения и интерфейса. Создать RTK Query API и WS service с lifecycle. **Готово:** один snapshot рисует комнату, роли и состояние; нет audio/WS/timers внутри Redux.

## 3. Система компонентов и первые экраны — US-06.01

Создать кнопки, поля, dialogs/sheets, статусы, participant tile, track row и player shell по дизайн-README. Начать с desktop и сразу проверить 360 px. Нарисовать пустую комнату ведущего и слушателя, пока на fixtures. **Готово:** основные действия понятны, клавиатурный focus виден, роли различаются.

## 4. Создание и приглашение — US-02.01, US-02.02

Добавить имя, loading/error, POST create с idempotency key, переход в room. Получать invite только ведущему, реализовать copy и fallback. **Готово:** реальный сервер создаёт одну комнату при повторе, ссылка открывает нужный preview.

## 5. Вход и присутствие — US-02.03, US-02.04, US-02.05

Читать fragment token в память, показывать preview/full/invalid/expired. Реализовать пользовательское разрешение аудио, POST join, очистить fragment и подключить WS. Показать участников и роли. **Готово:** два независимых браузера видят друг друга, гость не имеет активных общих controls, заблокированный звук явно показан.

## 6. Один подготовленный трек — US-03.01, US-03.04

Сначала подключить одну реальную нормализованную композицию, потом библиотеку из шести. Получить signed URL, загрузить metadata/buffer, отразить readiness текущей версии. **Готово:** оба браузера играют один asset локально по явному разрешению, Range/seek и URL refresh работают. Это ещё не доказательство синхронности.

## 7. Общая временная шкала — US-04.01, US-04.02

Сделать clock sync, scheduler effectiveAt, committed+pending, apply state, host play/pause и decision для неготового участника. Защитить audio callbacks generation token. **Готово:** два ready-клиента согласованно стартуют и паузятся; до effectiveAt продолжает действовать прежняя шкала.

## 8. Seek, коррекция и поздний вход — US-04.03…US-04.06

Добавить slider с preview/release, revision handling, drift correction, local volume/mute, ended/replay и late join. Progress не dispatch-ится каждый кадр. **Готово:** pause→seek→resume и вход на 45-й секунде корректны, измерены расхождения, старый трек не оживает.

## 9. Загрузка файла — US-03.02, US-03.03

Reservation→upload→complete→processing→ready; local validation, progress/abort, polling backup, failed/retry/quota. Не менять текущую песню до successful select. **Готово:** свой файл появляется у обоих, ошибка не разрушает комнату, processing без фиктивного процента.

## 10. Восстановление и завершение — US-05.01…US-05.04

Добавить heartbeat/reconnect/backoff, локальную паузу после трёх секунд потери связи, fresh snapshot, clock probes, hard align, refresh, замену вкладки, host transfer, close/TTL и epoch reset. **Готово:** после network interruption клиенты догоняют, offline intent не повторяется, вторая вкладка не удваивает звук.

## 11. Завершить мобильный UX и доступность — US-06.02…US-06.04

Пройти всю state matrix, реальные длинные строки, touch areas/safe areas/zoom, dialogs/focus/aria-live, reduced motion. Проверить Safari iOS и Chrome Android с реальным аудио. **Готово:** ключевой сценарий доступен на 360 px, клавиатурой и screen reader, статусы не обещают звук при autoplayBlocked.

## 12. Интеграция, измерение и выпуск — US-07.01, US-07.03, US-08.01…US-08.04

Проверить контракт и два независимых browser context, выполнить реальные десятиминутные прогоны, записать NFR, проверить HTTPS demo и direct route. Добавить минимальную обезличенную воронку. **Готово:** README запуска соответствует реализации, ограничения известны, демонстрация повторяется.

## После MVP

US-09.01 — реакции; US-09.02 — очередь; US-09.03 — переход; затем US-10.01…US-10.03 — группы и управление доступом. Не скрывать провал общего playback добавлением новых функций.

## Точки интеграции с бэкендом

Перед шагом 4 нужен create/invite; перед 5 preview/join/WS snapshot; перед 6 каталог/download; перед 7 clock/state/commands; перед 9 upload/worker status; перед 10 heartbeat/generation/roles/epoch. На каждом этапе команда сверяет один fixture и один реальный сценарий. Ошибки и роли входят в контракт наравне с успешными ответами.


---

# Frontend flow — React / TypeScript

Самостоятельный документ для фронтенд-команды. Контракт [API/WS](../03-API-WS.md) и [архитектура timeline](../02-ARCHITECTURE.md) обязательны для интеграции. Бэкенд Python, коммуникация JSON HTTP + обычный WebSocket.

## Структура и состояния

React + TypeScript strict + Vite; Redux Toolkit для room/participants/playback/connection; RTK Query для bootstrap/catalog/upload status. React Router нужен для прямых ссылок и экранов `/`, `/join/:roomId`, `/room/:roomId`, `*`. CSS tokens и компонентные стили; семантические button/dialog/range. Redux хранит сериализуемое серверное состояние и UI-состояния; `HTMLAudioElement`, WS, timers, AbortController живут в отдельных сервисах с lifecycle, не в Redux.

Предлагаемые модули: app/router/store; entities/room,participant,track; features/create-room,join-room,invite,upload,playback,local-audio; services/api,ws,clock-sync,audio-engine; shared/ui,tokens,types. Стороннюю UI-библиотеку выбирать после дизайна, не навязывать её визуальный шаблон.

Connection: idle→connecting→connected→reconnecting→failed/closed. LocalAudio: locked→loading→ready→scheduled→playing/paused; дополнительные buffering/error. ServerPlayback: empty/paused/playing/ended + pending. Три состояния не объединять в одно: у комнаты может быть playing, у гостя autoplayBlocked.

## Создание и вход

```text
Главная → имя → POST rooms → cookie + snapshot → /room/id (ведущий)
Приглашение → читать #invite в память → preview → имя → пользовательский click
            → unlock audio + POST join → /room/id → WS hello → clock probes
```

На действие «Войти и включить звук» разблокировать audio pipeline в самом пользовательском обработчике, до длительных await; затем проверить результат реального play/resume. Если браузер всё равно запрещает play, вывести «Включить звук», не показывать ready. Не полагаться на универсальную доступность getAutoplayPolicy. При ошибке join сохранить введённое имя, дать повтор. Фрагмент приглашения не отправлять в аналитику/логи, очищать после успешного входа.

Refresh `/room/:id`: GET snapshot с cookie → WS; при 401 экран «Сессия завершена, войдите по приглашению», без возможности стать ведущим через URL. Выход вызывает leave, закрывает WS, останавливает audio, очищает чувствительное состояние; volume/mute могут сохраняться локально. При navigation cleanup удалить listeners/timers и не создавать два WS из React StrictMode.

## Получение и применение состояния

1. При hello сверить v, epoch, применить snapshot, инициализировать clock probes. Controls выключены до авторизации и валидной оценки времени.
2. Для нового track/mediaVersion отменить старую загрузку и scheduled actions, сохранить старый аудио только пока не применено select-состояние. Получить playback URL, загрузить metadata, duration и достаточный range буфера; callback старой версии игнорировать по generation token.
3. Отправить readiness. Если autoplay закрыт, это отдельное состояние, даже при полном файле.
4. Рассчитать committed target. Pending transition применить в effectiveAt; scheduler пересчитывает задержку при обновлении offset. Перед play сделать seek к целевой позиции и дождаться seeked/готовности, после play promise подтвердить локальную playing. Любое опоздание — join к текущей позиции.
5. Раз в секунду сравнивать target и currentTime, корректировать по архитектуре; визуальный прогресс рисовать requestAnimationFrame только активной вкладки без dispatch каждую кадровую итерацию.
6. При track end ждать серверный ended; локальное ended отправить как telemetry, не управлять комнатой. Старое событие от другого track не применить.

## Управление плеером

Ведущий видит активные play/pause/seek, смену трека, загрузку и закрытие. Слушатель видит общую позицию и подпись «Воспроизведением управляет …»; seek у него read-only, volume/mute активны. При seek сначала локальный preview значения, в сеть одна команда на release; обычное движение ползунка не перематывает всех десятки раз. Общие изменения не optimistic: показать «Применяем…» до ACK/state. При PENDING_TRANSITION/CONFLICT обновить snapshot и дать повторить, не молча переслать действие.

Volume 0–100 сохраняется на устройстве, не публикуется. Нажатие mute сохраняет последнюю ненулевую громкость. Общую pause визуально отличать от локального mute. Клавиши Space play/pause для ведущего только при focus вне input/dialog; стрелки seek только на seek slider, volume только на volume slider. Действия имеют доступные имена и явный focus ring.

## Upload flow

Выбор/drag-drop → проверить расширение и размер → reservation → direct upload с прогрессом → complete → processing → track.updated или polling backup раз в 2 с до 60 с → ready. Если дольше 60 с, UI пишет «Обработка продолжается», остаётся доступным ручное обновление; серверный timeout 120 с. Отмену отправки реализовать abort; reservation будет очищена сервером. При 403 upload URL запросить новую reservation только как новое действие; complete с недоступным object не выдаёт ready. Для download 403 обновить signed URL того же mediaVersion, восстановить target.

Ошибки: слишком большой, неверный формат, превышена квота, повреждённый/слишком длинный файл, недоступное хранилище, timeout обработки. Каждая показывает исправление и повтор, текущая песня остаётся доступной до успешного select.

## Reconnect и браузерные ограничения

Backoff 0,5/1/2/4/8 с с jitter ±20%, max 8 с; attempts 60 с → failed с кнопкой «Подключиться снова». Начало offline немедленно отключает общие commands; local play допускается до 3 с без обновлений связи, затем локальная пауза. После reconnect snapshot, clock probes и hard-align, без реплея старых команд. На online/visibilitychange/pageshow просить snapshot и probes; sleep timers не считать точными. Не обещать фоновое воспроизведение на заблокированном телефоне.

При WS 4001 остановить audio и показать замену вкладки; 1008 → повтор входа; 4004 → завершение. Не крутить reconnect для terminal ошибок. Local network `online` не доказывает связь с API.

## Экранные состояния и проверка

Home default/loading/error; Join preview/invalid/full/expired/closed; Room empty/waiting/ready/playing/paused/ended; upload/progress/processing/error; audio blocked; buffering; reconnect; new host; session replaced; finish. Desktop 1440/1024, tablet768, mobile390/360. Layout не прыгает при изменении имени/песни, длинные значения сокращаются визуально и доступны полностью через доступное имя.

Vitest: timeline math/offset/revision, audio lifecycle с fake clock. RTL: роли, errors, keyboard и dialogs. Playwright: два независимых context с различными cookies, join/play/pause/seek/reconnect, запрет guest command через WS. Реальный звук/мобильный Safari проверить вручную: mocked audio не проверяет autoplay и акустическое качество.

Результат фронтенда: работающие маршруты, типизированный API/WS, UI по дизайн-спецификации, корректный audio engine, отсутствие leaked connections, отчёт по browser matrix. Общие права проверяет бэкенд; disabled кнопка сама права не защищает.
