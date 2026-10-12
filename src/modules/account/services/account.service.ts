import type { Book, Order, Review, User } from '@/interfaces/models';
import http from '@/services/http';

export const accountService = {
  async favorites(id: number): Promise<Book[]> {
    const { data } = await http.get<Book[]>(`/users/${id}/favorites`);
    return data;
  },
  async cart(id: number): Promise<Book[]> {
    const { data } = await http.get<Book[]>(`/users/${id}/cart`);
    return data;
  },
  async setBookRelation(
    id: number,
    bookId: number,
    relation: 'cart' | 'favorites',
    add: boolean,
  ): Promise<void> {
    const url = `/users/${id}/${relation}`;
    if (add) await http.post(url, { ID: bookId });
    else await http.delete(url, { data: { ID: bookId } });
  },
  async orders(): Promise<Order[]> {
    const { data } = await http.get<Order[]>('/payments');
    return data;
  },
  async reviews(bookId: number): Promise<Book & { reviews: Review[] }> {
    const { data } = await http.get<Book & { reviews: Review[] }>(
      `/reviews/book/${bookId}`,
    );
    return data;
  },
  async createReview(input: {
    title: string;
    review: string;
    rating: number;
    bookID: number;
  }): Promise<void> {
    await http.post('/reviews', input);
  },
  async reportReview(id: number): Promise<void> {
    await http.put(`/reviews/${id}?report=true`, {});
  },
  async deleteReview(id: number): Promise<void> {
    await http.delete(`/reviews/${id}`);
  },
  async users(username?: string): Promise<User[]> {
    const { data } = await http.get<User[]>('/users', {
      params: username ? { username } : {},
    });
    return data;
  },
  async setUserStatus(
    id: number,
    status: 'suspended' | 'enabled' | 'admin',
  ): Promise<void> {
    await http.put(`/users/${id}?${status}=true`, {});
  },
  async removeUser(id: number): Promise<void> {
    await http.delete(`/users/${id}`);
  },
  async updateUser(
    id: number,
    input: { name: string; surname: string; email: string },
  ): Promise<void> {
    await http.put(`/users/${id}`, input);
  },
  async reviewsAdmin(): Promise<Review[]> {
    const { data } = await http.get<Review[]>('/reviews');
    return data;
  },
};
