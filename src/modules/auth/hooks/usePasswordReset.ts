import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ROUTES } from '@/constants';
import { authService } from '@/modules/auth/services/auth.service';
import { getLocalizedErrorMessage } from '@/utils/error';

/**
 * Drives the three-step password recovery flow (request code, verify code,
 * save new password) and owns all of its form state and feedback.
 */
export function usePasswordReset() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [user, setUser] = useState('');
  const [accountId, setAccountId] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const requestCode = async () => {
    const trimmedUser = user.trim();
    if (!trimmedUser) {
      setError(t('validationRequired'));
      return;
    }
    setError('');
    setIsSendingCode(true);
    try {
      await authService.requestReset(trimmedUser);
      const message = t('resetEmailSent');
      setNotice(message);
      toast.info(message, { description: trimmedUser });
    } catch (err) {
      const message = getLocalizedErrorMessage(err, t);
      setError(message);
      toast.error(message);
    } finally {
      setIsSendingCode(false);
    }
  };

  const verifyCode = async () => {
    const numericId = Number(accountId.trim());
    if (!Number.isSafeInteger(numericId) || numericId < 1) {
      setError(t('validationAccountIdNumeric'));
      return;
    }
    if (!resetCode.trim()) {
      setError(t('validationRequired'));
      return;
    }
    setError('');
    setIsVerifyingCode(true);
    try {
      const result = await authService.confirmReset(
        numericId,
        resetCode.trim(),
      );
      setResetToken(result.data.resetToken);
      const message = t('resetCodeVerified');
      setNotice(message);
      toast.success(message);
    } catch (err) {
      const message = getLocalizedErrorMessage(
        err,
        t,
        'errorResetCodeInvalidOrExpired',
      );
      setError(message);
      toast.error(message);
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const savePassword = async () => {
    setError('');
    if (password.length < 12) {
      setError(t('validationPasswordMin'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('validationPasswordsMatch'));
      return;
    }
    setIsSavingPassword(true);
    try {
      await authService.resetPassword(resetToken, password, confirmPassword);
      toast.success(t('toastPasswordUpdatedTitle'), {
        description: t('passwordUpdated'),
      });
      navigate(ROUTES.LOGIN);
    } catch (err) {
      const message = getLocalizedErrorMessage(
        err,
        t,
        'errorResetCodeInvalidOrExpired',
      );
      setError(message);
      toast.error(message);
    } finally {
      setIsSavingPassword(false);
    }
  };

  return {
    user,
    setUser,
    accountId,
    setAccountId,
    resetCode,
    setResetCode,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    resetToken,
    notice,
    error,
    isSendingCode,
    isVerifyingCode,
    isSavingPassword,
    requestCode,
    verifyCode,
    savePassword,
  };
}
