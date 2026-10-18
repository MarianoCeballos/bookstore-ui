import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import RequireAuth from '@/components/RequireAuth';
import type { User } from '@/interfaces/models';
import { useAuthenticatedUser } from '@/modules/auth/context/AuthenticatedUserContext';

const mockAuth: { user: User | null; loading: boolean } = {
  user: null,
  loading: false,
};

jest.mock('@/modules/auth/context/AuthContext', () => ({
  useAuth: () => mockAuth,
}));

const baseUser: User = {
  ID: 1,
  username: 'admin',
  email: 'admin@example.com',
  name: 'Ada',
  surname: 'Admin',
  role: 'admin',
  admin: true,
  enabled: true,
  banned: false,
  suspendedTimes: 0,
  createdAt: '2025-01-01T00:00:00.000Z',
};

const readerUser: User = {
  ...baseUser,
  ID: 2,
  username: 'reader',
  role: 'user',
  admin: false,
};

function ProtectedProbe() {
  const user = useAuthenticatedUser();
  return <div>{`protected:${user.username}`}</div>;
}

function renderRoutes(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div>login screen</div>} />
        <Route path="/" element={<div>home screen</div>} />
        <Route element={<RequireAuth />}>
          <Route path="/account" element={<ProtectedProbe />} />
        </Route>
        <Route path="/admin" element={<RequireAuth admin />}>
          <Route index element={<ProtectedProbe />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('RequireAuth', () => {
  it('shows a spinner while the session is being restored', () => {
    mockAuth.user = null;
    mockAuth.loading = true;

    renderRoutes('/account');

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('login screen')).not.toBeInTheDocument();
  });

  it('redirects anonymous visitors to the login screen', () => {
    mockAuth.user = null;
    mockAuth.loading = false;

    renderRoutes('/account');

    expect(screen.getByText('login screen')).toBeInTheDocument();
    expect(screen.queryByText(/^protected:/)).not.toBeInTheDocument();
  });

  it('renders protected children with a non-null user', () => {
    mockAuth.user = baseUser;
    mockAuth.loading = false;

    renderRoutes('/account');

    expect(screen.getByText('protected:admin')).toBeInTheDocument();
  });

  it('keeps non-admin users out of admin routes', () => {
    mockAuth.user = readerUser;
    mockAuth.loading = false;

    renderRoutes('/admin');

    expect(screen.getByText('home screen')).toBeInTheDocument();
    expect(screen.queryByText(/^protected:/)).not.toBeInTheDocument();
  });

  it('throws when useAuthenticatedUser is used outside a protected route', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    expect(() =>
      render(
        <MemoryRouter>
          <ProtectedProbe />
        </MemoryRouter>,
      ),
    ).toThrow(
      'useAuthenticatedUser must be used inside a RequireAuth protected route',
    );

    consoleError.mockRestore();
  });
});
