import type { components } from '@/interfaces/generated/api';

export type User = components['schemas']['UserAdminViewDto'];
export type Session = components['schemas']['AuthResponseDto'];
export type Author = components['schemas']['AuthorResponseDto'];
export type Category = components['schemas']['CategoryResponseDto'];
export type Review = components['schemas']['ReviewViewDto'];
export type Book = components['schemas']['BookViewDto'];
export type BookReviews = components['schemas']['BookViewDto']['reviews'];
export type HomeBooks = components['schemas']['HomeBooksResponseDto'];
export type CartBook = components['schemas']['CartBookDto'];
export type FavoriteBook = components['schemas']['FavoriteBookDto'];
export type Order = components['schemas']['OrderViewDto'];
export type BookInput = components['schemas']['CreateBookDto'];
export type CreateReviewInput = components['schemas']['CreateReviewDto'];
export type AdminStats = components['schemas']['StatsResponseDto'];
