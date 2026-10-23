# StudyPlanner — Frontend

React 19 SPA built with **Vite** (migrated from Create React App).

## Requirements

- Node.js — a local copy is bundled in `../node/`, which `startfrontlayer.bat` puts on `PATH`. Manual runs need any modern Node (≥ 20).

## Run

```bash
npm install        # first time only
npm run dev        # dev server + HMR on http://localhost:3001
```

Or just launch the whole app from the repo root via `start.bat` (starts MySQL, backend, then frontend).

## Scripts

| Script              | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Dev server with hot reload, port 3001                     |
| `npm run build`     | Type-check (`tsc --noEmit`) + production build to `dist/` |
| `npm run preview`   | Serve the production build locally                        |
| `npm test`          | Run tests once (Vitest)                                   |
| `npm run typecheck` | TypeScript check only                                     |
| `npm run lint`      | ESLint (flat config in `eslint.config.js`)                |

## Notes

- The dev port is pinned to 3001 (`server.port` + `strictPort: true` in `vite.config.ts`) to match the launch scripts.
- The `npm install` ERESOLVE conflict on clean machines (ISS-3, Sprint 2 Week 1) no longer applies — `react-scripts` was removed during the Vite migration.
