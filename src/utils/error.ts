import axios from 'axios';
import type { TFunction } from 'i18next';

const SERVER_MESSAGE_TO_KEY: Record<string, string> = {
  'invalid credentials': 'errorInvalidCredentials',
  'confirm your email address before signing in': 'errorConfirmEmailFirst',
  'account is disabled or banned': 'errorAccountDisabledOrBanned',
  'username or email is already registered': 'errorUserAlreadyRegistered',
  'email or username is already registered': 'errorUserAlreadyRegistered',
  'email is already registered': 'errorUserAlreadyRegistered',
  'username is already registered': 'errorUserAlreadyRegistered',
  'confirmation link is invalid or expired':
    'errorConfirmationInvalidOrExpired',
  'user not found': 'errorUserNotFound',
  'reset code is invalid or expired': 'errorResetCodeInvalidOrExpired',
  'your cart is empty': 'errorCartEmpty',
  'book not found': 'errorBookNotFound',
  'review not found': 'errorReviewNotFound',
  'you have already reviewed this book': 'errorAlreadyReviewedBook',
  'you can only modify your own reviews': 'errorReviewNotOwned',
  'order not found': 'errorOrderNotFound',
  'book title already exists': 'errorBookTitleExists',
  'profile picture file is required': 'errorProfilePicRequired',
  'profile picture must be 2 mb or smaller': 'errorProfilePicSize',
  'profile picture must be a valid jpeg, png, webp, or gif image':
    'errorProfilePicFormat',
  'current password is required': 'errorCurrentPasswordRequired',
  'check your current password': 'errorCurrentPasswordInvalid',
};

function extractResponseMessage(data: unknown): string | null {
  if (!data || typeof data !== 'object') {
    return null;
  }
  const message = (data as { message?: unknown }).message;
  if (typeof message === 'string' && message.trim().length > 0) {
    return message.trim();
  }
  if (Array.isArray(message) && message.length > 0) {
    const first = message.find(
      (item) => typeof item === 'string' && item.trim().length > 0,
    );
    if (typeof first === 'string') {
      return first.trim();
    }
  }
  return null;
}

/** Translation key for a recognized server/client message, or `null` when unknown. */
export function getErrorMessageKey(error: unknown): string | null {
  if (axios.isAxiosError(error)) {
    const serverMessage = extractResponseMessage(error.response?.data);
    if (serverMessage) {
      return SERVER_MESSAGE_TO_KEY[serverMessage.toLowerCase()] ?? null;
    }
  }
  if (error instanceof Error && error.message.trim().length > 0) {
    return SERVER_MESSAGE_TO_KEY[error.message.trim().toLowerCase()] ?? null;
  }
  return null;
}

export function getLocalizedErrorMessage(
  error: unknown,
  t: TFunction,
  fallbackKey = 'errorGeneric',
): string {
  const mappedKey = getErrorMessageKey(error);
  return mappedKey ? t(mappedKey) : t(fallbackKey);
}
