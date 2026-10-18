import type { Book } from '@/interfaces/models';
import type { CatalogFilters } from '@/modules/catalog/types';
import {
  applyCatalogFilters,
  buildCatalogFacets,
  buildCatalogSearchParams,
  countActiveCatalogFilters,
  createEmptyCatalogFilters,
  matchesCatalogFilters,
  parseCatalogFilters,
  parseCatalogPagination,
} from '@/modules/catalog/utils/catalogFilters';

const makeBook = (
  overrides: Partial<Book> & Pick<Book, 'ID' | 'title'>,
): Book => ({
  description: 'A test description',
  price: '10.00',
  image: 'cover.jpg',
  authors: ['Author One'],
  categories: ['Fiction'],
  publisher: 'Publisher',
  publishedDate: '2020-01-01',
  pageCount: 120,
  rating: 4,
  language: 'English',
  avgReadingTime: '2 hs and 24 minutes',
  soldCopies: 0,
  reviews: [],
  createdAt: '2020-01-01T00:00:00.000Z',
  ...overrides,
});

const books: Book[] = [
  makeBook({
    ID: 1,
    title: 'Dune',
    categories: ['Sci-Fi'],
    authors: ['Frank Herbert'],
    price: '10.00',
    rating: 4.5,
    soldCopies: 120,
    publishedDate: '2020-06-01',
  }),
  makeBook({
    ID: 2,
    title: 'Emma',
    categories: ['Classics'],
    authors: ['Jane Austen'],
    price: '20.00',
    rating: 4,
    soldCopies: 40,
    publishedDate: '2018-01-01',
  }),
  makeBook({
    ID: 3,
    title: 'Foundation',
    categories: ['Sci-Fi'],
    authors: ['Isaac Asimov'],
    price: '30.00',
    rating: 5,
    soldCopies: 10,
    publishedDate: '2024-05-14',
  }),
  makeBook({
    ID: 4,
    title: 'Hamlet',
    categories: ['Classics'],
    authors: ['William Shakespeare'],
    price: '5.00',
    rating: 3,
    soldCopies: 5,
    publishedDate: '2016-03-01',
    language: 'Spanish',
    publisher: 'Other Press',
  }),
];

const withFilters = (overrides: Partial<CatalogFilters>): CatalogFilters => ({
  ...createEmptyCatalogFilters(),
  ...overrides,
});

const titlesOf = (list: Book[]): string[] => list.map((book) => book.title);

describe('parseCatalogFilters', () => {
  it('reads repeated and comma separated facet params', () => {
    const params = new URLSearchParams(
      'category=Sci-Fi&category=Classics&author=Frank+Herbert,Isaac+Asimov',
    );
    const filters = parseCatalogFilters(params);
    expect(filters.categories).toEqual(['Sci-Fi', 'Classics']);
    expect(filters.authors).toEqual(['Frank Herbert', 'Isaac Asimov']);
  });

  it('deduplicates case-insensitively and keeps the first spelling', () => {
    const params = new URLSearchParams('category=sci-fi&category=Sci-Fi');
    expect(parseCatalogFilters(params).categories).toEqual(['sci-fi']);
  });

  it('falls back to the default sort for unknown values', () => {
    expect(parseCatalogFilters(new URLSearchParams('sort=whatever')).sort).toBe(
      'relevance',
    );
    expect(
      parseCatalogFilters(new URLSearchParams('sort=price-asc')).sort,
    ).toBe('price-asc');
  });

  it('ignores invalid numeric filters and clamps the rating', () => {
    const filters = parseCatalogFilters(
      new URLSearchParams('minPrice=-5&maxPrice=abc&minRating=9'),
    );
    expect(filters.minPrice).toBeNull();
    expect(filters.maxPrice).toBeNull();
    expect(filters.minRating).toBe(5);
  });
});

describe('buildCatalogSearchParams', () => {
  it('omits default values to keep URLs clean', () => {
    const params = buildCatalogSearchParams(createEmptyCatalogFilters(), {
      page: 1,
      pageSize: 12,
    });
    expect(params.toString()).toBe('');
  });

  it('round-trips every filter', () => {
    const filters = withFilters({
      search: 'dune',
      categories: ['Sci-Fi'],
      languages: ['Spanish'],
      minPrice: 5,
      maxPrice: 25,
      minRating: 4,
      sort: 'price-desc',
    });
    const params = buildCatalogSearchParams(filters, { page: 3, pageSize: 24 });
    expect(parseCatalogFilters(params)).toEqual(filters);
    expect(parseCatalogPagination(params)).toEqual({ page: 3, pageSize: 24 });
  });

  it('drops an unsupported page size', () => {
    expect(parseCatalogPagination(new URLSearchParams('pageSize=999'))).toEqual(
      { page: 1, pageSize: 12 },
    );
  });
});

describe('countActiveCatalogFilters', () => {
  it('counts every filter group but not the sort', () => {
    expect(countActiveCatalogFilters(createEmptyCatalogFilters())).toBe(0);
    expect(
      countActiveCatalogFilters(
        withFilters({
          categories: ['Sci-Fi'],
          authors: ['Frank Herbert'],
          minPrice: 5,
          minRating: 4,
          sort: 'price-asc',
        }),
      ),
    ).toBe(4);
  });
});

describe('matchesCatalogFilters', () => {
  it('matches free text across title, author, category and publisher', () => {
    expect(
      matchesCatalogFilters(books[0], withFilters({ search: 'dune' })),
    ).toBe(true);
    expect(
      matchesCatalogFilters(books[0], withFilters({ search: 'herbert' })),
    ).toBe(true);
    expect(
      matchesCatalogFilters(books[0], withFilters({ search: 'sci' })),
    ).toBe(true);
    expect(
      matchesCatalogFilters(books[0], withFilters({ search: 'austen' })),
    ).toBe(false);
  });

  it('treats multi-select facets as OR within a group', () => {
    const filters = withFilters({ categories: ['Sci-Fi', 'Classics'] });
    expect(applyCatalogFilters(books, filters)).toHaveLength(4);
    expect(
      titlesOf(
        applyCatalogFilters(books, withFilters({ categories: ['Sci-Fi'] })),
      ),
    ).toEqual(['Dune', 'Foundation']);
  });

  it('combines different facet groups as AND', () => {
    const filters = withFilters({
      categories: ['Classics'],
      languages: ['Spanish'],
    });
    expect(titlesOf(applyCatalogFilters(books, filters))).toEqual(['Hamlet']);
  });

  it('filters by price range regardless of the bounds order', () => {
    const filters = withFilters({ minPrice: 20, maxPrice: 10 });
    expect(titlesOf(applyCatalogFilters(books, filters))).toEqual([
      'Dune',
      'Emma',
    ]);
  });

  it('filters by minimum rating', () => {
    const filters = withFilters({ minRating: 4.5 });
    expect(titlesOf(applyCatalogFilters(books, filters))).toEqual([
      'Dune',
      'Foundation',
    ]);
  });
});

describe('sortCatalogBooks', () => {
  const sortedTitles = (partial: Partial<CatalogFilters>): string[] =>
    titlesOf(applyCatalogFilters(books, withFilters(partial)));

  it('keeps the catalog order for relevance without a search term', () => {
    expect(sortedTitles({ sort: 'relevance' })).toEqual([
      'Dune',
      'Emma',
      'Foundation',
      'Hamlet',
    ]);
  });

  it('ranks title matches above author matches, then by rating', () => {
    // 'a' appears in every author list; it only ranks the three titles that
    // contain it on top, best rated first, leaving Dune last.
    expect(sortedTitles({ sort: 'relevance', search: 'a' })).toEqual([
      'Foundation',
      'Emma',
      'Hamlet',
      'Dune',
    ]);
  });

  it('sorts by price, rating, popularity and recency', () => {
    expect(sortedTitles({ sort: 'price-asc' })).toEqual([
      'Hamlet',
      'Dune',
      'Emma',
      'Foundation',
    ]);
    expect(sortedTitles({ sort: 'price-desc' })).toEqual([
      'Foundation',
      'Emma',
      'Dune',
      'Hamlet',
    ]);
    expect(sortedTitles({ sort: 'rating-desc' }).slice(0, 2)).toEqual([
      'Foundation',
      'Dune',
    ]);
    expect(sortedTitles({ sort: 'popular' }).slice(0, 2)).toEqual([
      'Dune',
      'Emma',
    ]);
    expect(sortedTitles({ sort: 'newest' }).slice(0, 2)).toEqual([
      'Foundation',
      'Dune',
    ]);
  });

  it('sorts titles alphabetically', () => {
    expect(sortedTitles({ sort: 'title-asc' })).toEqual([
      'Dune',
      'Emma',
      'Foundation',
      'Hamlet',
    ]);
    expect(sortedTitles({ sort: 'title-desc' })).toEqual([
      'Hamlet',
      'Foundation',
      'Emma',
      'Dune',
    ]);
  });
});

describe('buildCatalogFacets', () => {
  it('lists every value once with its catalog count', () => {
    const facets = buildCatalogFacets(books, createEmptyCatalogFilters());
    expect(facets.categories).toEqual([
      { value: 'Classics', count: 2 },
      { value: 'Sci-Fi', count: 2 },
    ]);
    expect(facets.languages.map((option) => option.value)).toEqual([
      'English',
      'Spanish',
    ]);
  });

  it('counts options against the other active filters only', () => {
    const facets = buildCatalogFacets(books, withFilters({ minRating: 4.5 }));
    expect(facets.categories).toEqual([
      { value: 'Classics', count: 0 },
      { value: 'Sci-Fi', count: 2 },
    ]);
    expect(facets.authors).toEqual([
      { value: 'Frank Herbert', count: 1 },
      { value: 'Isaac Asimov', count: 1 },
      { value: 'Jane Austen', count: 0 },
      { value: 'William Shakespeare', count: 0 },
    ]);
  });

  it('keeps a selected value visible even if it left the catalog', () => {
    const facets = buildCatalogFacets(
      books,
      withFilters({ categories: ['Removed genre'] }),
    );
    expect(facets.categories).toContainEqual({
      value: 'Removed genre',
      count: 0,
    });
  });

  it('reports the catalog price bounds', () => {
    expect(
      buildCatalogFacets(books, createEmptyCatalogFilters()).priceBounds,
    ).toEqual({ min: 5, max: 30 });
  });
});
