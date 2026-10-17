import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { authService } from '@/modules/auth/services/auth.service';

export default function ConfirmPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const token = params.get('token')?.trim() ?? '';
  const [resolved, setResolved] = useState<{
    token: string;
    outcome: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    if (!token) return;
    authService
      .confirm(token)
      .then(() => setResolved({ token, outcome: 'success' }))
      .catch(() => setResolved({ token, outcome: 'error' }));
  }, [token]);

  const status: 'loading' | 'success' | 'error' = !token
    ? 'error'
    : resolved?.token === token
      ? resolved.outcome
      : 'loading';

  return (
    <Container maxWidth="sm">
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 3, sm: 5 },
          mt: 4,
          textAlign: 'center',
          borderRadius: 2,
        }}
      >
        <Stack spacing={2.5} sx={{ alignItems: 'center' }}>
          <Typography variant="h4">{t('emailConfirmation')}</Typography>

          {status === 'loading' && (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <CircularProgress size={22} />
              <Typography color="text.secondary">
                {t('confirmingEmail')}
              </Typography>
            </Stack>
          )}

          {status === 'success' && (
            <Alert severity="success" sx={{ width: '100%' }}>
              {t('confirmSuccess')}
            </Alert>
          )}

          {status === 'error' && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {token ? t('confirmError') : t('confirmMissingToken')}
            </Alert>
          )}

          <Button
            component={Link}
            to={ROUTES.LOGIN}
            variant="contained"
            disabled={status === 'loading'}
          >
            {t('continueSignIn')}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
