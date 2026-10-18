import type {
  BookReviews,
  CartBook,
  CreateReviewInput,
  FavoriteBook,
  Order,
  Review,
  User,
  UserPublic,
  UserReviews,
} from '@/interfaces/models';
import axiosInstance from '@/services/axios';

export const accountService = {
  async favorites(id: number): Promise<FavoriteBook[]> {
    const { data } = await axiosInstance.get<FavoriteBook[]>(
      `/users/${id}/favorites`,
    );
    return data;
  },
  async cart(id: number): Promise<CartBook[]> {
    const { data } = await axiosInstance.get<CartBook[]>(`/users/${id}/cart`);
    return data;
  },
  async setBookRelation(
    id: number,
    bookId: number,
    relation: 'cart' | 'favorites',
    add: boolean,
  ): Promise<void> {
    const url = `/users/${id}/${relation}`;
    if (add) await axiosInstance.post(url, { ID: bookId });
    else await axiosInstance.delete(url, { data: { ID: bookId } });
  },
  async orders(): Promise<Order[]> {
    const { data } = await axiosInstance.get<Order[]>('/payments');
    return data;
  },
  async reviews(bookId: number): Promise<BookReviews> {
    const { data } = await axiosInstance.get<BookReviews>(
      `/reviews/book/${bookId}`,
    );
    return data;
  },
  async userReviews(userId: number): Promise<UserReviews> {
    const { data } = await axiosInstance.get<UserReviews>(
      `/reviews/user/${userId}`,
    );
    return data;
  },
  async createReview(input: CreateReviewInput): Promise<void> {
    await axiosInstance.post('/reviews', input);
  },
  async updateReview(
    id: number,
    input: { title: string; review: string; rating: number },
  ): Promise<void> {
    await axiosInstance.put(`/reviews/${id}`, input);
  },
  async reportReview(id: number): Promise<void> {
    await axiosInstance.put(`/reviews/${id}?report=true`, {});
  },
  async deleteReview(id: number): Promise<void> {
    await axiosInstance.delete(`/reviews/${id}`);
  },
  async users(username?: string): Promise<User[]> {
    const { data } = await axiosInstance.get<User[]>('/users', {
      params: username ? { username } : {},
    });
    return data;
  },
  async setUserStatus(
    id: number,
    status: 'suspended' | 'enabled' | 'admin',
  ): Promise<void> {
    await axiosInstance.put(`/users/${id}?${status}=true`, {});
  },
  async removeUser(id: number): Promise<void> {
    await axiosInstance.delete(`/users/${id}`);
  },
  async updateUser(
    id: number,
    input: {
      username?: string;
      name?: string;
      surname?: string;
      email?: string;
      profilePic?: string;
      password?: string;
      newPassword?: string;
    },
  ): Promise<UserPublic> {
    const { data } = await axiosInstance.put<{
      data: UserPublic;
      message: string;
    }>(`/users/${id}`, input);
    return data.data;
  },
  async uploadProfilePicture(id: number, file: File): Promise<UserPublic> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await axiosInstance.post<{
      data: UserPublic;
      message: string;
    }>(`/users/${id}/profile-picture`, formData);
    return data.data;
  },
  async removeProfilePicture(id: number): Promise<UserPublic> {
    const { data } = await axiosInstance.delete<{
      data: UserPublic;
      message: string;
    }>(`/users/${id}/profile-picture`);
    return data.data;
  },
  async reviewsAdmin(): Promise<Review[]> {
    const { data } = await axiosInstance.get<Review[]>('/reviews');
    return data;
  },
};
