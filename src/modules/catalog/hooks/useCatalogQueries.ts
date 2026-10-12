import { useQuery } from '@tanstack/react-query';
import { accountService } from '@/modules/account/services/account.service';

export function useOrders() {
  return useQuery({ queryKey: ['orders'], queryFn: accountService.orders });
}

export function useBookReviews(id: number) {
  return useQuery({
    queryKey: ['reviews', 'book', id],
    queryFn: () => accountService.reviews(id),
    enabled: id > 0,
  });
}
