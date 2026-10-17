import type { Author, Category } from '@/interfaces/models';
import axiosInstance from '@/services/axios';

export const lookupsService = {
  async authors(): Promise<Author[]> {
    const { data } = await axiosInstance.get<Author[]>('/authors');
    return data;
  },
  async categories(): Promise<Category[]> {
    const { data } = await axiosInstance.get<Category[]>('/categories');
    return data;
  },
};
