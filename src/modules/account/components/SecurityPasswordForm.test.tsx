import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import i18n from '@/i18n';
import { SecurityPasswordForm } from '@/modules/account/components/SecurityPasswordForm';

const mockChangePassword = jest.fn();
jest.mock('@/modules/auth/context/AuthContext', () => ({
  useAuth: () => ({ changePassword: mockChangePassword }),
}));
jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));
const t = i18n.getFixedT('en');

describe('SecurityPasswordForm', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockChangePassword.mockResolvedValue(undefined);
  });

  async function fillPasswords(confirmation = 'new-password') {
    const user = userEvent.setup();
    render(<SecurityPasswordForm />);
    await user.type(
      screen.getByLabelText(t('currentPassword')),
      'current-password',
    );
    await user.type(screen.getByLabelText(t('newPassword')), 'new-password');
    await user.type(screen.getByLabelText(t('confirmPassword')), confirmation);
    return user;
  }

  it('prevents mismatched confirmation from reaching the service', async () => {
    const user = await fillPasswords('different-password');
    await user.click(screen.getByRole('button', { name: t('updatePassword') }));
    expect(
      await screen.findByText(t('validationPasswordsMatch')),
    ).toBeInTheDocument();
    expect(mockChangePassword).not.toHaveBeenCalled();
  });

  it('sends current and new passwords and clears all sensitive fields after success', async () => {
    const user = await fillPasswords();
    await user.click(screen.getByRole('button', { name: t('updatePassword') }));
    await waitFor(() =>
      expect(mockChangePassword).toHaveBeenCalledWith({
        password: 'current-password',
        newPassword: 'new-password',
      }),
    );
    await waitFor(() =>
      expect(screen.getByLabelText(t('currentPassword'))).toHaveValue(''),
    );
    expect(screen.getByLabelText(t('newPassword'))).toHaveValue('');
    expect(screen.getByLabelText(t('confirmPassword'))).toHaveValue('');
    expect(toast.success).toHaveBeenCalledWith(t('toastPasswordUpdatedTitle'));
  });

  it('retains values after a service error and permits retry', async () => {
    mockChangePassword.mockRejectedValueOnce(
      new Error('Check your current password'),
    );
    const user = await fillPasswords();
    await user.click(screen.getByRole('button', { name: t('updatePassword') }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      t('errorCurrentPasswordInvalid'),
    );
    expect(screen.getByLabelText(t('newPassword'))).toHaveValue('new-password');
    await user.click(screen.getByRole('button', { name: t('updatePassword') }));
    await waitFor(() =>
      expect(screen.getByLabelText(t('newPassword'))).toHaveValue(''),
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(mockChangePassword).toHaveBeenCalledTimes(2);
  });
});
