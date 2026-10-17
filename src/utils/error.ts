import axios from 'axios';
import type { TFunction } from 'i18next';

const SERVER_MESSAGE_TO_KEY: Record<string, string> = {
  'invalid credentials': 'errorInvalidCredentials',
  'confirm your email address before signing in': 'errorConfirmEmailFirst',
  'account is disabled or banned': 'errorAccountDisabledOrBanned',
  'username or email is already registered': 'errorUserAlreadyRegistered',
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

export function getLocalizedErrorMessage(
  error: unknown,
  t: TFunction,
  fallbackKey = 'errorGeneric',
): string {
  if (axios.isAxiosError(error)) {
    const serverMessage = extractResponseMessage(error.response?.data);
    if (serverMessage) {
      const normalized = serverMessage.toLowerCase();
      const mappedKey = SERVER_MESSAGE_TO_KEY[normalized];
      if (mappedKey) {
        return t(mappedKey);
      }
      if ((error.response?.status ?? 500) < 500) {
        return serverMessage;
      }
    }
  }
  if (error instanceof Error && error.message.trim().length > 0) {
    const normalized = error.message.trim().toLowerCase();
    const mappedKey = SERVER_MESSAGE_TO_KEY[normalized];
    if (mappedKey) {
      return t(mappedKey);
    }
  }
  return t(fallbackKey);
}
