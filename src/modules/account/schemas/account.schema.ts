import type { TFunction } from 'i18next';
import * as yup from 'yup';

export function createProfileSchema(t: TFunction) {
  return yup.object({
    username: yup
      .string()
      .trim()
      .required(t('validationRequired'))
      .min(3, t('validationUsernameMin3'))
      .max(40),
    name: yup.string().trim().required(t('validationRequired')).max(100),
    surname: yup.string().trim().required(t('validationRequired')).max(100),
    email: yup
      .string()
      .trim()
      .required(t('validationRequired'))
      .email(t('validationEmail'))
      .max(255),
  });
}

export function createPasswordSchema(t: TFunction) {
  return yup.object({
    password: yup.string().required(t('validationRequired')).max(128),
    newPassword: yup
      .string()
      .required(t('validationRequired'))
      .min(12, t('validationPasswordMin12'))
      .max(128),
    confirmPassword: yup
      .string()
      .required(t('validationRequired'))
      .oneOf([yup.ref('newPassword')], t('validationPasswordsMatch')),
  });
}
