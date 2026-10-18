import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  CircularProgress,
  Paper,
  Rating,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { createReviewSchema } from '@/modules/catalog/schemas/review.schema';
import type { ReviewFormValues } from '@/modules/catalog/types';

interface BookReviewFormProps {
  initialValues?: ReviewFormValues;
  isEditing?: boolean;
  onSubmit: (values: ReviewFormValues) => Promise<void>;
  onCancel?: () => void;
}

export function BookReviewForm({
  initialValues,
  isEditing = false,
  onSubmit,
  onCancel,
}: BookReviewFormProps) {
  const { t } = useTranslation();
  const [rating, setRating] = useState<number>(initialValues?.rating ?? 5);

  const schema = useMemo(() => createReviewSchema(t), [t]);

  const form = useForm<ReviewFormValues>({
    resolver: yupResolver(schema),
    defaultValues: initialValues ?? { title: '', review: '', rating: 5 },
  });

  const handleFormSubmit = form.handleSubmit(async (values) => {
    await onSubmit({
      title: values.title.trim(),
      review: values.review.trim(),
      rating: values.rating,
    });
    if (!isEditing) {
      form.reset({ title: '', review: '', rating: 5 });
      setRating(5);
    }
  });

  return (
    <Paper
      variant="outlined"
      component="form"
      onSubmit={(event) => void handleFormSubmit(event)}
      className="form-stack"
      sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 2, maxWidth: 680 }}
      noValidate
    >
      <Typography variant="h6" sx={{ fontWeight: 700 }}>
        {isEditing ? t('editReview') : t('addReview')}
      </Typography>

      <TextField
        label={t('reviewTitle')}
        slotProps={{ htmlInput: { maxLength: 20 } }}
        {...form.register('title')}
        error={Boolean(form.formState.errors.title)}
        helperText={form.formState.errors.title?.message}
        disabled={form.formState.isSubmitting}
        fullWidth
      />

      <TextField
        label={t('review')}
        multiline
        minRows={3}
        slotProps={{ htmlInput: { maxLength: 255 } }}
        {...form.register('review')}
        error={Boolean(form.formState.errors.review)}
        helperText={form.formState.errors.review?.message}
        disabled={form.formState.isSubmitting}
        fullWidth
      />

      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Typography sx={{ fontWeight: 600 }}>{t('rating')}</Typography>
        <Rating
          name="review-rating"
          value={rating}
          onChange={(_, value) => {
            const nextRating = value ?? 1;
            setRating(nextRating);
            form.setValue('rating', nextRating, { shouldValidate: true });
          }}
          disabled={form.formState.isSubmitting}
        />
      </Stack>

      <Stack direction="row" spacing={1.5} sx={{ pt: 0.5 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={form.formState.isSubmitting}
          startIcon={
            form.formState.isSubmitting ? (
              <CircularProgress size={16} color="inherit" />
            ) : undefined
          }
        >
          {form.formState.isSubmitting
            ? isEditing
              ? t('updatingReview')
              : t('publishingReview')
            : isEditing
              ? t('updateReview')
              : t('publishReview')}
        </Button>

        {isEditing && onCancel && (
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            disabled={form.formState.isSubmitting}
          >
            {t('cancelEdit')}
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
