import { useQuery } from '@tanstack/react-query';
import { accountService } from '@/modules/account/services/account.service';

export function useUserReviews(userId?: number) {
  return useQuery({
    queryKey: ['user-reviews', userId],
    queryFn: async () => {
      if (!userId) throw new Error('A user id is required to load reviews');
      return accountService.userReviews(userId);
    },
    enabled: Boolean(userId),
  });
}
