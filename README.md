# Bookstore UI

Independent Vite and React application for the Bookstore API.

## Requirements

- Node.js 20.19 or newer
- Corepack and Yarn 4
- The Bookstore API running at `http://localhost:3001`

## Setup

```powershell
corepack enable
Copy-Item .env.example .env
yarn install
yarn api:generate
yarn dev
```

No identity-provider configuration is needed. Catalog browsing and book details work without signing in; account, cart, favorites, checkout, and administration features use the optional username/password account flow. Keep `.env` local.

## Scripts

- `yarn dev` starts Vite on port 5173.
- `yarn build` type-checks and creates a production build in `dist/`.
- `yarn typecheck` runs strict TypeScript checks.
- `yarn lint` runs ESLint.
- `yarn test` runs Jest and Testing Library tests.
- `yarn sanitycheck` runs typecheck, lint, tests, and build.
- `yarn api:generate` generates TypeScript API path types from `http://localhost:3001/openapi.json` or `API_SPEC_URL`.

See [OpenAPI type generation](./docs/openapi-types.md) for how the API contract is converted into UI types, how to refresh them, and troubleshooting steps.

## Performance testing

Run Lighthouse against a production build, not the Vite development server: development serves unminified modules and inflates JavaScript and load-time metrics. Stop `yarn dev`, then run:

```powershell
yarn build
yarn preview --host 0.0.0.0 --port 5173 --strictPort
```

Keep the preview origin aligned with the API's `FRONTEND_URL` CORS setting.

## Architecture

Domain folders under `src/modules` contain axios services, React Query hooks, and screens. Shared UI components live in `src/components`; routes, providers, interfaces, translations, and utilities have dedicated folders. The API owns user accounts and sessions.

Book reviews are included in the book response and selected client-side for the detail view; the UI does not depend on a separate reviews-by-book endpoint.

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) and [docs/AUDIT_AND_REFACTORING.md](./docs/AUDIT_AND_REFACTORING.md) for detailed module boundaries, UI/UX design decisions, localization, accessibility (WCAG 2.2 AA), and refactoring history.
