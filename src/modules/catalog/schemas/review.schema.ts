import type { TFunction } from 'i18next';
import * as yup from 'yup';

export function createReviewSchema(t: TFunction) {
  return yup.object({
    title: yup.string().trim().required(t('validationRequired')).max(20),
    review: yup.string().trim().required(t('validationRequired')).max(255),
    rating: yup
      .number()
      .required(t('validationRatingRange'))
      .min(1, t('validationRatingRange'))
      .max(5, t('validationRatingRange')),
  });
}
