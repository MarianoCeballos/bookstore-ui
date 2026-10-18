import i18n from '@/i18n';
import { createReviewSchema } from '@/modules/catalog/schemas/review.schema';

const t = i18n.getFixedT('en');
const review = {
  title: 'Great read',
  review: 'A thoughtful story.',
  rating: 4,
};

describe('review schema', () => {
  it('trims review text and accepts the maximum text lengths', async () => {
    const schema = createReviewSchema(t);
    expect(
      await schema.validate({
        ...review,
        title: ' Great read ',
        review: ' A thoughtful story. ',
      }),
    ).toEqual(review);
    expect(
      await schema.isValid({
        title: 'a'.repeat(20),
        review: 'a'.repeat(255),
        rating: 5,
      }),
    ).toBe(true);
  });

  it.each([
    ['title', ' '],
    ['title', 'a'.repeat(21)],
    ['review', ' '],
    ['review', 'a'.repeat(256)],
  ])('rejects invalid %s text', async (field, value) => {
    expect(
      await createReviewSchema(t).isValid({ ...review, [field]: value }),
    ).toBe(false);
  });

  it.each([0, 6, null, undefined])('rejects rating %p', async (rating) => {
    await expect(
      createReviewSchema(t).validate({ ...review, rating }),
    ).rejects.toThrow(t('validationRatingRange'));
  });

  it.each([1, 5])('accepts rating boundary %i', async (rating) => {
    expect(await createReviewSchema(t).isValid({ ...review, rating })).toBe(
      true,
    );
  });
});
