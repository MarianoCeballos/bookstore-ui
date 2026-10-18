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
  sortCatalogBooks,
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

  it('counts each book once even when it repeats a facet with different casing', () => {
    const facets = buildCatalogFacets(
      [
        makeBook({
          ID: 1,
          title: 'A',
          categories: [' Fiction ', 'fiction', ''],
        }),
        makeBook({ ID: 2, title: 'B', categories: ['FICTION'] }),
      ],
      createEmptyCatalogFilters(),
    );
    expect(facets.categories).toEqual([{ value: 'Fiction', count: 2 }]);
  });

  it('ignores a facet own selection when counting alternatives, while retaining other filters', () => {
    const facets = buildCatalogFacets(
      books,
      withFilters({ categories: ['Classics'], languages: ['English'] }),
    );
    expect(facets.categories).toEqual([
      { value: 'Classics', count: 1 },
      { value: 'Sci-Fi', count: 2 },
    ]);
    expect(facets.languages).toEqual([
      { value: 'English', count: 1 },
      { value: 'Spanish', count: 1 },
    ]);
  });

  it('has safe bounds for an empty catalog and excludes invalid prices', () => {
    expect(
      buildCatalogFacets([], createEmptyCatalogFilters()).priceBounds,
    ).toEqual({ min: 0, max: 0 });
    expect(
      buildCatalogFacets(
        [
          makeBook({ ID: 1, title: 'Invalid', price: 'invalid' }),
          makeBook({ ID: 2, title: 'Valid', price: '10.25' }),
        ],
        createEmptyCatalogFilters(),
      ).priceBounds,
    ).toEqual({ min: 10, max: 11 });
  });

  it('provides a usable price range when every book has the same integer price', () => {
    expect(
      buildCatalogFacets(
        [makeBook({ ID: 1, title: 'Free', price: '0' })],
        createEmptyCatalogFilters(),
      ).priceBounds,
    ).toEqual({ min: 0, max: 1 });
  });
});

describe('catalog boundary cases', () => {
  it.each(['', 'page=0', 'page=-1', 'page=NaN', 'page=Infinity', 'page=0.9'])(
    'defaults invalid pagination %p to the first page',
    (query) => {
      expect(parseCatalogPagination(new URLSearchParams(query))).toEqual({
        page: 1,
        pageSize: 12,
      });
    },
  );

  it('floors fractional pages and accepts each supported page size', () => {
    for (const pageSize of [8, 12, 24, 48]) {
      expect(
        parseCatalogPagination(
          new URLSearchParams(`page=2.9&pageSize=${pageSize}`),
        ),
      ).toEqual({ page: 2, pageSize });
    }
  });

  it.each(['0', '-1', '12.5', 'NaN', 'Infinity', ''])(
    'rejects unsupported page size %p',
    (pageSize) => {
      expect(
        parseCatalogPagination(new URLSearchParams({ pageSize })).pageSize,
      ).toBe(12);
    },
  );

  it('does not share mutable selection arrays between empty filter states', () => {
    const first = createEmptyCatalogFilters();
    const second = createEmptyCatalogFilters();
    first.categories.push('Fiction');
    expect(second.categories).toEqual([]);
  });

  it('retains zero-price filters and ignores empty or nonfinite numeric input', () => {
    const filters = parseCatalogFilters(
      new URLSearchParams(
        'minPrice=0&maxPrice=0&minRating=Infinity&search=%20Dune%20',
      ),
    );
    expect(filters).toMatchObject({
      minPrice: 0,
      maxPrice: 0,
      minRating: null,
      search: 'Dune',
    });
    const params = buildCatalogSearchParams(filters);
    expect(params.get('minPrice')).toBe('0');
    expect(params.get('maxPrice')).toBe('0');
    expect(
      parseCatalogFilters(
        new URLSearchParams('minPrice=&maxPrice=Infinity&minRating=0'),
      ),
    ).toMatchObject({ minPrice: null, maxPrice: null, minRating: null });
  });

  it('round-trips multiword facets containing URL metacharacters', () => {
    const filters = withFilters({
      search: 'C++ & books',
      authors: ['Jane Doe', 'A+B'],
      publishers: ['Press & Co.'],
      languages: ['Spanish'],
    });
    expect(
      parseCatalogFilters(
        new URLSearchParams(buildCatalogSearchParams(filters).toString()),
      ),
    ).toEqual(filters);
  });

  it('counts individual facet choices and treats both price bounds as one active filter', () => {
    expect(
      countActiveCatalogFilters(
        withFilters({
          categories: ['Fiction', 'Classics'],
          authors: ['Jane'],
          minPrice: 0,
          maxPrice: 20,
          minRating: 1,
          search: 'Book',
          sort: 'popular',
        }),
      ),
    ).toBe(5);
  });

  it('keeps equal sort keys stable without mutating the caller array', () => {
    const input = [
      makeBook({ ID: 1, title: 'First', price: '20' }),
      makeBook({ ID: 2, title: 'Second', price: '10' }),
      makeBook({ ID: 3, title: 'Third', price: '10' }),
    ];
    expect(
      sortCatalogBooks(input, withFilters({ sort: 'price-asc' })).map(
        (book) => book.ID,
      ),
    ).toEqual([2, 3, 1]);
    expect(input.map((book) => book.ID)).toEqual([1, 2, 3]);
  });

  it('accepts inclusive price and rating boundaries and matches normalized facet values', () => {
    expect(
      matchesCatalogFilters(
        books[0],
        withFilters({
          categories: [' sci-fi '],
          authors: ['FRANK HERBERT'],
          minPrice: 10,
          maxPrice: 10,
          minRating: 4.5,
        }),
      ),
    ).toBe(true);
    expect(
      matchesCatalogFilters(books[0], withFilters({ minPrice: 10.01 })),
    ).toBe(false);
    expect(
      matchesCatalogFilters(books[0], withFilters({ minRating: 4.51 })),
    ).toBe(false);
  });
});
