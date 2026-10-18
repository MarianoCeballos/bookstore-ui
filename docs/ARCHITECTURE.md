# UI Architecture

The application is a strict TypeScript SPA built with Vite 8, React 19, and Material UI v7. React Router v7 owns navigation. The shared TanStack `QueryClient` and domain hooks own server state; compact contexts hold the current authenticated session (`AuthContext`), cart/favorites relations (`CartContext`, `FavoritesContext`), and interface preferences (`UiContext`). `RequireAuth` gates protected routes and publishes the guaranteed signed-in user to its subtree through `AuthenticatedUserContext` (`useAuthenticatedUser`), so protected screens never handle an anonymous user. Axios (`src/services/http.ts`) attaches the API bearer token and routes `401` responses through a shared unauthorized handler.

## Directory Structure

- `src/constants/` — Shared route paths (`ROUTES`), localStorage keys (`STORAGE_KEYS`), pagination sizes, and UI timing constants.
- `src/utils/` — Pure formatting helpers (`formatCurrency`, `formatDate`, `getUserInitials`) and localized API error mapping (`getLocalizedErrorMessage`).
- `src/i18n/` — Bilingual translation dictionaries (`en.json`, `es.json`) with `localStorage` persistence (`bookstore.language`) and `<html lang>` synchronization.
- `src/components/` — Reusable UI primitives (`AppShell`, `UserAccountMenu`, `SearchBox`, `BookCard`, `BookGrid`, `BookCover`, `ConfirmDialog`, `PageStateCard`, `RequireAuth`).
- `src/interfaces/` — Domain aliases (`models.ts`) backed by generated OpenAPI contract types (`generated/api.ts`).
- `src/modules/<domain>/` — Feature modules (`catalog`, `auth`, `account`, `admin`, `payments`, `contact`, `lookups`, `ui`) organized into `components/`, `hooks/`, `screens/`, and `services/`.

## Key User Flows

- **Catalog & Book Detail (`src/modules/catalog/`)**: Public catalog search, debounced filtering, category/author/publisher lookups, hero carousel (`HeroBannerCarousel`), pagination (`CatalogPaginationBar`), and the decomposed Book Detail showcase (`BookDetailHero`, `BookMetadataGrid`, `BookReviewsSection`, `BookReviewForm`, `BookDetailSkeleton`).
- **Authentication & Recovery (`src/modules/auth/`)**: Sign-in, registration, unconfirmed-account email resend, token confirmation (`ConfirmPage`), and 3-step password reset (`PasswordResetPage`).
- **Account, Cart & Checkout (`src/modules/account/`, `src/modules/payments/`)**: Favorites, server-synced cart with optional gift recipient validation, checkout preference creation, payment verification (`PaymentResultPage`), and order history (`HistoryPage`).
- **Administration (`src/modules/admin/`)**: Role-guarded analytics dashboard (`AdminDashboardPage`) and decomposed management tabs (`AdminBooksSection`, `AdminUsersSection`, `AdminReviewsSection`, `AdminOrdersSection`, `DataTable`).

See [AUDIT_AND_REFACTORING.md](./AUDIT_AND_REFACTORING.md) for the full UI/UX audit, accessibility improvements (WCAG 2.2 AA), localization coverage, and refactoring log.
