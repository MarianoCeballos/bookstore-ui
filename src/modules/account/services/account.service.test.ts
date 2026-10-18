import { accountService } from '@/modules/account/services/account.service';
import axiosInstance from '@/services/axios';

jest.mock('@/services/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));
const http = jest.mocked(axiosInstance);

describe('account service changes', () => {
  beforeEach(() => jest.resetAllMocks());

  it('unwraps the updated public user from the response envelope', async () => {
    const updated = { ID: 7, username: 'new-reader' };
    http.put.mockResolvedValueOnce({
      data: { message: 'Updated', data: updated },
    });
    const input = { username: 'new-reader', email: 'reader@example.com' };
    await expect(accountService.updateUser(7, input)).resolves.toEqual(updated);
    expect(http.put).toHaveBeenCalledWith('/users/7', input);
  });

  it('sends the actual image file as multipart form data and unwraps the response', async () => {
    const file = new File(['png'], 'avatar.png', { type: 'image/png' });
    const updated = { ID: 7, profilePic: '/avatar.png' };
    http.post.mockResolvedValueOnce({
      data: { message: 'Uploaded', data: updated },
    });
    await expect(accountService.uploadProfilePicture(7, file)).resolves.toEqual(
      updated,
    );
    expect(http.post).toHaveBeenCalledWith(
      '/users/7/profile-picture',
      expect.any(FormData),
    );
    const body = http.post.mock.calls[0][1] as FormData;
    expect(body.get('file')).toBe(file);
    expect([...body.keys()]).toEqual(['file']);
  });

  it('unwraps the public user returned after avatar removal', async () => {
    const updated = { ID: 7, profilePic: '' };
    http.delete.mockResolvedValueOnce({
      data: { message: 'Removed', data: updated },
    });
    await expect(accountService.removeProfilePicture(7)).resolves.toEqual(
      updated,
    );
    expect(http.delete).toHaveBeenCalledWith('/users/7/profile-picture');
  });

  it('loads the reviews for the requested user', async () => {
    const reviews = { ID: 7, username: 'reader', reviews: [] };
    http.get.mockResolvedValueOnce({ data: reviews });
    await expect(accountService.userReviews(7)).resolves.toEqual(reviews);
    expect(http.get).toHaveBeenCalledWith('/reviews/user/7');
  });

  it('passes review edits without adding a book or user identity', async () => {
    http.put.mockResolvedValueOnce({ data: {} });
    const input = {
      title: 'Updated review',
      review: 'Updated text',
      rating: 3,
    };
    await accountService.updateReview(12, input);
    expect(http.put).toHaveBeenCalledWith('/reviews/12', input);
  });

  it('propagates API failures to callers', async () => {
    const error = new Error('Upload failed');
    http.post.mockRejectedValueOnce(error);
    await expect(
      accountService.uploadProfilePicture(7, new File([], 'avatar.png')),
    ).rejects.toBe(error);
  });
});
