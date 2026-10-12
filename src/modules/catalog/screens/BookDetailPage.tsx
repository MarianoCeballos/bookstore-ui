import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { useCart } from '@/modules/account/context/CartContext';
import { useFavorites } from '@/modules/account/context/FavoritesContext';
import { useBook } from '@/modules/catalog/hooks/useBooks';
import { useBookReviews } from '@/modules/catalog/hooks/useCatalogQueries';
import { accountService } from '@/modules/account/services/account.service';

interface ReviewInput {
  title: string;
  review: string;
  rating: number;
}

const reviewSchema = yup.object({
  title: yup.string().required('A review title is required').max(20),
  review: yup.string().required('Write a short review').max(255),
  rating: yup.number().required().min(1).max(5),
});

export default function BookDetailPage() {
  const id = Number(useParams().id);
  const { t } = useTranslation();
  const { user } = useAuth();
  const { add: addToCart } = useCart();
  const {
    add: addFavorite,
    remove: removeFavorite,
    items: favorites,
  } = useFavorites();
  const [rating, setRating] = useState(5);
  const {
    data: book,
    isPending: isBookPending,
    isError: isBookError,
  } = useBook(id);
  const { data: reviewsData, refetch: refetchReviews } = useBookReviews(id);

  const form = useForm<ReviewInput>({
    resolver: yupResolver(reviewSchema),
    defaultValues: { title: '', review: '', rating: 5 },
  });

  if (isBookPending)
    return (
      <Container>
        <Typography>{t('loadingBook')}</Typography>
      </Container>
    );
  if (isBookError || !book) {
    return (
      <Container>
        <Alert severity="error">{t('bookNotFound')}</Alert>
      </Container>
    );
  }

  const submitReview = form.handleSubmit(async (values) => {
    try {
      await accountService.createReview({ ...values, bookID: id });
      toast.success('Your review has been published.');
      form.reset();
      setRating(5);
      await refetchReviews();
    } catch {
      toast.error('Your review could not be saved.');
    }
  });

  const report = async (reviewId: number) => {
    try {
      await accountService.reportReview(reviewId);
      toast.success('The review was reported for moderation.');
      await refetchReviews();
    } catch {
      toast.error('This review could not be reported.');
    }
  };

  const isFavorite = favorites.some((item) => item.ID === book.ID);
  const reviews = reviewsData ?? [];
  const bookMetadata = [
    book.publisher,
    book.publishedDate,
    book.pageCount != null ? `${book.pageCount} pages` : undefined,
    book.language,
  ]
    .filter((value) => value !== undefined && value !== '')
    .join(' · ');

  return (
    <Container maxWidth="lg">
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={5}>
        <Box
          component="img"
          src={book.image}
          alt={`Cover of ${book.title}`}
          sx={{
            width: { xs: '100%', md: 360 },
            maxHeight: 520,
            objectFit: 'contain',
            bgcolor: 'grey.50',
            borderRadius: 3,
            p: 2,
          }}
        />
        <Stack spacing={2} sx={{ flex: 1 }}>
          <Typography variant="h3">{book.title}</Typography>
          <Typography color="text.secondary">
            {book.authors.join(', ')}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Rating value={book.rating} precision={0.1} readOnly />
            <Typography>{book.rating.toFixed(1)}</Typography>
          </Stack>
          <Typography
            variant="h5"
            color="primary.main"
            sx={{ fontWeight: 700 }}
          >
            ${Number(book.price).toFixed(2)}
          </Typography>
          <Typography>{book.description}</Typography>
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
            {book.categories.map((item) => (
              <Chip key={item} label={item} />
            ))}
          </Stack>
          {bookMetadata && (
            <Typography variant="body2" color="text.secondary">
              {bookMetadata}
            </Typography>
          )}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant="contained"
              onClick={() =>
                addToCart(book.ID)
                  .then(() => toast.success('Added to your cart.'))
                  .catch(() =>
                    toast.error('Sign in to add books to your cart.'),
                  )
              }
            >
              {t('addToCart')}
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                isFavorite
                  ? removeFavorite(book.ID)
                      .then(() => toast.success('Removed from favorites.'))
                      .catch(() =>
                        toast.error('The book could not be removed.'),
                      )
                  : addFavorite(book.ID)
                      .then(() => toast.success('Added to favorites.'))
                      .catch(() => toast.error('Sign in to save favorites.'))
              }
            >
              {isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
            </Button>
          </Stack>
        </Stack>
      </Stack>
      <Divider sx={{ my: 5 }} />
      <Typography variant="h4" sx={{ mb: 2 }}>
        {t('readerReviews')}
      </Typography>
      <Stack spacing={2}>
        {reviews.map((review) => (
          <Card variant="outlined" key={review.ID}>
            <CardContent>
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'start' }}
              >
                <Box>
                  <Typography variant="h6">{review.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {review.user.username} ·{' '}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Rating readOnly value={review.rating} size="small" />
              </Stack>
              <Typography sx={{ mt: 1 }}>{review.review}</Typography>
              {user && review.userID !== user.ID && (
                <Button size="small" onClick={() => report(review.ID)}>
                  {t('reportReview')}
                </Button>
              )}
              {user?.admin && (
                <Button
                  size="small"
                  color="error"
                  onClick={() =>
                    accountService
                      .deleteReview(review.ID)
                      .then(() => refetchReviews())
                  }
                >
                  {t('removeReview')}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        {!reviews.length && (
          <Typography color="text.secondary">{t('noReviews')}</Typography>
        )}
      </Stack>
      {user && (
        <Box
          component="form"
          onSubmit={submitReview}
          className="form-stack"
          sx={{ mt: 4, maxWidth: 640 }}
        >
          <Typography variant="h5">{t('addReview')}</Typography>
          <TextField
            label={t('reviewTitle')}
            {...form.register('title')}
            error={Boolean(form.formState.errors.title)}
            helperText={form.formState.errors.title?.message}
          />
          <TextField
            label={t('review')}
            multiline
            minRows={3}
            {...form.register('review')}
            error={Boolean(form.formState.errors.review)}
            helperText={form.formState.errors.review?.message}
          />
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Typography>{t('rating')}</Typography>
            <Rating
              value={rating}
              onChange={(_, value) => {
                const nextRating = value ?? 1;
                setRating(nextRating);
                form.setValue('rating', nextRating);
              }}
            />
          </Stack>
          <Button
            type="submit"
            variant="contained"
            disabled={form.formState.isSubmitting}
          >
            {t('publishReview')}
          </Button>
        </Box>
      )}
    </Container>
  );
}
