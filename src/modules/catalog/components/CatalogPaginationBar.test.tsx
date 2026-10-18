import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CatalogPaginationBar } from '@/modules/catalog/components/CatalogPaginationBar';

const defaults = {
  currentPage: 1,
  totalPages: 3,
  pageSize: 12,
  rangeStart: 1,
  rangeEnd: 12,
  totalBooks: 25,
};

function renderBar(overrides: Partial<typeof defaults> = {}) {
  const onPageChange = jest.fn();
  const onPageSizeChange = jest.fn();
  render(
    <CatalogPaginationBar
      {...defaults}
      {...overrides}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
    />,
  );
  return { user: userEvent.setup(), onPageChange, onPageSizeChange };
}

describe('CatalogPaginationBar', () => {
  it.each([0, 1])('hides controls for %i books', (totalBooks) => {
    renderBar({ totalBooks });
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });

  it('keeps the page-size selector for results fitting on one page', () => {
    renderBar({ totalBooks: 2, totalPages: 1, rangeEnd: 2 });
    expect(screen.getByRole('combobox')).toHaveTextContent('12');
    expect(
      screen.getByRole('button', { name: 'Go to next page' }),
    ).toBeDisabled();
    expect(
      screen.queryByRole('button', { name: 'Go to page 2' }),
    ).not.toBeInTheDocument();
  });

  it('shows the final partial range and disables forward navigation', () => {
    renderBar({ currentPage: 3, rangeStart: 25, rangeEnd: 25 });
    expect(screen.getByText(/25.*25.*25/)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Go to next page' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Go to last page' }),
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: 'page 3' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('emits numeric page choices and prevents moving before the first page', async () => {
    const { user, onPageChange } = renderBar();
    expect(
      screen.getByRole('button', { name: 'Go to first page' }),
    ).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Go to previous page' }),
    ).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Go to page 2' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
    await user.click(screen.getByRole('button', { name: 'Go to last page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);
  });

  it('offers the supported sizes and emits a number without changing the page', async () => {
    const { user, onPageSizeChange, onPageChange } = renderBar();
    await user.click(screen.getByRole('combobox'));
    expect(
      screen.getAllByRole('option').map((option) => option.textContent),
    ).toEqual(['8', '12', '24', '48']);
    await user.click(screen.getByRole('option', { name: '24' }));
    expect(onPageSizeChange).toHaveBeenCalledWith(24);
    expect(onPageChange).not.toHaveBeenCalled();
  });
});
