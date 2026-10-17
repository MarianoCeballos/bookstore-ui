import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ROUTES } from '@/constants';
import { paymentsService } from '@/modules/payments/services/payments.service';

export default function PaymentResultPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [params] = useSearchParams();
  const statusParam = params.get('status') ?? 'pending';
  const paymentId =
    params.get('payment_id') ?? params.get('collection_id') ?? '';

  const [resolved, setResolved] = useState<{
    paymentId: string;
    outcome: 'approved' | 'pending' | 'error';
  } | null>(null);

  useEffect(() => {
    if (!paymentId) return;
    paymentsService
      .verify(paymentId)
      .then(async (order) => {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['cart'] }),
          queryClient.invalidateQueries({ queryKey: ['orders'] }),
        ]);
        const normalized = order.status.toLowerCase();
        if (
          normalized.includes('approved') ||
          normalized.includes('completed')
        ) {
          setResolved({ paymentId, outcome: 'approved' });
          toast.success(t('paymentUpdate'), {
            description: t('paymentApproved'),
          });
        } else {
          setResolved({ paymentId, outcome: 'pending' });
          toast.info(t('paymentUpdate'), {
            description: t('paymentPending'),
          });
        }
      })
      .catch(() => {
        setResolved({ paymentId, outcome: 'error' });
        toast.warning(t('paymentUpdate'), {
          description: t('paymentVerifyError'),
        });
      });
  }, [paymentId, queryClient, t]);

  const verifyState: 'idle' | 'loading' | 'approved' | 'pending' | 'error' =
    !paymentId
      ? 'idle'
      : resolved?.paymentId === paymentId
        ? resolved.outcome
        : 'loading';

  const renderFeedback = () => {
    if (verifyState === 'loading') {
      return (
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <CircularProgress size={22} />
          <Typography color="text.secondary">
            {t('paymentVerifying')}
          </Typography>
        </Stack>
      );
    }
    if (verifyState === 'approved') {
      return (
        <Alert severity="success" sx={{ width: '100%' }}>
          {t('paymentApproved')}
        </Alert>
      );
    }
    if (verifyState === 'pending') {
      return (
        <Alert severity="info" sx={{ width: '100%' }}>
          {t('paymentPending')}
        </Alert>
      );
    }
    if (verifyState === 'error') {
      return (
        <Alert severity="warning" sx={{ width: '100%' }}>
          {t('paymentVerifyError')}
        </Alert>
      );
    }
    if (statusParam === 'failure') {
      return (
        <Alert severity="warning" sx={{ width: '100%' }}>
          {t('paymentDeclined')}
        </Alert>
      );
    }
    return (
      <Alert severity="info" sx={{ width: '100%' }}>
        {t('paymentPending')}
      </Alert>
    );
  };

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
          <Typography variant="h4">{t('paymentUpdate')}</Typography>
          {renderFeedback()}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              component={Link}
              to={ROUTES.HISTORY}
              variant="contained"
              disabled={verifyState === 'loading'}
            >
              {t('viewHistory')}
            </Button>
            <Button component={Link} to={ROUTES.BOOKS} variant="outlined">
              {t('browse')}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
