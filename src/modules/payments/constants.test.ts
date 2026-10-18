import { buildCheckoutRedirectUrl } from '@/modules/payments/constants';

describe('buildCheckoutRedirectUrl', () => {
  it.each([
    'preference-123',
    'id with spaces',
    'id&other=value#fragment',
    'á/=?+',
  ])(
    'preserves preference ID %p as a single encoded parameter',
    (preferenceId) => {
      const url = new URL(buildCheckoutRedirectUrl(preferenceId));
      expect(url.origin).toBe('https://www.mercadopago.com');
      expect(url.pathname).toBe('/checkout/v1/redirect');
      expect([...url.searchParams.entries()]).toEqual([
        ['pref_id', preferenceId],
      ]);
      expect(url.hash).toBe('');
    },
  );
});
