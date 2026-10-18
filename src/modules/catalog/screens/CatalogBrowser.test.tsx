import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { Book } from '@/interfaces/models';
import CatalogBrowser from '@/modules/catalog/screens/CatalogBrowser';
import '@/i18n';

const mockBooks: Book[] = [
  {
    ID: 1,
    title: 'Dune',
    description: 'Desert planet politics.',
    price: '10.00',
    image: 'dune.jpg',
    authors: ['Frank Herbert'],
    categories: ['Sci-Fi'],
    publisher: 'Penguin',
    publishedDate: '2020-06-01',
    pageCount: 412,
    rating: 4.5,
    language: 'English',
    avgReadingTime: '2 hs and 24 minutes',
    soldCopies: 120,
    reviews: [],
    createdAt: '2020-06-01T00:00:00.000Z',
  },
  {
    ID: 2,
    title: 'Emma',
    description: 'A matchmaking comedy.',
    price: '20.00',
    image: 'emma.jpg',
    authors: ['Jane Austen'],
    categories: ['Classics'],
    publisher: 'Oxford',
    publishedDate: '2018-01-01',
    pageCount: 320,
    rating: 4,
    language: 'English',
    avgReadingTime: '2 hs and 0 minutes',
    soldCopies: 40,
    reviews: [],
    createdAt: '2018-01-01T00:00:00.000Z',
  },
  {
    ID: 3,
    title: 'Foundation',
    description: 'Galactic empire falls.',
    price: '30.00',
    image: 'foundation.jpg',
    authors: ['Isaac Asimov'],
    categories: ['Sci-Fi'],
    publisher: 'Penguin',
    publishedDate: '2024-05-14',
    pageCount: 255,
    rating: 5,
    language: 'English',
    avgReadingTime: '1 hs and 30 minutes',
    soldCopies: 10,
    reviews: [],
    createdAt: '2024-05-14T00:00:00.000Z',
  },
  {
    ID: 4,
    title: 'Hamlet',
    description: 'A Danish prince.',
    price: '5.00',
    image: 'hamlet.jpg',
    authors: ['William Shakespeare'],
    categories: ['Classics'],
    publisher: 'Other Press',
    publishedDate: '2016-03-01',
    pageCount: 160,
    rating: 3,
    language: 'Spanish',
    avgReadingTime: '1 hs and 0 minutes',
    soldCopies: 5,
    reviews: [],
    createdAt: '2016-03-01T00:00:00.000Z',
  },
];

jest.mock('@/modules/catalog/hooks/useBooks', () => ({
  useBooks: () => ({
    data: mockBooks,
    isPending: false,
    isError: false,
    refetch: jest.fn(),
  }),
}));

const renderAt = (url: string) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <CatalogBrowser />
    </MemoryRouter>,
  );

/** Book titles only, in the order the grid renders them. */
const visibleTitles = () =>
  screen
    .getAllByRole('link')
    .map((element) => element.textContent ?? '')
    .filter((text) => mockBooks.some((book) => book.title === text));

describe('CatalogBrowser', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  it('shows the whole catalog by default with a result count', () => {
    renderAt('/books');

    expect(visibleTitles()).toEqual(['Dune', 'Emma', 'Foundation', 'Hamlet']);
    expect(screen.getByText('4 books')).toBeInTheDocument();
    expect(screen.queryByText('Active filters')).not.toBeInTheDocument();
  });

  it('applies facet filters from the URL and surfaces them as chips', () => {
    renderAt('/books?category=Sci-Fi');

    expect(visibleTitles()).toEqual(['Dune', 'Foundation']);
    expect(screen.getByText('2 books')).toBeInTheDocument();
    expect(screen.getByText('Active filters')).toBeInTheDocument();
    expect(screen.getByText('Sci-Fi')).toBeInTheDocument();
  });

  it('combines free text search with facet filters', () => {
    renderAt('/books?search=foundation&category=Sci-Fi');

    expect(visibleTitles()).toEqual(['Foundation']);
    expect(screen.getByText('Results for “foundation”')).toBeInTheDocument();
  });

  it('renders the empty state with a way out when nothing matches', () => {
    renderAt('/books?category=Unknown');

    expect(
      screen.getByText('No books matched your search.'),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: 'Clear filters' }).length,
    ).toBeGreaterThan(0);
  });

  it('re-sorts the results from the toolbar selector', async () => {
    const user = userEvent.setup();
    renderAt('/books');

    await user.click(screen.getByRole('combobox', { name: 'Sort by' }));
    await user.click(
      screen.getByRole('option', { name: 'Price: low to high' }),
    );

    expect(visibleTitles()).toEqual(['Hamlet', 'Dune', 'Emma', 'Foundation']);
  });

  it('filters from the mobile drawer', async () => {
    const user = userEvent.setup();
    renderAt('/books');

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    expect(await screen.findByText('Categories')).toBeInTheDocument();

    const sciFi = screen.getByRole('checkbox', { name: /Sci-Fi/ });
    expect(sciFi).not.toBeChecked();

    await user.click(sciFi);

    expect(sciFi).toBeChecked();
  });

  it('narrows the category list with its own search box', async () => {
    const user = userEvent.setup();
    renderAt('/books');

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    const search = await screen.findByLabelText('Search categories');

    expect(
      screen.getByRole('checkbox', { name: /Classics/ }),
    ).toBeInTheDocument();

    await user.type(search, 'sci');

    expect(
      screen.getByRole('checkbox', { name: /Sci-Fi/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('checkbox', { name: /Classics/ }),
    ).not.toBeInTheDocument();
  });

  describe('pagination regressions', () => {
    beforeEach(() => {
      mockBooks.push(
        ...Array.from({ length: 20 }, (_, index) => ({
          ...mockBooks[0],
          ID: index + 5,
          title: `Additional book ${index + 1}`,
          categories: ['Additional'],
        })),
      );
    });

    afterEach(() => {
      mockBooks.splice(4);
    });

    it('renders exactly two pages for 24 books at the default size', async () => {
      const user = userEvent.setup();
      renderAt('/books');
      expect(visibleTitles()).toEqual(
        mockBooks.slice(0, 12).map((book) => book.title),
      );
      expect(
        screen.queryByRole('button', { name: 'Go to page 3' }),
      ).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Go to next page' }));
      expect(visibleTitles()).toEqual(
        mockBooks.slice(12).map((book) => book.title),
      );
      expect(
        screen.getByRole('button', { name: 'Go to next page' }),
      ).toBeDisabled();
      expect(screen.getByText(/13.*24.*24/)).toBeInTheDocument();
      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    it('shows the remaining single book on a partial final page', () => {
      mockBooks.push({ ...mockBooks[0], ID: 25, title: 'Final book' });
      renderAt('/books?page=3');
      expect(visibleTitles()).toEqual(['Final book']);
      expect(screen.getByText(/25.*25.*25/)).toBeInTheDocument();
      expect(
        screen.queryByText('No books matched your search.'),
      ).not.toBeInTheDocument();
    });

    it('clamps an outdated page URL to the last populated page', () => {
      renderAt('/books?page=999');
      expect(visibleTitles()).toEqual(
        mockBooks.slice(12).map((book) => book.title),
      );
      expect(screen.getByRole('button', { name: 'page 2' })).toHaveAttribute(
        'aria-current',
        'page',
      );
    });

    it('calculates page count from filtered results', () => {
      renderAt('/books?category=Sci-Fi&page=9');
      expect(visibleTitles()).toEqual(['Dune', 'Foundation']);
      expect(
        screen.getByRole('button', { name: 'Go to next page' }),
      ).toBeDisabled();
      expect(
        screen.queryByRole('button', { name: 'Go to page 2' }),
      ).not.toBeInTheDocument();
    });

    it('resets to the first page and expands the visible range when page size changes', async () => {
      const user = userEvent.setup();
      renderAt('/books?page=2');
      await user.click(screen.getByRole('combobox', { name: 'Per page' }));
      await user.click(screen.getByRole('option', { name: '24' }));
      expect(visibleTitles()).toEqual(mockBooks.map((book) => book.title));
      expect(screen.getByRole('button', { name: 'page 1' })).toHaveAttribute(
        'aria-current',
        'page',
      );
      expect(
        screen.getByRole('button', { name: 'Go to next page' }),
      ).toBeDisabled();
    });

    it('returns to page one when clearing a search on a later page', async () => {
      const user = userEvent.setup();
      renderAt('/books?search=Additional&page=2');
      expect(visibleTitles()).toHaveLength(8);
      await user.click(screen.getByRole('button', { name: 'Clear' }));
      expect(visibleTitles()).toEqual(
        mockBooks.slice(0, 12).map((book) => book.title),
      );
      expect(
        screen.queryByText('Results for “Additional”'),
      ).not.toBeInTheDocument();
    });
  });
});
