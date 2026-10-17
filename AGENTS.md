# Bookstore UI Agent Instructions

## Stack & Architecture

- **Framework**: React 19 + TypeScript 5.8 + Vite 8 + Material UI v7
- **State & Data**: TanStack React Query v5 + Axios (`src/services/http.ts`) + compact React Contexts (`AuthContext`, `CartContext`, `FavoritesContext`, `UiContext`)
- **Forms & Validation**: `react-hook-form` + `yup` / `zod` with localized validation keys
- **Localization**: `react-i18next` (`src/i18n/en.json`, `src/i18n/es.json`) persisted under `localStorage['bookstore.language']` (`STORAGE_KEYS.LANGUAGE`)

## Structure

- `src/constants/index.ts` — `STORAGE_KEYS`, `PAGINATION_PAGE_SIZES`, `DEFAULT_CATALOG_PAGE_SIZE`, `HERO_AUTOPLAY_INTERVAL_MS`, `ROUTES`
- `src/utils/format.ts` — `formatCurrency`, `formatDate`, `getUserInitials`
- `src/utils/error.ts` — `getLocalizedErrorMessage(error, t)`
- `src/components/` — `AppShell`, `UserAccountMenu`, `SearchBox`, `BookCard`, `BookGrid`, `BookCover`, `ConfirmDialog`, `PageStateCard`, `RequireAuth`
- `src/modules/catalog/components/` — `BookDetailHero`, `BookMetadataGrid`, `BookReviewsSection`, `BookReviewForm`, `BookDetailSkeleton`, `HeroBannerCarousel`, `CatalogPaginationBar`
- `src/modules/admin/components/` — `AdminBooksSection`, `AdminUsersSection`, `AdminReviewsSection`, `AdminOrdersSection`, `DataTable`

## Commands

- Validation gate: `corepack yarn sanitycheck`
- Regenerate OpenAPI types: `corepack yarn api:generate`
- Tests: `corepack yarn test --runInBand`

## Conventions

- Do not hand-edit `src/interfaces/generated/api.ts`.
- Keep 100% key parity between `src/i18n/en.json` and `src/i18n/es.json`.
- Avoid synchronous `setState` inside `useEffect` (`react-hooks/set-state-in-effect` is enforced).
- Pass MUI v7 layout/typography shorthand props (`alignItems`, `justifyContent`, `fontWeight`, `lineHeight`) inside `sx={{ ... }}`.
- Never modify `.github/`, `Dockerfile`, or `nginx.conf`.
- Reference: `docs/ARCHITECTURE.md` and `docs/AUDIT_AND_REFACTORING.md`.
