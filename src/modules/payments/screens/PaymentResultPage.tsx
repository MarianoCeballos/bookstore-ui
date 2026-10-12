import { useEffect, useState } from 'react';
import { Alert, Button, Container, Stack, Typography } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { paymentsService } from '@/modules/payments/services/payments.service';
import { useTranslation } from 'react-i18next';

export default function PaymentResultPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const status = params.get('status') ?? 'pending';
  const paymentId =
    params.get('payment_id') ?? params.get('collection_id') ?? '';
  const [result, setResult] = useState<{ message: string; error: boolean } | null>(null);

  useEffect(() => {
    if (!paymentId) return;
    paymentsService
      .verify(paymentId)
      .then((order) => setResult({
        message: `Payment ${order.status}. Order #${order.ID} is in your purchase history.`,
        error: false,
      }))
      .catch(() => {
        setResult({
          message: 'We could not verify this payment yet. Check your purchase history before retrying.',
          error: true,
        });
      });
  }, [paymentId, status]);

  const message =
    result?.message ??
    (paymentId
      ? 'Checking your payment status…'
      : status === 'failure'
        ? 'Your payment was not approved. Your cart is still available.'
        : 'Payment details were not returned. Check your purchase history before retrying.');
  const error = result?.error ?? status === 'failure';

  return (
    <Container maxWidth="sm">
      <Stack spacing={2} sx={{ py: 8, alignItems: 'center', textAlign: 'center' }}>
        <Typography variant="h4">{t('paymentUpdate')}</Typography>
        <Alert severity={error ? 'warning' : 'success'}>{message}</Alert>
        <Button component={Link} to="/history" variant="contained">{t('viewHistory')}</Button>
        <Button component={Link} to="/books">{t('browse')}</Button>
      </Stack>
    </Container>
  );
}
