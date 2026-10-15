# Unison — frontend

React 19 + TypeScript strict + Redux Toolkit + React Redux + RTK Query + React Router. Архитектура Feature-Sliced Design. Python/FastAPI — основной режим; локальная демоверсия включается отдельно.

## Запуск с готовым бэкендом

Нужны Node.js 24, npm и сервисы из [корневого README](../README.md#локальный-запуск).

```bash
cd frontend
npm ci
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Откройте `http://127.0.0.1:5173`. `APP_ORIGIN` в настройках бэкенда должен точно совпадать с адресом браузера, включая hostname и порт. Например, для этого запуска — `http://127.0.0.1:5173`. Если бэкенд настроен на `http://localhost:5173`, открывайте этот адрес. Vite проксирует `/api`, `/ws`, `/health` на `127.0.0.1:8000`.

По умолчанию `VITE_APP_MODE=api`, `VITE_API_ORIGIN` пустой. Это сохраняет один origin для браузера, cookie и WebSocket. При недоступном сервере клиент показывает ошибку. Для другого адреса API настройте `.env.local` по `.env.example` и перезапустите Vite; серверу потребуется соответствующий CORS/Origin.

1. Создайте комнату и разрешите звук кнопкой формы.
2. Пригласите друга по ссылке. Для локальной проверки откройте её в **другом профиле или инкогнито**: участник определяется серверной cookie-сессией.
3. Выберите трек, дождитесь готовности обоих, включите общий плеер.
4. Проверьте общую паузу/перемотку и независимую громкость.
5. Загрузите MP3/WAV/M4A: подписанный PUT → S3 → Python worker/FFmpeg → готовый трек в подборке.

Новая вкладка той же cookie-сессии замещает прежнее соединение, а не создаёт второго слушателя. После refresh восстанавливается роль. В localStorage сохраняются только ID участия и громкость; авторизация — HttpOnly cookie. Токен приглашения находится во fragment и после входа удаляется из URL через `navigate(..., {replace:true})`.

## FSD и роутинг

| Слой | Ответственность |
| --- | --- |
| `src/app` | Redux store, Provider, React Router, глобальные стили |
| `src/pages` | `home`, `join`, `room`: экраны и их композиция |
| `src/widgets` | Самостоятельная панель участников |
| `src/features` | `create-room`, `listen-together`, `select-track`, `upload-track`, `room-playlist`, `send-reaction`, `manage-room`, `switch-room`, `edit-cover` |
| `src/entities` | `room`: состояние и транспорт; `track`: модель, RTK Query и преобразование API |
| `src/shared` | Генерируемые контракты, HTTP, конфигурация, UI, часы, медиа и ошибки |

Импорты идут вниз по слоям через `index.ts`. Соседние слайсы изолированы; связь room → track явно объявлена через `entities/track/@x/room.ts`. Нижние слои не импортируют app/store: они используют типизированные селекторы и Redux hooks. Audio, WebSocket и таймеры находятся за пределами сериализуемого Redux state и освобождаются при уходе со страницы.

`src/app/routes/AppRouter.tsx` использует `BrowserRouter`, `Routes`, `Route`, `Link` и `useNavigate`. Страницы загружаются через `lazy`/`Suspense`:

- `/` — создание комнаты;
- `/join/:roomId#invite=…` — приглашение;
- `/room/:roomId` — плеер;
- `*` — неизвестный маршрут.

При production-размещении веб-сервер должен отдавать `index.html` для клиентских маршрутов; `/api`, `/ws` и файлы медиа обслуживаются отдельно.

Подробные правила: [архитектура](../docs/FRONTEND-ARCHITECTURE.md), [коммиты](../CONTRIBUTING.md).

## Контракты

Pydantic-схемы из `backend/contracts` генерируют TypeScript и standalone-валидаторы в `src/shared/api/generated`. Эти файлы нельзя редактировать или форматировать вручную. HTTP и WS проверяются до преобразования в клиентские модели: ревизия из корня snapshot добавляется к локальному playback; объект readiness преобразуется для UI. Время и позиции на проводе — целые миллисекунды.

RTK Query реально используется для подборки комнаты: `useRoomTracksQuery`, кеш, пагинация и обновление после загрузки/смены трека. Низкоуровневые mutation-запросы используют тот же cookie/CSRF HTTP-клиент. Авторитетное состояние плеера приходит по WebSocket.

```bash
npm run contracts:generate
npm run contracts:check
npm run contracts:test
```

## Проверки

```bash
npm run architecture:check
npm run lint
npm run format:check
npm run test
npm run contracts:check
npm run contracts:test
npm run build
npx playwright install chromium --only-shell
npm run test:e2e
npm run test:e2e:api
```

`test:e2e` поднимает деморежим на `127.0.0.1:5174` и проверяет 12 сценариев, включая ширины 360/390/768/1024/1440 px, клавиатуру и фокус. `test:e2e:api` использует работающий FastAPI и UI на `127.0.0.1:5173`, два независимых browser context и настоящие медиа. Для backend с `APP_ORIGIN=http://localhost:5173`:

```bash
UNISON_E2E_ORIGIN=http://localhost:5173 npm run test:e2e:api
```

Серверные проверки создают тестовые комнаты и закрывают их после успешных сценариев. Требуются подготовленный каталог, S3 и worker. Traces сохраняются в игнорируемом `test-results/api`, демопроверки — в `test-results/demo`. Для повторения серверной серии учитывайте обычный лимит создания комнат 5/мин; тесты не обходят серверные квоты.

## Деморежим без Python

```bash
VITE_APP_MODE=demo npm run dev -- --host 127.0.0.1
```

Приглашение работает между вкладками **одного** браузерного профиля. Комнаты хранятся в localStorage, файлы — в IndexedDB; BroadcastChannel и Web Locks согласуют вкладки. Здесь нет серверной авторизации, FFmpeg и серверной очистки. Шесть оригинальных фрагментов по 24 секунды генерируются командой `npm run audio:generate`.

[Текущий прогресс и ограничения](../docs/FRONTEND-PROGRESS.md). Проверки Chromium на одном компьютере не заменяют Safari/Android и измерение слышимой синхронизации на независимых устройствах.

## Групповые функции

[Плеер, очередь, права, зал ожидания и смена комнаты](../docs/POST-MVP.md) работают через Python API. React Router переключает существующие `/room/:roomId`; авторизация восстанавливается серверной cookie через `/resume`. Нажатие стрелки рядом с названием открывает список комнат. RTK Query обновляет подборку при `track.updated`, включая название и версию обложки. Очередь и права приходят в общем snapshot; реакции — отдельные эфемерные WS-события.

`test:e2e:api` дополнительно включает `social.spec.ts`: допуск гостя, отзыв прав, repeat/shuffle, реальные обложки, реакции и room switcher. `UNISON_E2E_EXTERNAL=1` использует уже поднятый UI. Новые серверные функции не эмулируются в demo.
