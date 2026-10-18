import type { BookInput } from '@/interfaces/models';

export const ADMIN_SECTIONS = [
  'stats',
  'books',
  'users',
  'reviews',
  'orders',
] as const;

export type AdminSection = (typeof ADMIN_SECTIONS)[number];

export const INITIAL_BOOK: BookInput = {
  title: '',
  description: '',
  price: '0.00',
  image: '',
  authors: [],
  categories: [],
  publisher: '',
  publishedDate: new Date().toISOString().slice(0, 10),
  pageCount: 1,
  language: 'English',
};

export const PRICE_PATTERN = /^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/;

export const RECENT_ORDERS_LIMIT = 5;

export const CHART_AXIS_TICK = { fill: '#4e3325', fontSize: 12 };

export const CHART_TOOLTIP_STYLE = {
  backgroundColor: '#fffaf0',
  border: '1px solid rgba(103, 69, 51, 0.28)',
  borderRadius: 8,
  color: '#1e110b',
  boxShadow: '0 6px 18px rgba(30, 17, 11, 0.12)',
};
