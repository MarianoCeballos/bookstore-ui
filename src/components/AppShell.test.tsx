import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AppShell from '@/components/AppShell';
import '@/i18n';

const mockLogout = jest.fn();
const mockSetLanguage = jest.fn();

jest.mock('@/assets/Book_Logo.png', () => 'book-logo.png');

jest.mock('@/components/SearchBox', () => ({
  __esModule: true,
  default: () => <div data-testid="search-box" />,
}));

jest.mock('@/modules/auth/context/AuthContext', () => ({
  useAuth: () => ({
    user: {
      ID: 1,
      username: 'jdoe',
      email: 'jane.doe@example.com',
      name: 'Jane',
      surname: 'Doe',
      profilePic: '',
      role: 'admin',
      admin: true,
      enabled: true,
      banned: false,
      suspendedTimes: 0,
      createdAt: '2025-01-01T00:00:00.000Z',
    },
    logout: mockLogout,
  }),
}));

jest.mock('@/modules/account/context/CartContext', () => ({
  useCart: () => ({
    items: [{ ID: 1 }, { ID: 2 }],
  }),
}));

jest.mock('@/modules/account/context/FavoritesContext', () => ({
  useFavorites: () => ({
    items: [{ ID: 10 }],
  }),
}));

jest.mock('@/modules/ui/context/UiContext', () => ({
  useUi: () => ({
    language: 'en',
    setLanguage: mockSetLanguage,
  }),
}));

describe('AppShell', () => {
  it('renders single cart/favorites actions, user initials avatar, and user dropdown menu', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AppShell />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole('link', { name: /cart/i })).toHaveLength(1);
    expect(screen.getAllByRole('link', { name: /favorites/i })).toHaveLength(1);
    expect(screen.getByText('JD')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /my account/i }));

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('jane.doe@example.com')).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: /my account/i }),
    ).toHaveAttribute('href', '/account');
    expect(
      screen.getByRole('menuitem', { name: /purchase history/i }),
    ).toHaveAttribute('href', '/history');
    expect(
      screen.getByRole('menuitem', { name: /admin dashboard/i }),
    ).toHaveAttribute('href', '/admin');
    expect(
      screen.getByRole('menuitem', { name: /sign out/i }),
    ).toBeInTheDocument();
  });
});
