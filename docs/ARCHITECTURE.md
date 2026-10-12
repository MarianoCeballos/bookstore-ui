# UI architecture

The application is a strict TypeScript SPA built with Vite and React. React Router owns navigation. The shared QueryClient and domain hooks own server state; compact contexts hold the current authenticated session and ephemeral interface state. Axios attaches the API access token and routes unauthorized responses through a shared handler.

Each feature is grouped under `src/modules/<domain>` with services, hooks, and screens. Shared components, providers, interfaces, route definitions, translations, and utilities are kept separate. OpenAPI path types are generated into `src/interfaces/generated/api.ts` from the running API document.

The public flow includes the catalog, book detail and reviews, registration, sign-in, confirmation and password recovery, contact, cart and favorites, payment return, and purchase history. Authenticated routes protect account features; the admin area exposes book, user, review, payment, and analytics screens.
