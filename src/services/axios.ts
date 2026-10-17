import axios from 'axios';
import { STORAGE_KEYS } from '@/constants';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001',
  timeout: 15000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('bookstore:unauthorized'));
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
