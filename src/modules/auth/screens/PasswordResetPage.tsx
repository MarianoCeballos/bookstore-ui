import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ROUTES } from '@/constants';
import { authService } from '@/modules/auth/services/auth.service';
import { getLocalizedErrorMessage } from '@/utils/error';

export default function PasswordResetPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [user, setUser] = useState('');
  const [ID, setID] = useState('');
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
    const numericId = Number(ID.trim());
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

  return (
    <Container maxWidth="sm">
      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {t('resetPassword')}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {t('resetInstructions')}
        </Typography>

        {notice && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {notice}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 700 }}>
              {t('resetStep1Title')}
            </Typography>
            <Stack spacing={1.5}>
              <TextField
                label={t('usernameOrEmail')}
                value={user}
                onChange={(event) => setUser(event.target.value)}
                disabled={isSendingCode}
                fullWidth
              />
              <Button
                variant="outlined"
                onClick={() => void requestCode()}
                disabled={!user.trim() || isSendingCode}
                startIcon={
                  isSendingCode ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : undefined
                }
              >
                {isSendingCode ? t('sendingReset') : t('sendReset')}
              </Button>
            </Stack>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 700 }}>
              {t('resetStep2Title')}
            </Typography>
            <Stack spacing={1.5}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <TextField
                  label={t('accountId')}
                  value={ID}
                  onChange={(event) => setID(event.target.value)}
                  disabled={isVerifyingCode}
                  fullWidth
                />
                <TextField
                  label={t('emailCode')}
                  value={resetCode}
                  onChange={(event) => setResetCode(event.target.value)}
                  disabled={isVerifyingCode}
                  fullWidth
                />
              </Stack>
              <Button
                variant="outlined"
                onClick={() => void verifyCode()}
                disabled={!ID.trim() || !resetCode.trim() || isVerifyingCode}
                startIcon={
                  isVerifyingCode ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : undefined
                }
              >
                {isVerifyingCode ? t('verifyingCode') : t('verifyCode')}
              </Button>
            </Stack>
          </Box>

          {resetToken && (
            <>
              <Divider />
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1.5, fontWeight: 700 }}
                >
                  {t('resetStep3Title')}
                </Typography>
                <Stack spacing={1.5}>
                  <TextField
                    label={t('newPassword')}
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    disabled={isSavingPassword}
                    fullWidth
                  />
                  <TextField
                    label={t('confirmPassword')}
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    disabled={isSavingPassword}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    onClick={() => void savePassword()}
                    disabled={isSavingPassword}
                    startIcon={
                      isSavingPassword ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : undefined
                    }
                  >
                    {isSavingPassword ? t('savingPassword') : t('savePassword')}
                  </Button>
                </Stack>
              </Box>
            </>
          )}

          <Divider />
          <Button
            component={Link}
            to={ROUTES.LOGIN}
            color="inherit"
            size="small"
          >
            {t('continueSignIn')}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
