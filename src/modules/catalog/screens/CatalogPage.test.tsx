import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CatalogPage from '@/modules/catalog/screens/CatalogPage';
import type { Book } from '@/interfaces/models';
import '@/i18n';

jest.mock('@/assets/banner.jpg', () => 'banner.jpg');
jest.mock('@/assets/bannerB.jpg', () => 'bannerB.jpg');
jest.mock('@/assets/bannerC.jpg', () => 'bannerC.jpg');
jest.mock('@/assets/bannerD.jpg', () => 'bannerD.jpg');
jest.mock('@/assets/bannerE.jpg', () => 'bannerE.jpg');

const mockBooks: Book[] = Array.from({ length: 24 }, (_, idx) => ({
  ID: idx + 1,
  title: `Book Title ${idx + 1}`,
  description: 'A test description',
  price: '10.00',
  image: 'https://example.test/cover.jpg',
  authors: ['Author One'],
  categories: ['Fiction'],
  publisher: 'Publisher',
  publishedDate: '2025-01-01',
  pageCount: 200,
  rating: 4.5,
  language: 'English',
  avgReadingTime: '180',
  soldCopies: 1,
  reviews: [],
  createdAt: '2025-01-01T00:00:00.000Z',
}));

jest.mock('@/modules/catalog/hooks/useBooks', () => ({
  useBooks: () => ({
    data: mockBooks,
    isPending: false,
    isError: false,
  }),
  useHomeBooks: () => ({
    data: undefined,
    isPending: false,
    isError: false,
  }),
}));

jest.mock('@/modules/lookups/hooks/useLookups', () => ({
  useAuthors: () => ({ data: [] }),
  useCategories: () => ({ data: [] }),
}));

describe('CatalogPage pagination', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  // Renders 24 cards and drives a real navigation; jsdom needs headroom on
  // slower CI machines, so this interaction test gets an explicit timeout.
  it('calculates exact total pages and navigates without phantom pages', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Showing 1–12 of 24 books')).toBeInTheDocument();
    expect(screen.getByText('Book Title 1')).toBeInTheDocument();
    expect(screen.queryByText('Book Title 13')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Go to page 2' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Go to page 3' }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Go to page 2' }));

    expect(screen.getByText('Showing 13–24 of 24 books')).toBeInTheDocument();
    expect(screen.getByText('Book Title 13')).toBeInTheDocument();
    expect(screen.queryByText('Book Title 1')).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Go to page 3' }),
    ).not.toBeInTheDocument();
  }, 20000);
});
