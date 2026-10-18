import { AxiosError, type AxiosResponse } from 'axios';
import i18n from '@/i18n';
import { getLocalizedErrorMessage } from '@/utils/error';

const t = i18n.getFixedT('en');
const responseError = (data: unknown, status = 400) =>
  new AxiosError('Request failed', 'ERR_BAD_RESPONSE', undefined, undefined, {
    data,
    status,
  } as AxiosResponse);

describe('getLocalizedErrorMessage', () => {
  it.each([
    ['invalid credentials', 'errorInvalidCredentials'],
    ['confirm your email address before signing in', 'errorConfirmEmailFirst'],
    ['account is disabled or banned', 'errorAccountDisabledOrBanned'],
    ['username or email is already registered', 'errorUserAlreadyRegistered'],
    ['email or username is already registered', 'errorUserAlreadyRegistered'],
    ['email is already registered', 'errorUserAlreadyRegistered'],
    ['username is already registered', 'errorUserAlreadyRegistered'],
    [
      'confirmation link is invalid or expired',
      'errorConfirmationInvalidOrExpired',
    ],
    ['user not found', 'errorUserNotFound'],
    ['reset code is invalid or expired', 'errorResetCodeInvalidOrExpired'],
    ['your cart is empty', 'errorCartEmpty'],
    ['book not found', 'errorBookNotFound'],
    ['review not found', 'errorReviewNotFound'],
    ['you have already reviewed this book', 'errorAlreadyReviewedBook'],
    ['you can only modify your own reviews', 'errorReviewNotOwned'],
    ['order not found', 'errorOrderNotFound'],
    ['book title already exists', 'errorBookTitleExists'],
    ['profile picture file is required', 'errorProfilePicRequired'],
    ['profile picture must be 2 mb or smaller', 'errorProfilePicSize'],
    [
      'profile picture must be a valid jpeg, png, webp, or gif image',
      'errorProfilePicFormat',
    ],
    ['current password is required', 'errorCurrentPasswordRequired'],
    ['check your current password', 'errorCurrentPasswordInvalid'],
  ])('localizes the server message %s', (message, key) => {
    expect(
      getLocalizedErrorMessage(
        responseError({ message: `  ${message.toUpperCase()}  ` }),
        t,
      ),
    ).toBe(t(key));
  });

  it('uses the first nonblank string in a validation message array', () => {
    expect(
      getLocalizedErrorMessage(
        responseError({
          message: [
            null,
            12,
            '',
            '  ',
            '  Invalid credentials ',
            'Book not found',
          ],
        }),
        t,
      ),
    ).toBe(t('errorInvalidCredentials'));
  });

  it('localizes unknown client and server errors instead of exposing the raw text', () => {
    expect(
      getLocalizedErrorMessage(
        responseError({ message: '  Custom validation failure  ' }, 422),
        t,
      ),
    ).toBe(t('errorGeneric'));
    expect(
      getLocalizedErrorMessage(
        responseError({ message: 'Internal database detail' }, 500),
        t,
      ),
    ).toBe(t('errorGeneric'));
  });

  it('localizes a known message even on a server error', () => {
    expect(
      getLocalizedErrorMessage(
        responseError({ message: 'Book not found' }, 500),
        t,
      ),
    ).toBe(t('errorBookNotFound'));
  });

  it.each([
    null,
    undefined,
    'failure',
    1,
    {},
    { message: '' },
    { message: [null, ' '] },
  ])('uses the requested fallback for malformed response data %p', (data) => {
    expect(
      getLocalizedErrorMessage(
        responseError(data),
        t,
        'errorResetCodeInvalidOrExpired',
      ),
    ).toBe(t('errorResetCodeInvalidOrExpired'));
  });

  it('handles network errors and arbitrary thrown values without exposing internals', () => {
    for (const error of [
      new AxiosError('Network Error'),
      new Error('Internal detail'),
      null,
      undefined,
      'Book not found',
      { message: 'Book not found' },
    ]) {
      expect(getLocalizedErrorMessage(error, t)).toBe(t('errorGeneric'));
    }
    expect(getLocalizedErrorMessage(new Error('  BOOK NOT FOUND  '), t)).toBe(
      t('errorBookNotFound'),
    );
  });

  it('uses the supplied language for mapped messages', () => {
    expect(
      getLocalizedErrorMessage(
        new Error('Invalid credentials'),
        i18n.getFixedT('es'),
      ),
    ).toBe(i18n.getFixedT('es')('errorInvalidCredentials'));
  });
});
