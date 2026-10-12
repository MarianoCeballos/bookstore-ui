import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '@/modules/account/context/CartContext';
import { paymentsService } from '@/modules/payments/services/payments.service';
import { useTranslation } from 'react-i18next';

export default function CartPage() {
  const { t } = useTranslation();
  const { items, loading, remove } = useCart();
  const [gift, setGift] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [error, setError] = useState('');
  const total = items.reduce((sum, item) => sum + Number(item.price), 0);

  const checkout = async () => {
    setError('');
    try {
      const result = await paymentsService.checkout(
        gift,
        recipient || undefined,
      );
      window.location.assign(
        `https://www.mercadopago.com/checkout/v1/redirect?pref_id=${encodeURIComponent(result.preferenceId)}`,
      );
    } catch {
      setError(
        'Checkout could not be started. Please check your cart and try again.',
      );
    }
  };

  if (loading)
    return (
      <Container>
        <Typography>Loading your cart…</Typography>
      </Container>
    );
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" sx={{ mb: 3 }}>
        {t('cartTitle')}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {!items.length ? (
        <Alert severity="info">
          {t('emptyCart')} <Link to="/books">{t('browse')}</Link>.
        </Alert>
      ) : (
        <Stack spacing={2}>
          {items.map((book) => (
            <Paper variant="outlined" key={book.ID} sx={{ p: 2 }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Box
                  component="img"
                  src={book.image}
                  alt=""
                  sx={{ width: 72, height: 96, objectFit: 'contain' }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography color="text.secondary">
                    {book.authors.join(', ')}
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 700 }}>
                  ${Number(book.price).toFixed(2)}
                </Typography>
                <Button
                  color="error"
                  onClick={() =>
                    remove(book.ID)
                      .then(() => toast.success('Removed from cart.'))
                      .catch(() =>
                        toast.error('The item could not be removed.'),
                      )
                  }
                >
                  Remove
                </Button>
              </Stack>
            </Paper>
          ))}
          <Divider />
          <FormControlLabel
            control={
              <Checkbox
                checked={gift}
                onChange={(event) => setGift(event.target.checked)}
              />
            }
            label={t('giftOrder')}
          />
          {gift && (
            <TextField
              label={t('giftRecipient')}
              value={recipient}
              onChange={(event) => setRecipient(event.target.value)}
              slotProps={{ htmlInput: { maxLength: 255 } }}
            />
          )}
          <Stack
            direction="row"
            sx={{ justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography variant="h5">
              {t('total')}: ${total.toFixed(2)}
            </Typography>
            <Button variant="contained" size="large" onClick={checkout}>
              {t('continuePayment')}
            </Button>
          </Stack>
        </Stack>
      )}
    </Container>
  );
}
