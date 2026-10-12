import http from '@/services/http';

export const contactService = {
  async send(input: {
    sender: string;
    title: string;
    message: string;
  }): Promise<{ message: string }> {
    const { data } = await http.post('/emails/contact', input);
    return data;
  },
};
