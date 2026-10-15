# Frontend: FSD

Реализация следует [правилам слоёв Feature-Sliced Design](https://feature-sliced.design/docs/reference/layers) и [публичным API слайсов](https://feature-sliced.design/docs/reference/public-api).

## Владение кодом

| Место | Что здесь меняем |
| --- | --- |
| `app/routes/AppRouter.tsx` | URL, React Router, lazy boundaries и fallback |
| `app/store` | Сборка reducer/middleware; здесь нет логики сущностей |
| `app/styles` | Общие токены и адаптивные правила интерфейса |
| `pages/home`, `pages/join` | Композиция входных экранов, одноразовая логика приглашения |
| `pages/room/model` | Состояние диалогов, общие действия страницы и навигация |
| `pages/room/ui` | Композиция плеера, диалогов и панели участников |
| `widgets/room-participants` | Присутствие и роли; действия принимаются через callbacks |
| `features/create-room` | Форма создания, валидация, ошибка и переход в комнату |
| `features/listen-together` | Аудиодвижок, локальный звук, React lifecycle соединения и синхронизация |
| `features/select-track`, `features/upload-track` | Выбор композиции, отправка, отмена и прогресс |
| `features/room-playlist`, `features/send-reaction` | Очередь, переходы, повтор, перемешивание и реакции |
| `features/manage-room`, `features/switch-room`, `features/edit-cover` | Настройки, допуск, права участников, смена комнат и обложки |
| `entities/room` | Типы комнаты/участников/playback, Redux slice, gateway, WS, timeline |
| `entities/track` | Тип трека, преобразование wire-модели, RTK Query-подборка |
| `shared/api` | CSRF/cookie HTTP-клиент, RTK Query baseApi, строгие протоколы и генерация |
| `shared/lib` | Независимые часы, формат времени, браузерное медиа-хранилище и ошибки |
| `shared/config`, `shared/ui` | Режим приложения, API origin, независимые UI-компоненты |

Shared содержит транспортные типы, автоматически полученные от backend. Предметные клиентские модели находятся в entities. `Gateway` комнаты агрегирует комнатные операции с принадлежащими комнате треками; зависимость room → track видна в `entities/track/@x/room.ts`. Track не импортирует Room.

## Правила зависимостей

1. Между слоями импортируем вниз.
2. Между слайсами одного слоя импортов нет; исключение — явно адресованный `@x` для связанных entities.
3. Снаружи слайса используем `index.ts`; внутри — относительные пути.
4. В shared нет импортов предметных слоёв. В features/entities нет импортов app store.
5. `main.tsx` — точка сборки провайдеров; app и shared являются слоями без слайсов.
6. Unit-тесты расположены рядом с ответственным модулем и проходят те же проверки импортов.

`npm run architecture:check` анализирует TypeScript AST, включая re-export и динамические импорты. Сгенерированные файлы исключены из архитектурного и стилевого форматирования, но проверяются `contracts:check`.

## Данные и эффект

Redux хранит snapshot, ID участия, connection/error и сериализуемое локальное audio state. RTK Query хранит HTTP-подборку комнаты и обрабатывает её пагинацию. WebSocket, Audio, AbortController, таймеры и blob URL живут в lifecycle/сервисах, а не в Redux.

Wire Snapshot имеет `playbackRevision` в корне. Клиентский адаптер добавляет её к Playback для работы timeline; поле не отправляется обратно как часть snapshot. Readiness сервера содержит track/mediaVersion/state/buffer; UI использует state, а аудиодвижок отправляет актуальный bufferedAheadMs, в том числе после увеличения буфера без смены state. Все WS-команды валидируются по общей схеме до отправки.

React Router хранит маршруты `/`, `/join/:roomId`, `/room/:roomId`, `*`. Страницы загружаются через `lazy`/`Suspense`. Invite находится во fragment; после входа маршрут заменяется. Cookie-сессия определяет участника. ID в localStorage помогает восстановить UI и новую вкладку; он не является авторизацией.

## Изменения и проверка

Изменение URL — app/routes. Новое повторяемое действие пользователя — features. Представление конкретного экрана — pages. Общая сущность — entities. Переиспользуемая панель — widgets, когда она имеет самостоятельную ответственность. Не создаём слой или слайс только ради количества папок.

[Команды запуска и тестов](../frontend/README.md) · [Пользовательские сценарии](04-FRONTEND-FLOW.md) · [Conventional Commits](../CONTRIBUTING.md).
