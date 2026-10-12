import type { paths } from '@/interfaces/generated/api';
import type { Book, BookInput } from '@/interfaces/models';
import http from '@/services/http';

type Search = NonNullable<paths['/books']['get']['parameters']['query']>;

export const booksService = {
  async list(params: Search, signal?: AbortSignal): Promise<Book[]> {
    const { data } = await http.get<Book[]>('/books', { params, signal });
    return data;
  },
  async home(): Promise<{
    bestSellers: Book[];
    mostPopular: Book[];
    newReleases: Book[];
  }> {
    const { data } = await http.get('/books/homeBooks');
    return data;
  },
  async get(id: number): Promise<Book> {
    const { data } = await http.get<Book>(`/books/${id}`);
    return data;
  },
  async create(input: BookInput): Promise<void> {
    await http.post('/books', input);
  },
  async update(id: number, input: BookInput): Promise<void> {
    await http.put(`/books/${id}`, input);
  },
  async remove(id: number): Promise<void> {
    await http.delete(`/books/${id}`);
  },
};
