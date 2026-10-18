import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import {
  Box,
  Chip,
  Divider,
  Paper,
  Rating,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageStateCard } from '@/components/PageStateCard';
import { ROUTES } from '@/constants';
import type { Review } from '@/interfaces/models';
import { useUi } from '@/modules/ui/context/UiContext';
import { formatDate } from '@/utils/format';

interface AccountReviewsSectionProps {
  reviews: Review[];
  isPending: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export function AccountReviewsSection({
  reviews,
  isPending,
  isError = false,
  onRetry,
}: AccountReviewsSectionProps) {
  const { t } = useTranslation();
  const { language } = useUi();

  return (
    <Paper
      id="my-reviews-section"
      variant="outlined"
      sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 2 }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <RateReviewOutlinedIcon color="primary" />
          <Typography variant="h6">{t('myReviewsSectionTitle')}</Typography>
        </Stack>
        <Chip
          size="small"
          label={t('reviewsCount', { count: reviews.length })}
          variant="outlined"
        />
      </Stack>

      <Divider sx={{ mb: 2.5 }} />

      {isPending && (
        <Stack spacing={1.5}>
          <Skeleton variant="rounded" height={84} />
          <Skeleton variant="rounded" height={84} />
        </Stack>
      )}

      {!isPending && isError && (
        <PageStateCard
          variant="error"
          title={t('errorGeneric')}
          description={t('myReviewsErrorDescription')}
          actionLabel={t('retry')}
          onAction={onRetry}
        />
      )}

      {!isPending && !isError && reviews.length === 0 && (
        <PageStateCard
          title={t('myReviewsEmptyTitle')}
          description={t('myReviewsEmptyDescription')}
          icon={<RateReviewOutlinedIcon fontSize="medium" />}
          actionLabel={t('browse')}
          actionTo={ROUTES.BOOKS}
        />
      )}

      {!isPending && !isError && reviews.length > 0 && (
        <Stack spacing={2}>
          {reviews.map((review) => (
            <Paper
              key={review.ID}
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(255, 250, 240, 0.5)',
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  mb: 1,
                }}
              >
                <Box>
                  <Typography
                    component={Link}
                    to={ROUTES.BOOK_DETAIL(review.bookID)}
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: 'primary.dark',
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    {review.book.title}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {review.title}
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: 'center' }}
                >
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(review.createdAt, language)}
                  </Typography>
                </Stack>
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: 'pre-line' }}
              >
                {review.review}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
