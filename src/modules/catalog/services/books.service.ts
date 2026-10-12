import type { paths } from '@/interfaces/generated/api';
import type { Book, BookInput, HomeBooks } from '@/interfaces/models';
import http from '@/services/http';

type Search = NonNullable<paths['/books']['get']['parameters']['query']>;
type CreateBookRequest =
  paths['/books']['post']['requestBody']['content']['application/json'];
type UpdateBookRequest =
  paths['/books/{ID}']['put']['requestBody']['content']['application/json'];

export const booksService = {
  async list(params: Search, signal?: AbortSignal): Promise<Book[]> {
    const { data } = await http.get<Book[]>('/books', { params, signal });
    return data;
  },
  async home(): Promise<HomeBooks> {
    const { data } = await http.get<HomeBooks>('/books/homeBooks');
    return data;
  },
  async get(id: number): Promise<Book> {
    const { data } = await http.get<Book>(`/books/${id}`);
    return data;
  },
  async create(input: BookInput): Promise<void> {
    const request: CreateBookRequest = input;
    await http.post('/books', request);
  },
  async update(id: number, input: BookInput): Promise<void> {
    const request: UpdateBookRequest = input;
    await http.put(`/books/${id}`, request);
  },
  async remove(id: number): Promise<void> {
    await http.delete(`/books/${id}`);
  },
};
