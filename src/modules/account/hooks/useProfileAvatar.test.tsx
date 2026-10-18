import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent } from 'react';
import { toast } from 'sonner';
import { MAX_PROFILE_PIC_BYTES } from '@/constants';
import i18n from '@/i18n';
import { useProfileAvatar } from '@/modules/account/hooks/useProfileAvatar';

const mockUpload = jest.fn();
const mockRemove = jest.fn();
let mockProfilePic = '/avatar.png';
jest.mock('@/modules/auth/context/AuthContext', () => ({
  useAuth: () => ({
    uploadProfilePicture: mockUpload,
    removeProfilePicture: mockRemove,
  }),
}));
jest.mock('@/modules/auth/context/AuthenticatedUserContext', () => ({
  useAuthenticatedUser: () => ({ profilePic: mockProfilePic }),
}));
jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

const t = i18n.getFixedT('en');
function fileEvent(file?: File) {
  const target = { files: file ? [file] : [], value: 'selected-file' };
  return { target } as unknown as ChangeEvent<HTMLInputElement>;
}

describe('useProfileAvatar', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockProfilePic = '/avatar.png';
    mockUpload.mockResolvedValue(undefined);
    mockRemove.mockResolvedValue(undefined);
  });

  it.each(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])(
    'uploads supported %s files',
    async (type) => {
      const { result } = renderHook(useProfileAvatar);
      const file = new File(['image'], 'avatar', { type });
      const event = fileEvent(file);
      await act(() => result.current.handleFileChange(event));
      expect(mockUpload).toHaveBeenCalledWith(file);
      expect(event.target.value).toBe('');
      expect(toast.success).toHaveBeenCalledWith(t('toastProfilePicUpdated'));
      expect(result.current.isAvatarBusy).toBe(false);
    },
  );

  it.each(['image/svg+xml', 'text/plain', ''])(
    'rejects unsupported MIME type %p before upload',
    async (type) => {
      const { result } = renderHook(useProfileAvatar);
      await act(() =>
        result.current.handleFileChange(
          fileEvent(new File(['data'], 'avatar.png', { type })),
        ),
      );
      expect(mockUpload).not.toHaveBeenCalled();
      expect(result.current.avatarError).toBe(t('errorProfilePicFormat'));
      expect(result.current.isAvatarBusy).toBe(false);
    },
  );

  it.each([
    [MAX_PROFILE_PIC_BYTES, true],
    [MAX_PROFILE_PIC_BYTES + 1, false],
  ] as const)('checks the %i byte boundary', async (size, accepted) => {
    const { result } = renderHook(useProfileAvatar);
    const file = new File(['image'], 'avatar.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: size });
    await act(() => result.current.handleFileChange(fileEvent(file)));
    expect(mockUpload).toHaveBeenCalledTimes(accepted ? 1 : 0);
    expect(result.current.avatarError).toBe(
      accepted ? '' : t('errorProfilePicSize'),
    );
  });

  it('ignores canceled selection and still resets the input', async () => {
    const { result } = renderHook(useProfileAvatar);
    const event = fileEvent();
    await act(() => result.current.handleFileChange(event));
    expect(event.target.value).toBe('');
    expect(mockUpload).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('tracks upload progress, reports failures, and allows retrying the same file', async () => {
    let rejectUpload!: (error: Error) => void;
    mockUpload.mockReturnValueOnce(
      new Promise((_, reject) => {
        rejectUpload = reject;
      }),
    );
    const { result } = renderHook(useProfileAvatar);
    const file = new File(['image'], 'avatar.png', { type: 'image/png' });
    let pending!: Promise<void>;
    act(() => {
      pending = result.current.handleFileChange(fileEvent(file));
    });
    expect(result.current.isUploadingAvatar).toBe(true);
    expect(result.current.isAvatarBusy).toBe(true);
    await act(async () => {
      rejectUpload(new Error('Profile picture must be 2 mb or smaller'));
      await pending;
    });
    expect(result.current.avatarError).toBe(t('errorProfilePicSize'));
    expect(result.current.isAvatarBusy).toBe(false);
    await act(() => result.current.handleFileChange(fileEvent(file)));
    expect(result.current.avatarError).toBe('');
    expect(mockUpload).toHaveBeenCalledTimes(2);
  });

  it('requires confirmation and cancels removal without a service call', () => {
    const { result } = renderHook(useProfileAvatar);
    act(() => result.current.openRemoveConfirm());
    expect(result.current.confirmRemove).toBe(true);
    expect(mockRemove).not.toHaveBeenCalled();
    act(() => result.current.closeRemoveConfirm());
    expect(result.current.confirmRemove).toBe(false);
    expect(mockRemove).not.toHaveBeenCalled();
  });

  it('closes confirmation while removal is pending and clears busy state on success', async () => {
    let resolveRemove!: () => void;
    mockRemove.mockReturnValueOnce(
      new Promise<void>((resolve) => {
        resolveRemove = resolve;
      }),
    );
    const { result } = renderHook(useProfileAvatar);
    act(() => result.current.openRemoveConfirm());
    let pending!: Promise<void>;
    act(() => {
      pending = result.current.handleConfirmRemove();
    });
    expect(result.current.confirmRemove).toBe(false);
    expect(result.current.isRemovingAvatar).toBe(true);
    expect(result.current.isAvatarBusy).toBe(true);
    await act(async () => {
      resolveRemove();
      await pending;
    });
    expect(toast.success).toHaveBeenCalledWith(t('toastProfilePicRemoved'));
    expect(result.current.isAvatarBusy).toBe(false);
  });

  it('does not request removal when no profile picture exists', async () => {
    mockProfilePic = '';
    const { result } = renderHook(useProfileAvatar);
    await act(() => result.current.handleConfirmRemove());
    expect(mockRemove).not.toHaveBeenCalled();
    expect(result.current.isAvatarBusy).toBe(false);
  });

  it('reports removal failures and clears busy state', async () => {
    mockRemove.mockRejectedValueOnce(new Error('Unexpected failure'));
    const { result } = renderHook(useProfileAvatar);
    await act(() => result.current.handleConfirmRemove());
    expect(result.current.avatarError).toBe(t('errorGeneric'));
    expect(result.current.isAvatarBusy).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(t('errorGeneric'));
  });
});
