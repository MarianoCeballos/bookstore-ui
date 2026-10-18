import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';
import i18n from '@/i18n';
import type { Order } from '@/interfaces/models';
import PaymentResultPage from '@/modules/payments/screens/PaymentResultPage';
import { paymentsService } from '@/modules/payments/services/payments.service';

jest.mock('@/modules/payments/services/payments.service', () => ({
  paymentsService: { verify: jest.fn() },
}));
jest.mock('sonner', () => ({
  toast: { success: jest.fn(), info: jest.fn(), warning: jest.fn() },
}));

const verify = jest.mocked(paymentsService.verify);
const t = i18n.getFixedT('en');
const order: Order = {
  ID: 1,
  mpID: 'payment-1',
  items: [],
  total: '10.00',
  gift: false,
  status: 'approved',
  user: { ID: 7, username: 'reader', email: 'reader@example.com' },
  createdAt: '2026-01-01T00:00:00Z',
};
function renderPage(query = '') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  const invalidate = jest.spyOn(queryClient, 'invalidateQueries');
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/payment-result${query}`]}>
        <PaymentResultPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
  return { invalidate };
}

describe('PaymentResultPage', () => {
  beforeEach(() => jest.resetAllMocks());

  it('shows pending feedback without trusting an approved URL when no payment ID exists', () => {
    renderPage('?status=approved');
    expect(screen.getByRole('alert')).toHaveTextContent(t('paymentPending'));
    expect(verify).not.toHaveBeenCalled();
    expect(
      screen.getByRole('link', { name: t('viewHistory') }),
    ).toHaveAttribute('href', '/history');
    expect(screen.getByRole('link', { name: t('browse') })).toHaveAttribute(
      'href',
      '/books',
    );
  });

  it('shows a declined payment without contacting verification when the ID is absent', () => {
    renderPage('?status=failure');
    expect(screen.getByRole('alert')).toHaveTextContent(t('paymentDeclined'));
    expect(verify).not.toHaveBeenCalled();
  });

  it('waits for verification, then refreshes cart and orders and shows approved feedback', async () => {
    let resolveOrder!: (value: Order) => void;
    verify.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveOrder = resolve;
      }),
    );
    const { invalidate } = renderPage('?payment_id=payment-1&status=failure');
    expect(screen.getByText(t('paymentVerifying'))).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText(t('viewHistory')).closest('a')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(verify).toHaveBeenCalledWith('payment-1');
    resolveOrder(order);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      t('paymentApproved'),
    );
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['cart'] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['orders'] });
    expect(
      screen.getByRole('link', { name: t('viewHistory') }),
    ).not.toHaveAttribute('aria-disabled', 'true');
    expect(toast.success).toHaveBeenCalledWith(t('paymentUpdate'), {
      description: t('paymentApproved'),
    });
  });

  it('supports collection_id and keeps pending orders pending despite an approved URL status', async () => {
    verify.mockResolvedValueOnce({ ...order, status: 'pending' });
    renderPage('?collection_id=legacy-1&status=approved');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      t('paymentPending'),
    );
    expect(verify).toHaveBeenCalledWith('legacy-1');
    expect(toast.info).toHaveBeenCalledWith(t('paymentUpdate'), {
      description: t('paymentPending'),
    });
  });

  it('prefers payment_id over collection_id when both are provided', async () => {
    verify.mockResolvedValueOnce(order);
    renderPage('?payment_id=current&collection_id=legacy');
    await screen.findByRole('alert');
    expect(verify).toHaveBeenCalledTimes(1);
    expect(verify).toHaveBeenCalledWith('current');
  });

  it('shows a verification error without invalidating cached data or claiming success', async () => {
    verify.mockRejectedValueOnce(new Error('Network failure'));
    const { invalidate } = renderPage('?payment_id=payment-1&status=approved');
    expect(await screen.findByRole('alert')).toHaveTextContent(
      t('paymentVerifyError'),
    );
    await waitFor(() =>
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument(),
    );
    expect(invalidate).not.toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.warning).toHaveBeenCalledWith(t('paymentUpdate'), {
      description: t('paymentVerifyError'),
    });
  });
});
