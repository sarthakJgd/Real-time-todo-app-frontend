# Live To-do App frontend

Angular 7 client for the Live To-do API. It provides account screens, todo management, friend requests and Socket.IO notifications.

## Local development

The checked-in development environment targets the API at `http://localhost:3000`. Install the locked dependencies with `npm ci`, then run `npm start` and open `http://localhost:4200`.

Protected API requests use `Authorization: Bearer <token>`. The production environment uses same-origin API and Socket.IO URLs; configure a reverse proxy to route `/api` and Socket.IO to the backend. If a separate backend origin is used, set an HTTPS origin in `src/environments/environment.prod.ts` and allow the frontend origin through the backend's `CORS_ORIGIN` setting.

## Build and tests

- `npm run build` builds the application.
- `npm test` runs the Angular/Karma unit test suite.
- `npm run e2e` runs the Protractor end-to-end suite.

The current Angular 7 toolchain does not build on Node.js 24 LTS: the build fails when `http-deceiver` requests Node's removed `http_parser` binding. Upgrade Angular CLI and its build dependencies before relying on Node 24 for frontend builds. The repository currently has no Node 24 compatible build result.
