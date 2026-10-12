import type { Order } from '@/interfaces/models';
import http from '@/services/http';

export const paymentsService = {
  async checkout(gift: boolean, giftRecipient?: string): Promise<{
    preferenceId: string;
    orderId: number;
  }> {
    const { data } = await http.post('/payments', { gift, giftRecipient });
    return data;
  },
  async verify(paymentId: string): Promise<Order> {
    const { data } = await http.post<Order>('/payments/create', { paymentId });
    return data;
  },
};
