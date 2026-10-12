import { useState } from 'react';
import {
  Alert,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { toast } from 'sonner';
import { authService } from '@/modules/auth/services/auth.service';
import { useTranslation } from 'react-i18next';

export default function PasswordResetPage() {
  const { t } = useTranslation();
  const [user, setUser] = useState('');
  const [ID, setID] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const requestCode = async () => {
    setError('');
    try {
      const result = await authService.requestReset(user);
      setNotice(result.message);
    } catch {
      setError('The reset request could not be sent.');
    }
  };

  const verifyCode = async () => {
    setError('');
    try {
      const result = await authService.confirmReset(Number(ID), resetCode);
      setResetToken(result.data.resetToken);
      setNotice('Code verified. Choose a new password.');
    } catch {
      setError('The account ID or reset code is invalid or expired.');
    }
  };

  const savePassword = async () => {
    setError('');
    if (password.length < 12 || password !== confirmPassword) {
      setError('Passwords must match and contain at least 12 characters.');
      return;
    }
    try {
      await authService.resetPassword(resetToken, password, confirmPassword);
      toast.success('Your password has been reset.');
      setNotice('You can now sign in with your new password.');
      setResetToken('');
    } catch {
      setError('Your password could not be changed. Request a new reset code.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 } }}>
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
        <Stack spacing={2}>
          <TextField
            label={t('usernameOrEmail')}
            value={user}
            onChange={(event) => setUser(event.target.value)}
          />
          <Button
            variant="outlined"
            onClick={requestCode}
            disabled={!user.trim()}
          >
            {t('sendReset')}
          </Button>
          <TextField
            label={t('accountId')}
            value={ID}
            onChange={(event) => setID(event.target.value)}
          />
          <TextField
            label={t('emailCode')}
            value={resetCode}
            onChange={(event) => setResetCode(event.target.value)}
          />
          <Button
            variant="outlined"
            onClick={verifyCode}
            disabled={!ID || !resetCode}
          >
            {t('verifyCode')}
          </Button>
          {resetToken && (
            <>
              <TextField
                label={t('newPassword')}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <TextField
                label={t('confirmPassword')}
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              <Button variant="contained" onClick={savePassword}>
                {t('savePassword')}
              </Button>
            </>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
