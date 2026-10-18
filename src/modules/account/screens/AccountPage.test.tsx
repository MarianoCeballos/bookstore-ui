import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MAX_PROFILE_PIC_BYTES } from '@/constants';
import type { User } from '@/interfaces/models';
import AccountPage from '@/modules/account/screens/AccountPage';
import { AuthenticatedUserProvider } from '@/modules/auth/context/AuthenticatedUserContext';
import '@/i18n';

const mockUser: User = {
  ID: 1,
  username: 'admin',
  email: 'admin@example.com',
  name: 'Test',
  surname: 'Admin',
  profilePic: 'data:image/png;base64,iVBORw0KGgo=',
  role: 'admin',
  admin: true,
  enabled: true,
  banned: false,
  suspendedTimes: 0,
  createdAt: '2026-10-17T00:54:21.369Z',
};

const mockUpdateProfile = jest.fn().mockResolvedValue(undefined);
const mockUploadProfilePicture = jest.fn().mockResolvedValue(undefined);
const mockRemoveProfilePicture = jest.fn().mockResolvedValue(undefined);
const mockChangePassword = jest.fn().mockResolvedValue(undefined);
const mockUserReviews = jest.fn().mockResolvedValue({
  ID: 1,
  username: 'admin',
  name: 'Test',
  surname: 'Admin',
  profilePic: 'data:image/png;base64,iVBORw0KGgo=',
  reviews: [],
});

jest.mock('@/modules/auth/context/AuthContext', () => ({
  useAuth: () => ({
    updateProfile: mockUpdateProfile,
    uploadProfilePicture: mockUploadProfilePicture,
    removeProfilePicture: mockRemoveProfilePicture,
    changePassword: mockChangePassword,
  }),
}));

jest.mock('@/modules/account/context/CartContext', () => ({
  useCart: () => ({
    items: [{ ID: 1 }],
  }),
}));

jest.mock('@/modules/account/context/FavoritesContext', () => ({
  useFavorites: () => ({
    items: [],
  }),
}));

jest.mock('@/modules/catalog/hooks/useCatalogQueries', () => ({
  useOrders: () => ({
    data: [],
    isPending: false,
    isError: false,
  }),
}));

jest.mock('@/modules/ui/context/UiContext', () => ({
  useUi: () => ({
    language: 'en',
    setLanguage: jest.fn(),
  }),
}));

jest.mock('@/modules/account/services/account.service', () => ({
  accountService: {
    userReviews: (...args: unknown[]) => mockUserReviews(...args),
  },
}));

describe('AccountPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderPage = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AuthenticatedUserProvider user={mockUser}>
            <AccountPage />
          </AuthenticatedUserProvider>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it('uploads a valid image file and rejects oversized or invalid format files', async () => {
    renderPage();

    const input = screen.getByTestId(
      'profile-picture-input',
    ) as HTMLInputElement;

    const validFile = new File(['png-bytes'], 'avatar.png', {
      type: 'image/png',
    });
    fireEvent.change(input, { target: { files: [validFile] } });

    await waitFor(() => {
      expect(mockUploadProfilePicture).toHaveBeenCalledWith(validFile);
    });

    const invalidTypeFile = new File(['<svg/>'], 'bad.svg', {
      type: 'image/svg+xml',
    });
    fireEvent.change(input, { target: { files: [invalidTypeFile] } });

    expect(
      await screen.findByText(/valid jpg, png, webp, or gif/i),
    ).toBeInTheDocument();
    expect(mockUploadProfilePicture).toHaveBeenCalledTimes(1);

    const oversizedFile = new File(['x'], 'huge.jpg', { type: 'image/jpeg' });
    Object.defineProperty(oversizedFile, 'size', {
      value: MAX_PROFILE_PIC_BYTES + 100,
    });
    fireEvent.change(input, { target: { files: [oversizedFile] } });

    expect(await screen.findByText(/2 mb or smaller/i)).toBeInTheDocument();
    expect(mockUploadProfilePicture).toHaveBeenCalledTimes(1);
  });
});
