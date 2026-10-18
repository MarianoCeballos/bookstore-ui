import type { paths } from '@/interfaces/generated/api';
import type { CatalogSortOption } from '@/modules/catalog/constants';

export interface ReviewFormValues {
  title: string;
  review: string;
  rating: number;
}

export type BookSearchParams = NonNullable<
  paths['/books']['get']['parameters']['query']
>;

/** Every catalog filter the `/books` page understands. */
export interface CatalogFilters {
  /** Free text matched against title, authors, categories, publisher, language. */
  search: string;
  categories: string[];
  authors: string[];
  languages: string[];
  publishers: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  sort: CatalogSortOption;
}

/** Filter groups that expose a facet list in the sidebar. */
export type CatalogFacetDimension =
  | 'categories'
  | 'authors'
  | 'languages'
  | 'publishers';

export interface CatalogFacetOption {
  value: string;
  /** Books that would remain if this option were also selected. */
  count: number;
}

export interface CatalogFacets {
  categories: CatalogFacetOption[];
  authors: CatalogFacetOption[];
  languages: CatalogFacetOption[];
  publishers: CatalogFacetOption[];
  /** Absolute price range of the whole catalog, used by the price slider. */
  priceBounds: { min: number; max: number };
}

export interface CatalogPaginationState {
  page: number;
  pageSize: number;
}
