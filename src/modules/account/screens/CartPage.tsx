import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ShoppingCartCheckoutRoundedIcon from '@mui/icons-material/ShoppingCartCheckoutRounded';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { BookCover } from '@/components/BookCover';
import { PageLoader } from '@/components/PageLoader';
import { PageStateCard } from '@/components/PageStateCard';
import { ROUTES } from '@/constants';
import type { Book } from '@/interfaces/models';
import { useCart } from '@/modules/account/context/CartContext';
import { useCartCheckout } from '@/modules/account/hooks/useCartCheckout';
import { useUi } from '@/modules/ui/context/UiContext';
import { getLocalizedErrorMessage } from '@/utils/error';
import { formatCurrency } from '@/utils/format';

export default function CartPage() {
  const { t } = useTranslation();
  const { language } = useUi();
  const { items, loading, add, remove } = useCart();
  const {
    gift,
    recipient,
    recipientError,
    error,
    isCheckingOut,
    toggleGift,
    updateRecipient,
    checkout,
  } = useCartCheckout();

  const [removingId, setRemovingId] = useState<number | null>(null);

  const total = items.reduce((sum, item) => sum + Number(item.price), 0);

  const handleRemove = async (book: Book) => {
    setRemovingId(book.ID);
    try {
      const removalPromise = remove(book.ID);
      toast.promise(removalPromise, {
        loading: t('toastRemovingFromCart'),
        success: t('toastRemovedFromCart'),
        description: book.title,
        action: {
          label: t('undo'),
          onClick: () => void add(book.ID),
        },
        error: (err: unknown) =>
          getLocalizedErrorMessage(err, t, 'toastRemoveFromCartError'),
      });
      await removalPromise;
    } catch {
      // Handled by toast.promise
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h3" sx={{ mb: 3 }}>
          {t('cartTitle')}
        </Typography>
        <PageLoader label={t('loadingCart')} minHeight={320} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{
          mb: 3,
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'baseline' },
        }}
      >
        <Typography variant="h3">{t('cartTitle')}</Typography>
        {items.length > 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            {t('itemsInCart', { count: items.length })}
          </Typography>
        )}
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!items.length ? (
        <PageStateCard
          title={t('emptyCart')}
          description={t('emptyCartDescription')}
          icon={<ShoppingBagOutlinedIcon fontSize="medium" />}
          actionLabel={t('browse')}
          actionTo={ROUTES.BOOKS}
        />
      ) : (
        <Stack spacing={2.5}>
          <Stack spacing={1.5}>
            {items.map((book) => {
              const isRemoving = removingId === book.ID;
              return (
                <Paper
                  variant="outlined"
                  key={book.ID}
                  sx={{ p: 2, borderRadius: 2 }}
                >
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ flex: 1, minWidth: 0, alignItems: 'center' }}
                    >
                      <BookCover
                        src={book.image}
                        title={book.title}
                        variant="compact"
                        sx={{
                          width: 68,
                          height: 96,
                          borderRadius: 1,
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          component={Link}
                          to={ROUTES.BOOK_DETAIL(book.ID)}
                          variant="h6"
                          color="inherit"
                          sx={{
                            fontWeight: 700,
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' },
                            display: 'block',
                          }}
                        >
                          {book.title}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {book.authors.length > 0
                            ? book.authors.join(', ')
                            : t('unknownAuthor')}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        width: { xs: '100%', sm: 'auto' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {formatCurrency(book.price, language)}
                      </Typography>
                      <Button
                        color="error"
                        variant="outlined"
                        size="small"
                        disabled={isRemoving || isCheckingOut}
                        startIcon={
                          isRemoving ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <DeleteOutlineRoundedIcon fontSize="small" />
                          )
                        }
                        onClick={() => void handleRemove(book)}
                      >
                        {t('remove')}
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>

          <Paper
            variant="outlined"
            sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 2 }}
          >
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
              {t('orderSummary')}
            </Typography>

            <FormControlLabel
              control={
                <Checkbox
                  checked={gift}
                  onChange={(event) => toggleGift(event.target.checked)}
                  disabled={isCheckingOut}
                />
              }
              label={t('giftOrder')}
            />

            {gift && (
              <TextField
                fullWidth
                sx={{ mt: 1.5 }}
                label={t('giftRecipient')}
                value={recipient}
                onChange={(event) => updateRecipient(event.target.value)}
                error={Boolean(recipientError)}
                helperText={recipientError || t('giftRecipientHelper')}
                disabled={isCheckingOut}
                slotProps={{ htmlInput: { maxLength: 255 } }}
              />
            )}

            <Divider sx={{ my: 2.5 }} />

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {t('total')}: {formatCurrency(total, language)}
              </Typography>
              <Button
                variant="contained"
                size="large"
                disabled={isCheckingOut}
                startIcon={
                  isCheckingOut ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <ShoppingCartCheckoutRoundedIcon />
                  )
                }
                onClick={() => void checkout()}
              >
                {isCheckingOut ? t('processingCheckout') : t('continuePayment')}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      )}
    </Container>
  );
}
