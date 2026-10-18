import { createContext, useContext, type PropsWithChildren } from 'react';
import type { User } from '@/interfaces/models';

const AuthenticatedUserContext = createContext<User | null>(null);

/**
 * Publishes the signed-in user to a guarded subtree. Rendered by
 * `RequireAuth`, which only mounts its children once a user exists.
 */
export function AuthenticatedUserProvider({
  user,
  children,
}: PropsWithChildren<{ user: User }>) {
  return (
    <AuthenticatedUserContext.Provider value={user}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
}

/**
 * Reads the signed-in user inside a route protected by `RequireAuth`.
 *
 * The guard guarantees a non-null user, so consumers never have to narrow or
 * default the value themselves. Calling this outside a protected route is a
 * programming error and throws.
 */
export function useAuthenticatedUser(): User {
  const user = useContext(AuthenticatedUserContext);
  if (!user) {
    throw new Error(
      'useAuthenticatedUser must be used inside a RequireAuth protected route',
    );
  }
  return user;
}
