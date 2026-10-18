import { act, renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';
import i18n from '@/i18n';
import { usePasswordReset } from '@/modules/auth/hooks/usePasswordReset';
import { authService } from '@/modules/auth/services/auth.service';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
jest.mock('@/modules/auth/services/auth.service', () => ({
  authService: {
    requestReset: jest.fn(),
    confirmReset: jest.fn(),
    resetPassword: jest.fn(),
  },
}));
jest.mock('sonner', () => ({
  toast: { info: jest.fn(), success: jest.fn(), error: jest.fn() },
}));

const service = jest.mocked(authService);
const t = i18n.getFixedT('en');
const setup = () => renderHook(usePasswordReset, { wrapper: MemoryRouter });

describe('usePasswordReset', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    service.requestReset.mockResolvedValue({ message: 'Sent' });
    service.confirmReset.mockResolvedValue({
      data: { resetToken: 'verified-token' },
      message: 'Verified',
    });
    service.resetPassword.mockResolvedValue({ message: 'Saved' });
  });

  it('rejects blank requests without contacting the service', async () => {
    const { result } = setup();
    act(() => result.current.setUser('   '));
    await act(() => result.current.requestCode());
    expect(result.current.error).toBe(t('validationRequired'));
    expect(service.requestReset).not.toHaveBeenCalled();
    expect(result.current.isSendingCode).toBe(false);
  });

  it('trims the account identifier and tracks a pending request', async () => {
    let resolveRequest!: (value: { message: string }) => void;
    service.requestReset.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );
    const { result } = setup();
    act(() => result.current.setUser(' reader@example.com '));
    let pending!: Promise<void>;
    act(() => {
      pending = result.current.requestCode();
    });
    expect(result.current.isSendingCode).toBe(true);
    expect(service.requestReset).toHaveBeenCalledWith('reader@example.com');
    await act(async () => {
      resolveRequest({ message: 'Sent' });
      await pending;
    });
    expect(result.current.isSendingCode).toBe(false);
    expect(result.current.notice).toBe(t('resetEmailSent'));
    expect(toast.info).toHaveBeenCalledWith(t('resetEmailSent'), {
      description: 'reader@example.com',
    });
  });

  it.each(['', '0', '-1', '1.5', 'abc', 'Infinity', '9007199254740992'])(
    'rejects invalid account ID %p',
    async (id) => {
      const { result } = setup();
      act(() => {
        result.current.setAccountId(id);
        result.current.setResetCode('code');
      });
      await act(() => result.current.verifyCode());
      expect(result.current.error).toBe(t('validationAccountIdNumeric'));
      expect(service.confirmReset).not.toHaveBeenCalled();
    },
  );

  it('requires a nonblank code for a valid account ID', async () => {
    const { result } = setup();
    act(() => {
      result.current.setAccountId('1');
      result.current.setResetCode('   ');
    });
    await act(() => result.current.verifyCode());
    expect(result.current.error).toBe(t('validationRequired'));
    expect(service.confirmReset).not.toHaveBeenCalled();
  });

  it('verifies a trimmed code and submits the issued token with a matching password', async () => {
    const { result } = setup();
    act(() => {
      result.current.setAccountId(' 42 ');
      result.current.setResetCode(' 123456 ');
    });
    await act(() => result.current.verifyCode());
    expect(service.confirmReset).toHaveBeenCalledWith(42, '123456');
    expect(result.current.resetToken).toBe('verified-token');
    expect(result.current.notice).toBe(t('resetCodeVerified'));
    expect(result.current.isVerifyingCode).toBe(false);

    act(() => {
      result.current.setPassword('new-password');
      result.current.setConfirmPassword('new-password');
    });
    await act(() => result.current.savePassword());
    expect(service.resetPassword).toHaveBeenCalledWith(
      'verified-token',
      'new-password',
      'new-password',
    );
    expect(result.current.isSavingPassword).toBe(false);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it.each([
    ['short', 'short', 'validationPasswordMin'],
    ['new-password', 'other-password', 'validationPasswordsMatch'],
  ])(
    'rejects invalid new password %s',
    async (password, confirmation, errorKey) => {
      const { result } = setup();
      act(() => {
        result.current.setPassword(password);
        result.current.setConfirmPassword(confirmation);
      });
      await act(() => result.current.savePassword());
      expect(result.current.error).toBe(t(errorKey));
      expect(service.resetPassword).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    },
  );

  it('clears a request error after a successful retry', async () => {
    service.requestReset.mockRejectedValueOnce(new Error('User not found'));
    const { result } = setup();
    act(() => result.current.setUser('reader'));
    await act(() => result.current.requestCode());
    expect(result.current.error).toBe(t('errorUserNotFound'));
    expect(result.current.isSendingCode).toBe(false);
    await act(() => result.current.requestCode());
    expect(result.current.error).toBe('');
    expect(result.current.notice).toBe(t('resetEmailSent'));
  });

  it('shows verification failures without accepting a token', async () => {
    service.confirmReset.mockRejectedValue(new Error('Unexpected failure'));
    const { result } = setup();
    act(() => {
      result.current.setAccountId('1');
      result.current.setResetCode('wrong');
    });
    await act(() => result.current.verifyCode());
    expect(result.current.error).toBe(t('errorResetCodeInvalidOrExpired'));
    expect(result.current.resetToken).toBe('');
    expect(result.current.isVerifyingCode).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      t('errorResetCodeInvalidOrExpired'),
    );
  });

  it('keeps the user on the form when saving fails and releases the busy flag', async () => {
    service.resetPassword.mockRejectedValue(new Error('Unexpected failure'));
    const { result } = setup();
    act(() => {
      result.current.setPassword('new-password');
      result.current.setConfirmPassword('new-password');
    });
    await act(() => result.current.savePassword());
    expect(result.current.error).toBe(t('errorResetCodeInvalidOrExpired'));
    expect(result.current.isSavingPassword).toBe(false);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
