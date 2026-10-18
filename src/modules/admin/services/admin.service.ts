import type {
  AdminStats,
  Book,
  Order,
  Review,
  User,
} from '@/interfaces/models';
import axiosInstance from '@/services/axios';

export const adminService = {
  async stats(): Promise<AdminStats> {
    const { data } = await axiosInstance.get<AdminStats>('/stats');
    return data;
  },
  async orders(): Promise<Order[]> {
    const { data } = await axiosInstance.get<Order[]>('/payments');
    return data;
  },
  async users(username?: string): Promise<User[]> {
    const { data } = await axiosInstance.get<User[]>('/users', {
      params: { username },
    });
    return data;
  },
  async books(): Promise<Book[]> {
    const { data } = await axiosInstance.get<Book[]>('/books');
    return data;
  },
  async reviews(): Promise<Review[]> {
    const { data } = await axiosInstance.get<Review[]>('/reviews');
    return data;
  },
};
