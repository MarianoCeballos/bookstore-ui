import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
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

  // Keep the latest translator without making the confirmation request depend
  // on it: `t` changes identity on every language switch.
  const latestT = useRef(t);
  useEffect(() => {
    latestT.current = t;
  }, [t]);

  // Confirm each token exactly once, even if the effect re-runs (language
  // switch, React StrictMode) — the server burns the token on first use.
  const confirmedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!token || confirmedTokenRef.current === token) return;
    confirmedTokenRef.current = token;
    authService
      .confirm(token)
      .then(() => {
        setResolved({ token, outcome: 'success' });
        toast.success(latestT.current('emailConfirmation'), {
          description: latestT.current('confirmSuccess'),
        });
      })
      .catch(() => {
        setResolved({ token, outcome: 'error' });
        toast.error(latestT.current('emailConfirmation'), {
          description: latestT.current('confirmError'),
        });
      });
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
