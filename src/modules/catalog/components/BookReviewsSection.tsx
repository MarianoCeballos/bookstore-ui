import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PageStateCard } from '@/components/PageStateCard';
import { ROUTES } from '@/constants';
import type { BookReviews } from '@/interfaces/models';
import { accountService } from '@/modules/account/services/account.service';
import { useAuth } from '@/modules/auth/context/AuthContext';
import {
  BookReviewForm,
  type ReviewFormValues,
} from '@/modules/catalog/components/BookReviewForm';
import { useUi } from '@/modules/ui/context/UiContext';
import { getLocalizedErrorMessage } from '@/utils/error';
import { formatDate, getUserInitials } from '@/utils/format';

type BookReviewItem = BookReviews[number];

interface BookReviewsSectionProps {
  bookId: number;
  reviews: BookReviews;
}

export function BookReviewsSection({
  bookId,
  reviews,
}: BookReviewsSectionProps) {
  const { t } = useTranslation();
  const { language } = useUi();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [editingReview, setEditingReview] = useState<BookReviewItem | null>(
    null,
  );
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reportingReviewId, setReportingReviewId] = useState<number | null>(
    null,
  );

  const ownReview = user
    ? reviews.find((review) => review.userID === user.ID)
    : undefined;

  const invalidateBookQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['books', bookId] }),
      queryClient.invalidateQueries({ queryKey: ['books'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] }),
    ]);
  };

  const handleCreateReview = async (values: ReviewFormValues) => {
    try {
      await accountService.createReview({ ...values, bookID: bookId });
      toast.success(t('toastReviewPublished'), {
        description: values.title.trim(),
      });
      await invalidateBookQueries();
    } catch (error) {
      toast.error(getLocalizedErrorMessage(error, t));
      throw error;
    }
  };

  const handleUpdateReview = async (values: ReviewFormValues) => {
    if (!editingReview) return;
    try {
      await accountService.updateReview(editingReview.ID, values);
      toast.success(t('toastReviewUpdated'), {
        description: values.title.trim(),
      });
      setEditingReview(null);
      await invalidateBookQueries();
    } catch (error) {
      toast.error(getLocalizedErrorMessage(error, t));
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingReviewId == null) return;
    const deletedTitle = reviews.find(
      (item) => item.ID === deletingReviewId,
    )?.title;
    setIsDeleting(true);
    try {
      await accountService.deleteReview(deletingReviewId);
      toast.success(t('toastReviewDeleted'), {
        description: deletedTitle,
      });
      if (editingReview?.ID === deletingReviewId) {
        setEditingReview(null);
      }
      setDeletingReviewId(null);
      await invalidateBookQueries();
    } catch (error) {
      toast.error(getLocalizedErrorMessage(error, t));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReportReview = async (reviewId: number) => {
    setReportingReviewId(reviewId);
    try {
      await accountService.reportReview(reviewId);
      toast.info(t('toastReviewReported'), {
        description: t('toastReviewReportedDescription'),
      });
      await invalidateBookQueries();
    } catch (error) {
      toast.error(getLocalizedErrorMessage(error, t));
    } finally {
      setReportingReviewId(null);
    }
  };

  return (
    <Box
      component="section"
      aria-labelledby="reader-reviews-heading"
      sx={{ mt: 5 }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{
          mb: 2.5,
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
        }}
      >
        <Typography id="reader-reviews-heading" variant="h4">
          {t('readerReviews')}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 600 }}
        >
          {t('reviewsCount', { count: reviews.length })}
        </Typography>
      </Stack>

      <Stack spacing={2}>
        {reviews.map((review) => {
          const isOwner = Boolean(user && review.userID === user.ID);
          const canDelete = Boolean(isOwner || user?.admin);
          const alreadyReported = Boolean(
            user && review.reports?.includes(user.ID),
          );

          return (
            <Card
              variant="outlined"
              key={review.ID}
              sx={{
                borderRadius: 2,
                bgcolor: 'background.paper',
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: 'center' }}
                  >
                    <Avatar
                      src={review.user.profilePic || undefined}
                      alt={review.user.username}
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                      }}
                    >
                      {getUserInitials({ username: review.user.username })}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, lineHeight: 1.25 }}
                      >
                        {review.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        @{review.user.username} ·{' '}
                        {formatDate(review.createdAt, language)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Rating readOnly value={review.rating} size="small" />
                </Stack>

                <Typography
                  variant="body2"
                  sx={{ mt: 1.5, lineHeight: 1.65, whiteSpace: 'pre-line' }}
                >
                  {review.review}
                </Typography>

                {user && (
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ mt: 1.5, flexWrap: 'wrap' }}
                  >
                    {isOwner && (
                      <Button
                        size="small"
                        startIcon={<EditOutlinedIcon fontSize="small" />}
                        onClick={() => setEditingReview(review)}
                      >
                        {t('edit')}
                      </Button>
                    )}

                    {canDelete && (
                      <Button
                        size="small"
                        color="error"
                        startIcon={
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        }
                        onClick={() => setDeletingReviewId(review.ID)}
                      >
                        {t('removeReview')}
                      </Button>
                    )}

                    {!isOwner && (
                      <Button
                        size="small"
                        color="inherit"
                        startIcon={<FlagOutlinedIcon fontSize="small" />}
                        disabled={
                          alreadyReported || reportingReviewId === review.ID
                        }
                        onClick={() => void handleReportReview(review.ID)}
                      >
                        {alreadyReported
                          ? t('reportedReview')
                          : t('reportReview')}
                      </Button>
                    )}
                  </Stack>
                )}
              </CardContent>
            </Card>
          );
        })}

        {reviews.length === 0 && (
          <PageStateCard
            title={t('noReviews')}
            description={t('noReviewsDescription')}
            icon={<RateReviewOutlinedIcon fontSize="medium" />}
          />
        )}
      </Stack>

      <Box sx={{ mt: 4 }}>
        {!user && (
          <Alert
            severity="info"
            action={
              <Button
                component={RouterLink}
                to={ROUTES.LOGIN}
                color="inherit"
                size="small"
              >
                {t('signIn')}
              </Button>
            }
          >
            {t('signInToReview')}
          </Alert>
        )}

        {user && editingReview && (
          <BookReviewForm
            key={editingReview.ID}
            isEditing
            initialValues={{
              title: editingReview.title,
              review: editingReview.review,
              rating: editingReview.rating,
            }}
            onSubmit={handleUpdateReview}
            onCancel={() => setEditingReview(null)}
          />
        )}

        {user && !editingReview && ownReview && (
          <Alert
            severity="info"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => setEditingReview(ownReview)}
              >
                {t('editReview')}
              </Button>
            }
          >
            {t('alreadyReviewedInfo')}
          </Alert>
        )}

        {user && !editingReview && !ownReview && (
          <BookReviewForm onSubmit={handleCreateReview} />
        )}
      </Box>

      <ConfirmDialog
        open={deletingReviewId != null}
        title={t('confirmDeleteReviewTitle')}
        description={t('confirmDeleteReviewMessage')}
        confirmLabel={t('removeReview')}
        isLoading={isDeleting}
        onConfirm={() => void handleConfirmDelete()}
        onClose={() => setDeletingReviewId(null)}
      />
    </Box>
  );
}
