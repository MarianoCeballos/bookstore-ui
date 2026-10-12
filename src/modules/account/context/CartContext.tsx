import { createContext, useContext, type PropsWithChildren } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Book } from '@/interfaces/models';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { accountService } from '@/modules/account/services/account.service';
import { useBookRelation } from '@/modules/account/hooks/useBookRelations';

interface CartValue {
  items: Book[];
  loading: boolean;
  add: (bookId: number) => Promise<void>;
  remove: (bookId: number) => Promise<void>;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const mutation = useBookRelation('cart');
  const query = useQuery({
    queryKey: ['cart', user?.ID],
    queryFn: () => accountService.cart(user!.ID),
    enabled: Boolean(user),
  });
  const value: CartValue = {
    items: query.data ?? [],
    loading: query.isPending,
    add: async (bookId) => {
      await mutation.mutateAsync({ bookId, add: true });
    },
    remove: async (bookId) => {
      await mutation.mutateAsync({ bookId, add: false });
    },
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error('useCart must be used within CartProvider');
  return value;
}
