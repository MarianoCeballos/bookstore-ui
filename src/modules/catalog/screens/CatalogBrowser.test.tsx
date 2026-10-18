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
});
