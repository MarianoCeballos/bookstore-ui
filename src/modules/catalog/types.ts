import type { paths } from '@/interfaces/generated/api';

export interface ReviewFormValues {
  title: string;
  review: string;
  rating: number;
}

export type BookSearchParams = NonNullable<
  paths['/books']['get']['parameters']['query']
>;
