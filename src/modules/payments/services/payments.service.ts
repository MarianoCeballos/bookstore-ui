import type { Order } from '@/interfaces/models';
import axiosInstance from '@/services/axios';

export const paymentsService = {
  async checkout(
    gift: boolean,
    giftRecipient?: string,
  ): Promise<{
    preferenceId: string;
    orderId: number;
  }> {
    const { data } = await axiosInstance.post('/payments', {
      gift,
      giftRecipient,
    });
    return data;
  },
  async verify(paymentId: string): Promise<Order> {
    const { data } = await axiosInstance.post<Order>('/payments/create', {
      paymentId,
    });
    return data;
  },
};
