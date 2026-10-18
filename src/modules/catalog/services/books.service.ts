import type { paths } from '@/interfaces/generated/api';
import type { Book, BookInput, HomeBooks } from '@/interfaces/models';
import axiosInstance from '@/services/axios';

type Search = NonNullable<paths['/books']['get']['parameters']['query']>;
type CreateBookRequest =
  paths['/books']['post']['requestBody']['content']['application/json'];
type UpdateBookRequest =
  paths['/books/{ID}']['put']['requestBody']['content']['application/json'];

export const booksService = {
  async list(params: Search, signal?: AbortSignal): Promise<Book[]> {
    const { data } = await axiosInstance.get<Book[]>('/books', {
      params,
      signal,
    });
    return data;
  },
  async home(): Promise<HomeBooks> {
    const { data } = await axiosInstance.get<HomeBooks>('/books/homeBooks');
    return data;
  },
  async get(id: number): Promise<Book> {
    const { data } = await axiosInstance.get<Book>(`/books/${id}`);
    return data;
  },
  async create(input: BookInput): Promise<void> {
    const request: CreateBookRequest = input;
    await axiosInstance.post('/books', request);
  },
  async update(id: number, input: BookInput): Promise<void> {
    const request: UpdateBookRequest = input;
    await axiosInstance.put(`/books/${id}`, request);
  },
  async remove(id: number): Promise<void> {
    await axiosInstance.delete(`/books/${id}`);
  },
};
