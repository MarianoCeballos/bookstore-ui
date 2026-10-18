import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '@/i18n';
import { BookReviewForm } from '@/modules/catalog/components/BookReviewForm';

const t = i18n.getFixedT('en');
describe('BookReviewForm', () => {
  it('validates required fields without submitting an empty review', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<BookReviewForm onSubmit={onSubmit} />);
    await user.click(screen.getByRole('button', { name: t('publishReview') }));
    expect(await screen.findAllByText(t('validationRequired'))).toHaveLength(2);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits trimmed text and the selected rating, then clears a new review', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<BookReviewForm onSubmit={onSubmit} />);
    await user.type(
      screen.getByRole('textbox', { name: t('reviewTitle') }),
      ' Great read ',
    );
    await user.type(
      screen.getByRole('textbox', { name: t('review') }),
      ' A thoughtful story. ',
    );
    // jsdom has no layout for MUI's pointer-position rating calculation.
    fireEvent.click(screen.getByRole('radio', { name: '3 Stars' }));
    expect(screen.getByRole('radio', { name: '3 Stars' })).toBeChecked();
    await user.click(screen.getByRole('button', { name: t('publishReview') }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        title: 'Great read',
        review: 'A thoughtful story.',
        rating: 3,
      }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole('textbox', { name: t('reviewTitle') }),
      ).toHaveValue(''),
    );
    expect(screen.getByRole('textbox', { name: t('review') })).toHaveValue('');
    expect(screen.getByRole('radio', { name: '5 Stars' })).toBeChecked();
  });

  it('keeps an edited review populated after saving and supports cancel', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const onCancel = jest.fn();
    const values = {
      title: 'Original title',
      review: 'Original text',
      rating: 2,
    };
    render(
      <BookReviewForm
        isEditing
        initialValues={values}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />,
    );
    await user.click(screen.getByRole('button', { name: t('updateReview') }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(values));
    expect(screen.getByRole('textbox', { name: t('reviewTitle') })).toHaveValue(
      values.title,
    );
    expect(screen.getByRole('radio', { name: '2 Stars' })).toBeChecked();
    await user.click(screen.getByRole('button', { name: t('cancelEdit') }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('disables editing and submission until the pending save completes', async () => {
    const user = userEvent.setup();
    let resolveSave!: () => void;
    const onSubmit = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSave = resolve;
        }),
    );
    render(
      <BookReviewForm
        initialValues={{
          title: 'Great read',
          review: 'A thoughtful story.',
          rating: 4,
        }}
        onSubmit={onSubmit}
      />,
    );
    await user.click(screen.getByRole('button', { name: t('publishReview') }));
    const pendingButton = await screen.findByRole('button', {
      name: t('publishingReview'),
    });
    expect(pendingButton).toBeDisabled();
    expect(
      screen.getByRole('textbox', { name: t('reviewTitle') }),
    ).toBeDisabled();
    expect(onSubmit).toHaveBeenCalledTimes(1);
    resolveSave();
    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: t('publishReview') }),
      ).toBeEnabled(),
    );
  });
});
