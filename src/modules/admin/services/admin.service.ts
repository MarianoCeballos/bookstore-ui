import type {
  AdminStats,
  Book,
  Order,
  Review,
  User,
} from '@/interfaces/models';
import http from '@/services/http';

export const adminService = {
  async stats(): Promise<AdminStats> {
    const { data } = await http.get<AdminStats>('/stats');
    return data;
  },
  async orders(): Promise<Order[]> {
    const { data } = await http.get<Order[]>('/payments');
    return data;
  },
  async users(username?: string): Promise<User[]> {
    const { data } = await http.get<User[]>('/users', { params: { username } });
    return data;
  },
  async books(): Promise<Book[]> {
    const { data } = await http.get<Book[]>('/books');
    return data;
  },
  async reviews(): Promise<Review[]> {
    const { data } = await http.get<Review[]>('/reviews');
    return data;
  },
};
