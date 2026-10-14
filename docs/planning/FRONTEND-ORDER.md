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
