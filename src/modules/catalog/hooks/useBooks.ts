import {
  keepPreviousData,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import type { paths } from '@/interfaces/generated/api';
import { booksService } from '@/modules/catalog/services/books.service';
import { Book } from '@/interfaces/models';

type Search = NonNullable<paths['/books']['get']['parameters']['query']>;

export function useBooks(params: Search, enabled = true) {
  return useQuery({
    queryKey: ['books', params],
    queryFn: ({ signal }) => booksService.list(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
    enabled,
  });
}

export function useBook(id: number): UseQueryResult<Book> {
  return useQuery({
    queryKey: ['books', id],
    queryFn: () => booksService.get(id),
    enabled: Number.isSafeInteger(id) && id > 0,
  });
}

export function useHomeBooks(enabled = true) {
  return useQuery({
    queryKey: ['books', 'home'],
    queryFn: booksService.home,
    enabled,
  });
}
