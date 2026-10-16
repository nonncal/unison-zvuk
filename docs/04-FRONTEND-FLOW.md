# Frontend flow — React / TypeScript

Самостоятельный документ для фронтенд-команды. Контракт [API/WS](03-API-WS.md) и [архитектура timeline](02-ARCHITECTURE.md) обязательны для интеграции. Бэкенд Python, коммуникация JSON HTTP + обычный WebSocket.

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
