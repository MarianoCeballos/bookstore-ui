import type { TFunction } from 'i18next';
import * as yup from 'yup';

export function createContactSchema(t: TFunction) {
  return yup.object({
    sender: yup
      .string()
      .trim()
      .required(t('validationRequired'))
      .email(t('validationEmail')),
    title: yup
      .string()
      .trim()
      .required(t('validationRequired'))
      .max(120, t('validationTitleMax')),
    message: yup
      .string()
      .trim()
      .required(t('validationRequired'))
      .min(10, t('validationMessageMin'))
      .max(4000, t('validationMessageMax')),
  });
}
