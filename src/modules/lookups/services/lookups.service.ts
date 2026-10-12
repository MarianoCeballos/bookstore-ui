import type { Author, Category } from '@/interfaces/models';
import http from '@/services/http';

export const lookupsService = {
  async authors(): Promise<Author[]> {
    const { data } = await http.get<Author[]>('/authors');
    return data;
  },
  async categories(): Promise<Category[]> {
    const { data } = await http.get<Category[]>('/categories');
    return data;
  },
};
