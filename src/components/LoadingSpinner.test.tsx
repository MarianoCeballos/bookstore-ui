import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PageLoader } from '@/components/PageLoader';
import { TableLoader } from '@/components/TableLoader';

describe('LoadingSpinner', () => {
  it('exposes an indeterminate progressbar named after its label', () => {
    render(<LoadingSpinner label="Fetching books…" />);

    expect(
      screen.getByRole('progressbar', { name: 'Fetching books…' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Fetching books…')).toBeVisible();
  });

  it('falls back to the generic localized caption when no label is given', () => {
    render(<LoadingSpinner />);

    expect(
      screen.getByRole('progressbar', { name: 'Loading…' }),
    ).toBeInTheDocument();
  });
});

describe('PageLoader', () => {
  it('reserves space and announces itself as busy', () => {
    const { container } = render(<PageLoader label="Loading your cart…" />);

    const region = container.firstElementChild as HTMLElement;
    expect(region).toHaveAttribute('aria-busy', 'true');
    expect(
      screen.getByRole('progressbar', { name: 'Loading your cart…' }),
    ).toBeInTheDocument();
  });
});

describe('TableLoader', () => {
  it('renders an overlay spinner with the table-specific caption', () => {
    render(<TableLoader />);

    expect(
      screen.getByRole('progressbar', { name: 'Loading data…' }),
    ).toBeInTheDocument();
  });
});
