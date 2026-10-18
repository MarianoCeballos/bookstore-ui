import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { STORAGE_KEYS } from '@/constants';
import type { Session, UserPublic } from '@/interfaces/models';
import { accountService } from '@/modules/account/services/account.service';
import { AuthProvider, useAuth } from '@/modules/auth/context/AuthContext';
import { authService } from '@/modules/auth/services/auth.service';

jest.mock('@/modules/auth/services/auth.service', () => ({
  authService: { autoLogin: jest.fn(), login: jest.fn(), register: jest.fn() },
}));
jest.mock('@/modules/account/services/account.service', () => ({
  accountService: {
    updateUser: jest.fn(),
    uploadProfilePicture: jest.fn(),
    removeProfilePicture: jest.fn(),
  },
}));

const publicUser: UserPublic = {
  ID: 7,
  username: 'reader',
  name: 'Jane',
  surname: 'Doe',
  profilePic: '/avatar.png',
  role: 'user',
  admin: false,
  enabled: true,
  banned: false,
  suspendedTimes: 0,
  createdAt: '2026-01-01T00:00:00Z',
};
const session: Session = {
  ...publicUser,
  email: 'reader@example.com',
  token: 'test-session-token',
};
const auth = jest.mocked(authService);
const account = jest.mocked(accountService);
function setup() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  const hook = renderHook(useAuth, {
    wrapper: ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    ),
  });
  return { ...hook, queryClient };
}
async function signIn() {
  const hook = setup();
  await act(() =>
    hook.result.current.login({ username: 'reader', password: 'secret' }),
  );
  return hook;
}

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    jest.resetAllMocks();
    auth.login.mockResolvedValue(session);
    auth.autoLogin.mockResolvedValue(session);
  });
  afterEach(() => localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN));

  it('starts anonymous without requesting a session when no token is stored', () => {
    const { result } = setup();
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(auth.autoLogin).not.toHaveBeenCalled();
  });

  it('restores a stored session, refreshes the token, and hides it from user state', async () => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'old-token');
    const { result } = setup();
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(auth.autoLogin).toHaveBeenCalledTimes(1);
    expect(result.current.user).toMatchObject({ ID: 7, email: session.email });
    expect(result.current.user).not.toHaveProperty('token');
    expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBe(session.token);
  });

  it('drops an invalid stored token and completes loading', async () => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'invalid-token');
    auth.autoLogin.mockRejectedValueOnce(new Error('Unauthorized'));
    const { result } = setup();
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBeNull();
  });

  it('persists a login and clears private cached data on unauthorized events', async () => {
    const { result, queryClient } = await signIn();
    expect(auth.login).toHaveBeenCalledWith({
      username: 'reader',
      password: 'secret',
    });
    expect(result.current.user?.username).toBe('reader');
    for (const key of ['cart', 'favorites', 'orders', 'admin', 'books'])
      queryClient.setQueryData([key, 7], ['cached']);
    act(() => window.dispatchEvent(new CustomEvent('bookstore:unauthorized')));
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)).toBeNull();
    for (const key of ['cart', 'favorites', 'orders', 'admin'])
      expect(queryClient.getQueryData([key, 7])).toBeUndefined();
    expect(queryClient.getQueryData(['books', 7])).toEqual(['cached']);
  });

  it('normalizes profile changes, merges the public response, and invalidates derived data', async () => {
    const { result, queryClient } = await signIn();
    account.updateUser.mockResolvedValueOnce({
      ...publicUser,
      username: 'new-reader',
      name: 'Janet',
      surname: 'Smith',
    });
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    await act(() =>
      result.current.updateProfile({
        username: ' NEW-READER ',
        name: ' Janet ',
        surname: ' Smith ',
        email: ' NEW@EXAMPLE.COM ',
      }),
    );
    expect(account.updateUser).toHaveBeenCalledWith(7, {
      username: 'new-reader',
      name: 'Janet',
      surname: 'Smith',
      email: 'new@example.com',
    });
    expect(result.current.user).toMatchObject({
      username: 'new-reader',
      name: 'Janet',
      email: 'new@example.com',
      admin: false,
    });
    expect(invalidate).toHaveBeenCalledTimes(3);
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['books'] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['user-reviews', 7] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['admin', 'users'] });
  });

  it('preserves profile and caches when an update fails', async () => {
    const { result, queryClient } = await signIn();
    const previous = result.current.user;
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    account.updateUser.mockRejectedValueOnce(
      new Error('Email is already registered'),
    );
    await act(async () => {
      await expect(
        result.current.updateProfile({
          name: 'New',
          surname: 'Name',
          email: 'new@example.com',
        }),
      ).rejects.toThrow('Email is already registered');
    });
    expect(result.current.user).toEqual(previous);
    expect(invalidate).not.toHaveBeenCalled();
  });

  it('updates only the avatar on upload/removal and invalidates user-derived data', async () => {
    const { result, queryClient } = await signIn();
    const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
    account.uploadProfilePicture.mockResolvedValueOnce({
      ...publicUser,
      profilePic: '/new-avatar.png',
      name: 'Unrelated response name',
    });
    account.removeProfilePicture.mockResolvedValueOnce({
      ...publicUser,
      profilePic: '',
    });
    const file = new File(['png'], 'avatar.png', { type: 'image/png' });
    await act(() => result.current.uploadProfilePicture(file));
    expect(account.uploadProfilePicture).toHaveBeenCalledWith(7, file);
    expect(result.current.user).toMatchObject({
      profilePic: '/new-avatar.png',
      name: 'Jane',
    });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['user-reviews', 7] });
    invalidate.mockClear();
    await act(() => result.current.removeProfilePicture());
    expect(account.removeProfilePicture).toHaveBeenCalledWith(7);
    expect(result.current.user).toMatchObject({ profilePic: '', name: 'Jane' });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['books'] });
  });

  it('changes a password without changing profile state', async () => {
    const { result } = await signIn();
    const previous = result.current.user;
    await act(() =>
      result.current.changePassword({
        password: 'current',
        newPassword: 'new-password',
      }),
    );
    expect(account.updateUser).toHaveBeenCalledWith(7, {
      password: 'current',
      newPassword: 'new-password',
    });
    expect(result.current.user).toEqual(previous);
  });

  it('rejects all protected mutations when anonymous', async () => {
    const { result } = setup();
    await expect(
      result.current.updateProfile({
        name: 'Jane',
        surname: 'Doe',
        email: 'reader@example.com',
      }),
    ).rejects.toThrow('Sign in to update your profile');
    await expect(
      result.current.uploadProfilePicture(new File([], 'avatar.png')),
    ).rejects.toThrow('Sign in to update your profile');
    await expect(result.current.removeProfilePicture()).rejects.toThrow(
      'Sign in to update your profile',
    );
    await expect(
      result.current.changePassword({ password: 'old', newPassword: 'new' }),
    ).rejects.toThrow('Sign in to update your profile');
    expect(account.updateUser).not.toHaveBeenCalled();
    expect(account.uploadProfilePicture).not.toHaveBeenCalled();
    expect(account.removeProfilePicture).not.toHaveBeenCalled();
  });

  it('requires an AuthProvider', () => {
    expect(() => renderHook(useAuth)).toThrow(
      'useAuth must be used within AuthProvider',
    );
  });
});
