import type { paths } from '@/interfaces/generated/api';
import type { Session } from '@/interfaces/models';
import axiosInstance from '@/services/axios';

type LoginInput =
  paths['/login']['post']['requestBody']['content']['application/json'];
type RegisterInput =
  paths['/users']['post']['requestBody']['content']['application/json'];

export const authService = {
  async login(input: LoginInput): Promise<Session> {
    const { data } = await axiosInstance.post<Session>('/login', input);
    return data;
  },
  async register(input: RegisterInput): Promise<{ message: string }> {
    const { data } = await axiosInstance.post('/users', input);
    return data;
  },
  async autoLogin(): Promise<Session> {
    const { data } = await axiosInstance.post<Session>('/login/autoLogin');
    return data;
  },
  async confirm(token: string): Promise<{ message: string }> {
    const { data } = await axiosInstance.get('/confirm', { params: { token } });
    return data;
  },
  async resend(username: string): Promise<{ message: string }> {
    const { data } = await axiosInstance.post('/emails/register', { username });
    return data;
  },
  async requestReset(user: string): Promise<{ message: string }> {
    const { data } = await axiosInstance.post('/emails/reset', { user });
    return data;
  },
  async confirmReset(
    ID: number,
    resetCode: string,
  ): Promise<{ data: { resetToken: string }; message: string }> {
    const { data } = await axiosInstance.post('/confirm/reset', {
      ID,
      resetCode,
    });
    return data;
  },
  async resetPassword(
    resetToken: string,
    password: string,
    confirmPassword: string,
  ): Promise<{ message: string }> {
    const { data } = await axiosInstance.post('/confirm/newPassword', {
      resetToken,
      password,
      confirmPassword,
    });
    return data;
  },
};
