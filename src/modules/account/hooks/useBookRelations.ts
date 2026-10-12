import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { accountService } from '@/modules/account/services/account.service';

export function useBookRelation(relation: 'cart' | 'favorites') {
  const { user } = useAuth();
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookId, add }: { bookId: number; add: boolean }) => {
      if (!user) throw new Error('Sign in to manage saved books');
      await accountService.setBookRelation(user.ID, bookId, relation, add);
    },
    onSuccess: async () => {
      if (user) {
        await client.invalidateQueries({
          queryKey: [relation === 'cart' ? 'cart' : 'favorites', user.ID],
        });
      }
    },
  });
}
