import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { STORAGE_KEYS } from '@/constants';
import type { paths } from '@/interfaces/generated/api';
import type { Session, User } from '@/interfaces/models';
import { accountService } from '@/modules/account/services/account.service';
import { authService } from '@/modules/auth/services/auth.service';

type LoginInput =
  paths['/login']['post']['requestBody']['content']['application/json'];
type RegisterInput =
  paths['/users']['post']['requestBody']['content']['application/json'];

interface AuthValue {
  user: User | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  updateProfile: (input: {
    name: string;
    surname: string;
    email: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

function asUser(session: Session): User {
  return {
    ID: session.ID,
    username: session.username,
    email: session.email,
    name: session.name,
    surname: session.surname,
    profilePic: session.profilePic,
    role: session.role,
    admin: session.admin,
    enabled: session.enabled,
    banned: session.banned,
    suspendedTimes: session.suspendedTimes,
    createdAt: session.createdAt,
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() =>
    Boolean(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)),
  );

  const acceptSession = useCallback((session: Session) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, session.token);
    setUser(asUser(session));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    setUser(null);
    queryClient.removeQueries({ queryKey: ['cart'] });
    queryClient.removeQueries({ queryKey: ['favorites'] });
    queryClient.removeQueries({ queryKey: ['orders'] });
    queryClient.removeQueries({ queryKey: ['admin'] });
  }, [queryClient]);

  useEffect(() => {
    const onUnauthorized = () => logout();
    window.addEventListener('bookstore:unauthorized', onUnauthorized);
    return () =>
      window.removeEventListener('bookstore:unauthorized', onUnauthorized);
  }, [logout]);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)) return;
    authService
      .autoLogin()
      .then(acceptSession)
      .catch(logout)
      .finally(() => setLoading(false));
  }, [acceptSession, logout]);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      loading,
      login: async (input) => acceptSession(await authService.login(input)),
      register: async (input) => {
        await authService.register(input);
      },
      updateProfile: async (input) => {
        if (!user) throw new Error('Sign in to update your profile');
        const trimmed = {
          name: input.name.trim(),
          surname: input.surname.trim(),
          email: input.email.trim(),
        };
        await accountService.updateUser(user.ID, trimmed);
        setUser((current) => (current ? { ...current, ...trimmed } : current));
      },
      logout,
    }),
    [acceptSession, loading, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}
