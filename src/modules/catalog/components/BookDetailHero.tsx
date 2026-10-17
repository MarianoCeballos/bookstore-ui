import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ShoppingCartCheckoutRoundedIcon from '@mui/icons-material/ShoppingCartCheckoutRounded';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'sonner';
import { BookCover } from '@/components/BookCover';
import { ROUTES } from '@/constants';
import type { Book } from '@/interfaces/models';
import { useCart } from '@/modules/account/context/CartContext';
import { useFavorites } from '@/modules/account/context/FavoritesContext';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { BookMetadataGrid } from '@/modules/catalog/components/BookMetadataGrid';
import { useUi } from '@/modules/ui/context/UiContext';
import { getLocalizedErrorMessage } from '@/utils/error';
import { formatCurrency } from '@/utils/format';

interface BookDetailHeroProps {
  book: Book;
  reviewCount: number;
}

export function BookDetailHero({ book, reviewCount }: BookDetailHeroProps) {
  const { t } = useTranslation();
  const { language } = useUi();
  const { user } = useAuth();
  const { items: cartItems, add: addToCart } = useCart();
  const {
    items: favoriteItems,
    add: addFavorite,
    remove: removeFavorite,
  } = useFavorites();

  const [isCartMutating, setIsCartMutating] = useState(false);
  const [isFavoriteMutating, setIsFavoriteMutating] = useState(false);

  const isInCart = cartItems.some((item) => item.ID === book.ID);
  const isFavorite = favoriteItems.some((item) => item.ID === book.ID);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error(t('signInDescription'));
      return;
    }
    if (isInCart) {
      toast.info(t('toastAlreadyInCart'));
      return;
    }
    setIsCartMutating(true);
    try {
      await addToCart(book.ID);
      toast.success(t('toastAddedToCart'));
    } catch (error) {
      toast.error(getLocalizedErrorMessage(error, t));
    } finally {
      setIsCartMutating(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error(t('signInDescription'));
      return;
    }
    setIsFavoriteMutating(true);
    try {
      if (isFavorite) {
        await removeFavorite(book.ID);
        toast.success(t('toastRemovedFromFavorites'));
      } else {
        await addFavorite(book.ID);
        toast.success(t('toastAddedToFavorites'));
      }
    } catch (error) {
      toast.error(getLocalizedErrorMessage(error, t));
    } finally {
      setIsFavoriteMutating(false);
    }
  };

  return (
    <Box>
      <Button
        component={RouterLink}
        to={ROUTES.BOOKS}
        startIcon={<ArrowBackRoundedIcon />}
        size="small"
        sx={{ mb: 2, fontWeight: 600 }}
      >
        {t('backToCatalog')}
      </Button>

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2.5, sm: 4 },
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: '0 8px 28px rgba(30, 17, 11, 0.08)',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 3.5, md: 5 }}
          sx={{ alignItems: { xs: 'center', md: 'flex-start' } }}
        >
          <Box
            sx={{
              width: { xs: '100%', sm: 280, md: 320 },
              maxWidth: 320,
              flexShrink: 0,
            }}
          >
            <BookCover
              src={book.image}
              title={book.title}
              author={book.authors[0]}
              variant="hero"
              sx={{
                width: '100%',
                height: { xs: 380, sm: 430 },
                borderRadius: 2,
                p: 2,
                boxShadow: '0 10px 24px rgba(30, 17, 11, 0.14)',
              }}
            />
          </Box>

          <Stack spacing={2} sx={{ flex: 1, minWidth: 0, width: '100%' }}>
            {book.categories.length > 0 && (
              <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
                {book.categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    component={RouterLink}
                    to={`${ROUTES.BOOKS}?category=${encodeURIComponent(category)}`}
                    clickable
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>
            )}

            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2.25rem' },
                  lineHeight: 1.2,
                  wordBreak: 'break-word',
                }}
              >
                {book.title}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 1, flexWrap: 'wrap', alignItems: 'center' }}
              >
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ fontWeight: 600 }}
                >
                  {t('author')}:
                </Typography>
                {book.authors.length > 0 ? (
                  book.authors.map((author, index) => (
                    <Box
                      key={author}
                      component="span"
                      sx={{ display: 'inline-flex', alignItems: 'baseline' }}
                    >
                      <Typography
                        component={RouterLink}
                        to={`${ROUTES.BOOKS}?author=${encodeURIComponent(author)}`}
                        variant="subtitle1"
                        color="primary.main"
                        sx={{
                          fontWeight: 700,
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                      >
                        {author}
                      </Typography>
                      {index < book.authors.length - 1 && (
                        <Typography
                          component="span"
                          variant="subtitle1"
                          color="text.secondary"
                        >
                          ,
                        </Typography>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography variant="subtitle1" color="text.secondary">
                    {t('unknownAuthor')}
                  </Typography>
                )}
              </Stack>
            </Box>

            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: 'center', flexWrap: 'wrap' }}
            >
              <Rating value={book.rating} precision={0.1} readOnly />
              <Typography sx={{ fontWeight: 700 }}>
                {book.rating > 0 ? book.rating.toFixed(1) : t('noRatingsYet')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ({t('reviewsCount', { count: reviewCount })})
              </Typography>
            </Stack>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: 'rgba(239, 227, 202, 0.42)',
                borderRadius: 2,
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  color="primary.main"
                  sx={{ fontWeight: 800, lineHeight: 1.1 }}
                >
                  {formatCurrency(book.price, language)}
                </Typography>
                <Stack
                  direction="row"
                  spacing={0.75}
                  sx={{ mt: 0.5, alignItems: 'center' }}
                >
                  <VerifiedOutlinedIcon
                    sx={{ fontSize: 16, color: 'success.main' }}
                  />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    {t('instantDigitalDelivery')}
                  </Typography>
                </Stack>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
                {isInCart ? (
                  <Button
                    component={RouterLink}
                    to={ROUTES.CART}
                    variant="contained"
                    color="secondary"
                    startIcon={<ShoppingCartCheckoutRoundedIcon />}
                  >
                    {t('inCart')} · {t('viewCart')}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => void handleAddToCart()}
                    disabled={isCartMutating}
                    startIcon={
                      isCartMutating ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <ShoppingCartOutlinedIcon />
                      )
                    }
                  >
                    {t('addToCart')}
                  </Button>
                )}

                <Button
                  variant="outlined"
                  onClick={() => void handleToggleFavorite()}
                  disabled={isFavoriteMutating}
                  startIcon={
                    isFavoriteMutating ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : isFavorite ? (
                      <FavoriteRoundedIcon color="error" />
                    ) : (
                      <FavoriteBorderRoundedIcon />
                    )
                  }
                >
                  {isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
                </Button>
              </Stack>
            </Paper>

            {isInCart && (
              <Stack
                direction="row"
                spacing={0.75}
                sx={{ alignItems: 'center', color: 'success.main' }}
              >
                <CheckCircleOutlineRoundedIcon fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {t('toastAlreadyInCart')}
                </Typography>
              </Stack>
            )}

            <Divider />

            <Box>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  display: 'block',
                  mb: 0.5,
                }}
              >
                {t('synopsis')}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.75,
                  whiteSpace: 'pre-line',
                  color: 'text.primary',
                }}
              >
                {book.description?.trim() || t('noDescription')}
              </Typography>
            </Box>

            <BookMetadataGrid book={book} />
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
