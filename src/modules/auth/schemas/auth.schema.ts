import type { TFunction } from 'i18next';
import * as yup from 'yup';

export function createLoginSchema(t: TFunction) {
  return yup.object({
    username: yup.string().trim().required(t('validationRequired')),
    password: yup.string().required(t('validationRequired')),
  });
}

export function createRegisterSchema(t: TFunction) {
  return yup.object({
    username: yup
      .string()
      .trim()
      .required(t('validationRequired'))
      .min(3, t('validationUsernameMin'))
      .max(40),
    email: yup
      .string()
      .trim()
      .required(t('validationRequired'))
      .email(t('validationEmail')),
    name: yup.string().trim().required(t('validationRequired')).max(100),
    surname: yup.string().trim().required(t('validationRequired')).max(100),
    password: yup
      .string()
      .required(t('validationRequired'))
      .min(12, t('validationPasswordMin'))
      .max(128),
  });
}
