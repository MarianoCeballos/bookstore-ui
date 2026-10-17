export const STORAGE_KEYS = {
  AUTH_TOKEN: 'bookstore.token',
  LANGUAGE: 'bookstore.language',
} as const;

export const PAGINATION_PAGE_SIZES = [8, 12, 24, 48] as const;
export const DEFAULT_CATALOG_PAGE_SIZE = 12;

export const HERO_AUTOPLAY_INTERVAL_MS = 6000;

export const ROUTES = {
  HOME: '/',
  BOOKS: '/books',
  BOOK_DETAIL: (id: number | string) => `/books/${id}`,
  CART: '/cart',
  FAVORITES: '/favorites',
  ACCOUNT: '/account',
  HISTORY: '/history',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  CONFIRM: '/confirm',
  PASSWORD_RESET: '/password-reset',
  ADMIN: '/admin',
  ADMIN_SECTION: (section: string) => `/admin/${section}`,
} as const;
