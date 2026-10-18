export const MERCADOPAGO_CHECKOUT_REDIRECT =
  'https://www.mercadopago.com/checkout/v1/redirect';

export function buildCheckoutRedirectUrl(preferenceId: string): string {
  return `${MERCADOPAGO_CHECKOUT_REDIRECT}?pref_id=${encodeURIComponent(
    preferenceId,
  )}`;
}
