import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Book } from '@/interfaces/models';
import BookDetailPage from '@/modules/catalog/screens/BookDetailPage';
import { UiProvider } from '@/modules/ui/context/UiContext';
import '@/i18n';

const mockAddToCart = jest.fn().mockResolvedValue(undefined);
const mockAddFavorite = jest.fn().mockResolvedValue(undefined);
const mockRemoveFavorite = jest.fn().mockResolvedValue(undefined);
const mockCreateReview = jest.fn().mockResolvedValue(undefined);
const mockUpdateReview = jest.fn().mockResolvedValue(undefined);
const mockDeleteReview = jest.fn().mockResolvedValue(undefined);
const mockReportReview = jest.fn().mockResolvedValue(undefined);

const sampleBook: Book = {
  ID: 12,
  title: 'Refactoring Digital Editions',
  description:
    'A detailed guide on software craftsmanship and editorial quality.',
  price: '29.95',
  image: '',
  authors: ['Elena Vance', 'Marcus Sterling'],
  categories: ['Software Engineering', 'Design'],
  publisher: 'Parchment Press',
  publishedDate: '2025-03-15',
  pageCount: 340,
  rating: 4.5,
  language: 'English',
  avgReadingTime: '6 hs and 48 minutes',
  soldCopies: 42,
  reviews: [
    {
      ID: 101,
      title: 'Thoughtful and deep',
      review: 'One of the clearest technical books I have read this year.',
      rating: 5,
      createdAt: '2025-04-01T10:00:00.000Z',
      bookID: 12,
      userID: 99,
      user: {
        ID: 99,
        username: 'other_reader',
        profilePic: '',
      },
      reports: [],
    },
  ],
  createdAt: '2025-03-15T00:00:00.000Z',
};

let mockBookState: {
  data: Book | undefined;
  isPending: boolean;
  isError: boolean;
} = {
  data: sampleBook,
  isPending: false,
  isError: false,
};

let mockCartItems: Book[] = [];

jest.mock('@/modules/catalog/hooks/useBooks', () => ({
  useBook: () => mockBookState,
}));

jest.mock('@/modules/auth/context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      ID: 1,
      username: 'jdoe',
      email: 'jane@example.com',
      name: 'Jane',
      surname: 'Doe',
      profilePic: '',
      role: 'user',
      admin: false,
      enabled: true,
      banned: false,
      suspendedTimes: 0,
      createdAt: '2025-01-01T00:00:00.000Z',
    },
  }),
}));

jest.mock('@/modules/account/context/CartContext', () => ({
  useCart: () => ({
    items: mockCartItems,
    loading: false,
    add: mockAddToCart,
    remove: jest.fn(),
  }),
}));

jest.mock('@/modules/account/context/FavoritesContext', () => ({
  useFavorites: () => ({
    items: [],
    loading: false,
    add: mockAddFavorite,
    remove: mockRemoveFavorite,
  }),
}));

jest.mock('@/modules/account/services/account.service', () => ({
  accountService: {
    createReview: (...args: unknown[]) => mockCreateReview(...args),
    updateReview: (...args: unknown[]) => mockUpdateReview(...args),
    deleteReview: (...args: unknown[]) => mockDeleteReview(...args),
    reportReview: (...args: unknown[]) => mockReportReview(...args),
  },
}));

function renderBookDetail(initialPath = '/books/12') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <UiProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/books/:id" element={<BookDetailPage />} />
          </Routes>
        </MemoryRouter>
      </UiProvider>
    </QueryClientProvider>,
  );
}

describe('BookDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockBookState = {
      data: sampleBook,
      isPending: false,
      isError: false,
    };
    mockCartItems = [];
  });

  it('renders book hero, cover fallback, edition metadata, and reader reviews', () => {
    renderBookDetail();

    expect(
      screen.getByRole('heading', { name: 'Refactoring Digital Editions' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Elena Vance' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Parchment Press')).toBeInTheDocument();
    expect(screen.getByText('340 pages')).toBeInTheDocument();
    expect(screen.getByText('6 hs and 48 minutes')).toBeInTheDocument();
    expect(screen.getByText('Thoughtful and deep')).toBeInTheDocument();
    expect(screen.getByText(/other_reader/)).toBeInTheDocument();
  });

  it('triggers addToCart when clicking Add to cart and shows In cart link when already in cart', async () => {
    const user = userEvent.setup();
    const { unmount } = renderBookDetail();

    await user.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(mockAddToCart).toHaveBeenCalledWith(12);

    unmount();
    mockCartItems = [sampleBook];
    renderBookDetail();

    expect(
      screen.getByRole('link', { name: /in cart · view cart/i }),
    ).toHaveAttribute('href', '/cart');
  });

  it('renders an intentional error state when book ID is invalid or missing', () => {
    renderBookDetail('/books/invalid-id');

    expect(
      screen.getByText('This book could not be found.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /back to catalog/i }),
    ).toHaveAttribute('href', '/books');
  });
});
