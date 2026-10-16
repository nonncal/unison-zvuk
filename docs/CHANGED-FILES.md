# Изменённые файлы

**Backend:** `app/workers/transcoder.py` (soxr, −1.5 дБ + alimiter, 256k CBR, 48 кГц сохраняется), `app/services/media_jobs.py` (sample_rate 44100|48000), тесты `test_media_jobs.py`, `integration/test_audio_worker.py`, `integration/test_social_rooms.py` (типы для mypy).
**Frontend:** `app/styles/index.css`, `pages/*/ui/*.css`, `widgets/room-player/*`, `widgets/room-participants`, `pages/room/ui/RoomPage.tsx`, `pages/home`, `pages/join`, `features/send-reaction`, `features/listen-together/lib/{correction,audio-engine}.ts` (+тест), `entities/room/model/slice.ts`, `main.tsx` (шрифты, SW), `index.html`, `public/{favicon.svg,favicon.ico,icon-*.png,apple-touch-icon.png,og-image.png,manifest.webmanifest,sw.js,offline.html}`, `package.json`/lock (Onest, Unbounded вместо PT Sans).
**Infra:** `infra/nginx/templates/snippets/routes.conf.template` (статика 404 вместо index.html, MIME манифеста, sw.js no-cache).
**Docs:** AUDIT, DESIGN-REVIEW, SYNC-BENCHMARK, DEMO-SCRIPT, KARAOKE, CHANGED-FILES, `docs/design/{before,after}`.

Проверено: ruff, mypy, pytest (132 passed, 58 skipped без сервисов), eslint, prettier, tsc, vitest, FSD-check, 12+12 e2e, ручной curl nginx.
Не проверено: backend integration/system-тесты, GitHub Actions удалённо.

Остаётся backend: LRC/тексты (если нужно), fade при паузе. Frontend: светлая тема, скринридер-проверка, обновить `docs/06-DESIGN.md` (там ещё PT Sans и светлая схема — заменена этим ревью).
