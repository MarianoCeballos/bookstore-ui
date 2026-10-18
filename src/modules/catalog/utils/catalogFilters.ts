import type { Book } from '@/interfaces/models';
import { DEFAULT_CATALOG_PAGE_SIZE } from '@/constants';
import {
  CATALOG_FILTER_PARAMS,
  CATALOG_SORT_OPTIONS,
  DEFAULT_CATALOG_SORT,
  PAGE_SIZE_OPTIONS,
  type CatalogSortOption,
} from '@/modules/catalog/constants';
import type {
  CatalogFacetDimension,
  CatalogFacetOption,
  CatalogFacets,
  CatalogFilters,
  CatalogPaginationState,
} from '@/modules/catalog/types';

/**
 * Catalog filtering, sorting and faceting.
 *
 * The `/books` endpoint returns the whole catalog in one request, so the
 * browser owns filtering, sorting and faceting. Keeping it here (instead of in
 * components) makes the behaviour easy to reason about and unit test.
 */

const normalize = (value: string): string => value.trim().toLowerCase();

const isSortOption = (value: string): value is CatalogSortOption =>
  (CATALOG_SORT_OPTIONS as readonly string[]).includes(value);

const toFiniteNumber = (value: string | null): number | null => {
  if (value === null || value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const readList = (params: URLSearchParams, key: string): string[] => {
  const unique = new Map<string, string>();
  // Values are written as repeated params; never split on commas because facet
  // values legitimately contain them (e.g. "Body, Mind & Spirit").
  for (const raw of params.getAll(key)) {
    const value = raw.trim();
    if (value && !unique.has(normalize(value)))
      unique.set(normalize(value), value);
  }
  return [...unique.values()];
};

export function createEmptyCatalogFilters(): CatalogFilters {
  return {
    search: '',
    categories: [],
    authors: [],
    languages: [],
    publishers: [],
    minPrice: null,
    maxPrice: null,
    minRating: null,
    sort: DEFAULT_CATALOG_SORT,
  };
}

export function parseCatalogFilters(params: URLSearchParams): CatalogFilters {
  const { search, categories, authors, languages, publishers } =
    CATALOG_FILTER_PARAMS;
  const minPrice = toFiniteNumber(params.get(CATALOG_FILTER_PARAMS.minPrice));
  const maxPrice = toFiniteNumber(params.get(CATALOG_FILTER_PARAMS.maxPrice));
  const minRating = toFiniteNumber(params.get(CATALOG_FILTER_PARAMS.minRating));
  const sort = params.get(CATALOG_FILTER_PARAMS.sort);

  return {
    search: (params.get(search) ?? '').trim(),
    categories: readList(params, categories),
    authors: readList(params, authors),
    languages: readList(params, languages),
    publishers: readList(params, publishers),
    minPrice: minPrice !== null && minPrice >= 0 ? minPrice : null,
    maxPrice: maxPrice !== null && maxPrice >= 0 ? maxPrice : null,
    minRating:
      minRating !== null && minRating > 0 ? Math.min(minRating, 5) : null,
    sort: sort && isSortOption(sort) ? sort : DEFAULT_CATALOG_SORT,
  };
}

export function parseCatalogPagination(
  params: URLSearchParams,
): CatalogPaginationState {
  const page = toFiniteNumber(params.get(CATALOG_FILTER_PARAMS.page));
  const pageSize = toFiniteNumber(params.get(CATALOG_FILTER_PARAMS.pageSize));
  return {
    page: page !== null && page >= 1 ? Math.floor(page) : 1,
    pageSize:
      pageSize !== null &&
      (PAGE_SIZE_OPTIONS as readonly number[]).includes(pageSize)
        ? pageSize
        : DEFAULT_CATALOG_PAGE_SIZE,
  };
}

export function buildCatalogSearchParams(
  filters: CatalogFilters,
  pagination?: CatalogPaginationState,
): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search) params.set(CATALOG_FILTER_PARAMS.search, filters.search);
  filters.categories.forEach((value) =>
    params.append(CATALOG_FILTER_PARAMS.categories, value),
  );
  filters.authors.forEach((value) =>
    params.append(CATALOG_FILTER_PARAMS.authors, value),
  );
  filters.languages.forEach((value) =>
    params.append(CATALOG_FILTER_PARAMS.languages, value),
  );
  filters.publishers.forEach((value) =>
    params.append(CATALOG_FILTER_PARAMS.publishers, value),
  );
  if (filters.minPrice !== null) {
    params.set(CATALOG_FILTER_PARAMS.minPrice, String(filters.minPrice));
  }
  if (filters.maxPrice !== null) {
    params.set(CATALOG_FILTER_PARAMS.maxPrice, String(filters.maxPrice));
  }
  if (filters.minRating !== null) {
    params.set(CATALOG_FILTER_PARAMS.minRating, String(filters.minRating));
  }
  if (filters.sort !== DEFAULT_CATALOG_SORT) {
    params.set(CATALOG_FILTER_PARAMS.sort, filters.sort);
  }
  if (pagination) {
    if (pagination.page > 1) {
      params.set(CATALOG_FILTER_PARAMS.page, String(pagination.page));
    }
    if (pagination.pageSize !== DEFAULT_CATALOG_PAGE_SIZE) {
      params.set(CATALOG_FILTER_PARAMS.pageSize, String(pagination.pageSize));
    }
  }
  return params;
}

export function countActiveCatalogFilters(filters: CatalogFilters): number {
  return (
    filters.categories.length +
    filters.authors.length +
    filters.languages.length +
    filters.publishers.length +
    (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0) +
    (filters.minRating !== null ? 1 : 0)
  );
}

const matchesSelection = (values: string[], selected: string[]): boolean =>
  selected.length === 0 ||
  selected.some((candidate) =>
    values.some((value) => normalize(value) === normalize(candidate)),
  );

const matchesSearch = (book: Book, term: string): boolean => {
  const needle = normalize(term);
  if (!needle) return true;
  return [
    book.title,
    ...book.authors,
    ...book.categories,
    book.publisher ?? '',
    book.language ?? '',
  ].some((value) => normalize(value).includes(needle));
};

const priceOf = (book: Book): number => {
  const price = Number(book.price);
  return Number.isFinite(price) ? price : 0;
};

const ratingOf = (book: Book): number => {
  const rating = Number(book.rating ?? 0);
  return Number.isFinite(rating) ? rating : 0;
};

/**
 * True when the book satisfies every active filter. Pass `exclude` to ignore a
 * single facet group — used to build "what happens if I also pick this" counts.
 */
export function matchesCatalogFilters(
  book: Book,
  filters: CatalogFilters,
  exclude?: CatalogFacetDimension,
): boolean {
  if (!matchesSearch(book, filters.search)) return false;
  if (
    exclude !== 'categories' &&
    !matchesSelection(book.categories, filters.categories)
  ) {
    return false;
  }
  if (
    exclude !== 'authors' &&
    !matchesSelection(book.authors, filters.authors)
  ) {
    return false;
  }
  if (
    exclude !== 'languages' &&
    !matchesSelection(book.language ? [book.language] : [], filters.languages)
  ) {
    return false;
  }
  if (
    exclude !== 'publishers' &&
    !matchesSelection(
      book.publisher ? [book.publisher] : [],
      filters.publishers,
    )
  ) {
    return false;
  }
  if (filters.minPrice !== null || filters.maxPrice !== null) {
    const lower = filters.minPrice ?? -Infinity;
    const upper = filters.maxPrice ?? Infinity;
    const price = priceOf(book);
    if (price < Math.min(lower, upper) || price > Math.max(lower, upper)) {
      return false;
    }
  }
  if (filters.minRating !== null && ratingOf(book) < filters.minRating) {
    return false;
  }
  return true;
}

const compareText = (a: string, b: string): number =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

const timeOf = (value?: string): number => {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const relevanceScore = (book: Book, term: string): number => {
  const needle = normalize(term);
  if (!needle) return 0;
  const title = normalize(book.title);
  if (title === needle) return 4;
  if (title.startsWith(needle)) return 3;
  if (title.includes(needle)) return 2;
  if (book.authors.some((author) => normalize(author).includes(needle))) {
    return 1;
  }
  return 0;
};

/** Returns a new array; the input order is kept as the tie-breaker. */
export function sortCatalogBooks(
  books: Book[],
  filters: CatalogFilters,
): Book[] {
  const sorted = [...books];
  switch (filters.sort) {
    case 'newest':
      sorted.sort((a, b) => timeOf(b.publishedDate) - timeOf(a.publishedDate));
      break;
    case 'popular':
      sorted.sort((a, b) => b.soldCopies - a.soldCopies);
      break;
    case 'rating-desc':
      sorted.sort((a, b) => ratingOf(b) - ratingOf(a));
      break;
    case 'price-asc':
      sorted.sort((a, b) => priceOf(a) - priceOf(b));
      break;
    case 'price-desc':
      sorted.sort((a, b) => priceOf(b) - priceOf(a));
      break;
    case 'title-asc':
      sorted.sort((a, b) => compareText(a.title, b.title));
      break;
    case 'title-desc':
      sorted.sort((a, b) => compareText(b.title, a.title));
      break;
    case 'relevance':
    default:
      // Without a query the catalog's own ordering (title, A–Z) is the most
      // useful default; with a query, rank the closest title matches first.
      if (filters.search) {
        sorted.sort(
          (a, b) =>
            relevanceScore(b, filters.search) -
              relevanceScore(a, filters.search) || ratingOf(b) - ratingOf(a),
        );
      }
  }
  return sorted;
}

export function applyCatalogFilters(
  books: Book[],
  filters: CatalogFilters,
): Book[] {
  return sortCatalogBooks(
    books.filter((book) => matchesCatalogFilters(book, filters)),
    filters,
  );
}

const FACET_VALUES: Record<CatalogFacetDimension, (book: Book) => string[]> = {
  categories: (book) => book.categories,
  authors: (book) => book.authors,
  languages: (book) => (book.language ? [book.language] : []),
  publishers: (book) => (book.publisher ? [book.publisher] : []),
};

const distinctValues = (
  books: Book[],
  resolve: (book: Book) => string[],
): string[] => {
  const unique = new Map<string, string>();
  for (const book of books) {
    for (const raw of resolve(book)) {
      const value = raw.trim();
      if (value && !unique.has(normalize(value))) {
        unique.set(normalize(value), value);
      }
    }
  }
  return [...unique.values()];
};

const priceBounds = (books: Book[]): { min: number; max: number } => {
  let min = Infinity;
  let max = -Infinity;
  for (const book of books) {
    const price = Number(book.price);
    if (!Number.isFinite(price)) continue;
    min = Math.min(min, price);
    max = Math.max(max, price);
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return { min: 0, max: 0 };
  const low = Math.max(0, Math.floor(min));
  const high = Math.ceil(max);
  return { min: low, max: high > low ? high : low + 1 };
};

export function buildCatalogFacets(
  books: Book[],
  filters: CatalogFilters,
): CatalogFacets {
  const buildOptions = (
    dimension: CatalogFacetDimension,
  ): CatalogFacetOption[] => {
    const resolve = FACET_VALUES[dimension];
    const values = new Map<string, string>();
    for (const value of distinctValues(books, resolve)) {
      values.set(normalize(value), value);
    }
    // Keep currently selected values visible even if the catalog changed.
    for (const value of filters[dimension]) {
      const key = normalize(value);
      if (!values.has(key)) values.set(key, value);
    }
    return [...values.values()]
      .map((value) => ({
        value,
        count: books.filter(
          (book) =>
            matchesCatalogFilters(book, filters, dimension) &&
            resolve(book).some(
              (entry) => normalize(entry) === normalize(value),
            ),
        ).length,
      }))
      .sort((a, b) => compareText(a.value, b.value));
  };

  return {
    categories: buildOptions('categories'),
    authors: buildOptions('authors'),
    languages: buildOptions('languages'),
    publishers: buildOptions('publishers'),
    priceBounds: priceBounds(books),
  };
}
