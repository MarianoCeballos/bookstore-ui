import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { buildCheckoutRedirectUrl } from '@/modules/payments/constants';
import { paymentsService } from '@/modules/payments/services/payments.service';
import { getLocalizedErrorMessage } from '@/utils/error';

/**
 * Encapsulates the gift-recipient state, validation and checkout redirect that
 * previously lived inline in `CartPage`.
 */
export function useCartCheckout() {
  const { t } = useTranslation();

  const [gift, setGift] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [recipientError, setRecipientError] = useState('');
  const [error, setError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const toggleGift = (checked: boolean) => {
    setGift(checked);
    if (!checked) {
      setRecipientError('');
    }
  };

  const updateRecipient = (value: string) => {
    setRecipient(value);
    if (recipientError) setRecipientError('');
  };

  const checkout = async () => {
    setError('');
    setRecipientError('');

    const trimmedRecipient = recipient.trim();
    if (gift && !trimmedRecipient) {
      const validationMessage = t('validationGiftRecipientRequired');
      setRecipientError(validationMessage);
      toast.warning(validationMessage);
      return;
    }

    setIsCheckingOut(true);
    try {
      const result = await paymentsService.checkout(
        gift,
        gift ? trimmedRecipient : undefined,
      );
      window.location.assign(buildCheckoutRedirectUrl(result.preferenceId));
    } catch (err) {
      const message = getLocalizedErrorMessage(err, t);
      setError(message);
      toast.error(message);
      setIsCheckingOut(false);
    }
  };

  return {
    gift,
    recipient,
    recipientError,
    error,
    isCheckingOut,
    toggleGift,
    updateRecipient,
    checkout,
  };
}
