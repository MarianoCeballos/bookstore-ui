import { act, renderHook } from '@testing-library/react';
import { toast } from 'sonner';
import i18n from '@/i18n';
import { useCartCheckout } from '@/modules/account/hooks/useCartCheckout';
import { paymentsService } from '@/modules/payments/services/payments.service';

jest.mock('@/modules/payments/services/payments.service', () => ({
  paymentsService: { checkout: jest.fn() },
}));
jest.mock('sonner', () => ({
  toast: { warning: jest.fn(), error: jest.fn() },
}));
const checkout = jest.mocked(paymentsService.checkout);
const t = i18n.getFixedT('en');

describe('useCartCheckout', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('requires a recipient for gifts and avoids calling checkout', async () => {
    const { result } = renderHook(useCartCheckout);
    act(() => {
      result.current.toggleGift(true);
      result.current.updateRecipient('   ');
    });
    await act(() => result.current.checkout());
    expect(checkout).not.toHaveBeenCalled();
    expect(result.current.recipientError).toBe(
      t('validationGiftRecipientRequired'),
    );
    expect(toast.warning).toHaveBeenCalledWith(
      t('validationGiftRecipientRequired'),
    );
    expect(result.current.isCheckingOut).toBe(false);
  });

  it('clears recipient feedback on editing or turning gifting off', async () => {
    const { result } = renderHook(useCartCheckout);
    act(() => result.current.toggleGift(true));
    await act(() => result.current.checkout());
    act(() => result.current.updateRecipient('reader'));
    expect(result.current.recipientError).toBe('');
    act(() => result.current.updateRecipient(''));
    await act(() => result.current.checkout());
    act(() => result.current.toggleGift(false));
    expect(result.current.recipientError).toBe('');
    expect(result.current.gift).toBe(false);
  });

  it.each([true, false])(
    'submits the correct recipient for gift=%p and reports checkout failure',
    async (gift) => {
      checkout.mockRejectedValueOnce(new Error('Your cart is empty'));
      const { result } = renderHook(useCartCheckout);
      act(() => {
        result.current.toggleGift(gift);
        result.current.updateRecipient('  reader  ');
      });
      await act(() => result.current.checkout());
      expect(checkout).toHaveBeenCalledWith(gift, gift ? 'reader' : undefined);
      expect(result.current.error).toBe(t('errorCartEmpty'));
      expect(result.current.isCheckingOut).toBe(false);
      expect(toast.error).toHaveBeenCalledWith(t('errorCartEmpty'));
    },
  );

  it('clears old errors while a retry is pending and releases busy state on rejection', async () => {
    checkout.mockRejectedValueOnce(new Error('Your cart is empty'));
    const { result } = renderHook(useCartCheckout);
    await act(() => result.current.checkout());
    let rejectCheckout!: (error: Error) => void;
    checkout.mockReturnValueOnce(
      new Promise((_, reject) => {
        rejectCheckout = reject;
      }),
    );
    let pending!: Promise<void>;
    act(() => {
      pending = result.current.checkout();
    });
    expect(result.current.error).toBe('');
    expect(result.current.isCheckingOut).toBe(true);
    await act(async () => {
      rejectCheckout(new Error('Unexpected failure'));
      await pending;
    });
    expect(result.current.error).toBe(t('errorGeneric'));
    expect(result.current.isCheckingOut).toBe(false);
  });
});
