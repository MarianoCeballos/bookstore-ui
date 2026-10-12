import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { accountService } from '@/modules/account/services/account.service';
import { BookReviews } from '@/interfaces/models';

import { booksService } from '@/modules/catalog/services/books.service';

export function useOrders() {
  return useQuery({ queryKey: ['orders'], queryFn: accountService.orders });
}

export function useBookReviews(id: number): UseQueryResult<BookReviews> {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => booksService.get(id),
    enabled: Number.isSafeInteger(id) && id > 0,
    select: (book) => book.reviews ?? [],
  });
}
