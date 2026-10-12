import { createContext, useContext, type PropsWithChildren } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Book } from '@/interfaces/models';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { accountService } from '@/modules/account/services/account.service';
import { useBookRelation } from '@/modules/account/hooks/useBookRelations';

interface FavoritesValue {
  items: Book[];
  loading: boolean;
  add: (bookId: number) => Promise<void>;
  remove: (bookId: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesValue | null>(null);

export function FavoritesProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const mutation = useBookRelation('favorites');
  const query = useQuery({
    queryKey: ['favorites', user?.ID],
    queryFn: () => accountService.favorites(user!.ID),
    enabled: Boolean(user),
  });
  const value: FavoritesValue = {
    items: query.data ?? [],
    loading: query.isPending,
    add: async (bookId) => {
      await mutation.mutateAsync({ bookId, add: true });
    },
    remove: async (bookId) => {
      await mutation.mutateAsync({ bookId, add: false });
    },
  };
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const value = useContext(FavoritesContext);
  if (!value)
    throw new Error('useFavorites must be used within FavoritesProvider');
  return value;
}
