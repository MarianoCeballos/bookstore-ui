import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConfirmDialog } from '@/components/ConfirmDialog';

describe('ConfirmDialog', () => {
  const props = {
    title: 'Remove review?',
    description: 'This review will be removed.',
    onConfirm: jest.fn(),
    onClose: jest.fn(),
  };
  beforeEach(() => jest.clearAllMocks());

  it('is absent when closed', () => {
    render(<ConfirmDialog {...props} open={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('labels its dialog and confirms only when requested', async () => {
    const user = userEvent.setup();
    render(<ConfirmDialog {...props} open confirmLabel="Remove" />);
    expect(
      screen.getByRole('dialog', { name: props.title }),
    ).toHaveAccessibleDescription(props.description);
    expect(props.onConfirm).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Remove' }));
    expect(props.onConfirm).toHaveBeenCalledTimes(1);
    expect(props.onClose).not.toHaveBeenCalled();
  });

  it('cancels and dismisses on Escape without confirming', async () => {
    const user = userEvent.setup();
    render(<ConfirmDialog {...props} open cancelLabel="Keep review" />);
    await user.click(screen.getByRole('button', { name: 'Keep review' }));
    expect(props.onClose).toHaveBeenCalledTimes(1);
    await user.keyboard('{Escape}');
    expect(props.onClose).toHaveBeenCalledTimes(2);
    expect(props.onConfirm).not.toHaveBeenCalled();
  });

  it('disables actions and prevents Escape while loading', async () => {
    const user = userEvent.setup();
    render(<ConfirmDialog {...props} open isLoading />);
    const confirm = screen.getByRole('button', { name: 'Confirm' });
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    expect(confirm).toBeDisabled();
    expect(cancel).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(props.onConfirm).not.toHaveBeenCalled();
    expect(props.onClose).not.toHaveBeenCalled();
  });
});
