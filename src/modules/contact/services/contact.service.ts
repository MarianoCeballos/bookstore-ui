import axiosInstance from '@/services/axios';

export const contactService = {
  async send(input: {
    sender: string;
    title: string;
    message: string;
  }): Promise<{ message: string }> {
    const { data } = await axiosInstance.post('/emails/contact', input);
    return data;
  },
};
