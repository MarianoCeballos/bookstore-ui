export const PAGE_SIZE_OPTIONS = [8, 12, 24, 48] as const;

/** Sort orders offered by the catalog toolbar. */
export const CATALOG_SORT_OPTIONS = [
  'relevance',
  'newest',
  'popular',
  'rating-desc',
  'price-asc',
  'price-desc',
  'title-asc',
  'title-desc',
] as const;

export type CatalogSortOption = (typeof CATALOG_SORT_OPTIONS)[number];

export const DEFAULT_CATALOG_SORT: CatalogSortOption = 'relevance';

/** i18n keys for every sort option, kept in the same order as the options. */
export const CATALOG_SORT_LABEL_KEYS: Record<CatalogSortOption, string> = {
  relevance: 'sortRelevance',
  newest: 'sortNewest',
  popular: 'sortPopular',
  'rating-desc': 'sortRating',
  'price-asc': 'sortPriceAsc',
  'price-desc': 'sortPriceDesc',
  'title-asc': 'sortTitleAsc',
  'title-desc': 'sortTitleDesc',
};

/** Minimum ratings (inclusive) offered by the rating filter. */
export const CATALOG_RATING_FILTERS = [4.5, 4, 3, 2] as const;

/** How many facet values the sidebar shows before the "show all" toggle. */
export const CATALOG_FILTER_VISIBLE_LIMIT = 6;

export const CATALOG_FILTER_PARAMS = {
  search: 'search',
  categories: 'category',
  authors: 'author',
  languages: 'language',
  publishers: 'publisher',
  minPrice: 'minPrice',
  maxPrice: 'maxPrice',
  minRating: 'minRating',
  sort: 'sort',
  page: 'page',
  pageSize: 'pageSize',
} as const;
