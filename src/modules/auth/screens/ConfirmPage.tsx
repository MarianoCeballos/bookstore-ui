import { useEffect, useState } from 'react';
import { Alert, Button, Container, Stack, Typography } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '@/modules/auth/services/auth.service';
import { useTranslation } from 'react-i18next';

export default function ConfirmPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const [result, setResult] = useState<{ message: string; failed: boolean } | null>(null);

  useEffect(() => {
    if (!token) return;
    authService
      .confirm(token)
      .then((response) => setResult({ message: response.message, failed: false }))
      .catch(() => {
        setResult({
          message: 'This confirmation link is invalid or expired.',
          failed: true,
        });
      });
  }, [token]);

  const message =
    result?.message ??
    (token
      ? 'Confirming your email address…'
      : 'The confirmation link is missing its token.');
  const failed = result?.failed ?? !token;

  return (
    <Container maxWidth="sm">
      <Stack spacing={2} sx={{ py: 8, alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="h4">{t('emailConfirmation')}</Typography>
        <Alert severity={failed ? 'error' : 'success'}>{message}</Alert>
        <Button component={Link} to="/login" variant="contained">{t('continueSignIn')}</Button>
      </Stack>
    </Container>
  );
}
