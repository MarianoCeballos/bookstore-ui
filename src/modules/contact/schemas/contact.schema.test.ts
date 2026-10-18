import i18n from '@/i18n';
import { createContactSchema } from '@/modules/contact/schemas/contact.schema';

const t = i18n.getFixedT('en');
const contact = {
  sender: 'reader@example.com',
  title: 'Question',
  message: 'A book question.',
};

describe('contact schema', () => {
  it('trims every field and accepts message length boundaries', async () => {
    const schema = createContactSchema(t);
    expect(
      await schema.validate({
        sender: ' reader@example.com ',
        title: ' Question ',
        message: ' A book question. ',
      }),
    ).toEqual(contact);
    for (const length of [10, 4000]) {
      expect(
        await schema.isValid({
          ...contact,
          title: 'a'.repeat(120),
          message: 'a'.repeat(length),
        }),
      ).toBe(true);
    }
  });

  it.each(['sender', 'title', 'message'] as const)(
    'rejects whitespace-only %s',
    async (field) => {
      await expect(
        createContactSchema(t).validate({ ...contact, [field]: '   ' }),
      ).rejects.toThrow();
    },
  );

  it.each([
    ['title', 121],
    ['message', 9],
    ['message', 4001],
  ] as const)('rejects %s of length %i', async (field, length) => {
    expect(
      await createContactSchema(t).isValid({
        ...contact,
        [field]: 'a'.repeat(length),
      }),
    ).toBe(false);
  });

  it('rejects a malformed sender email with localized feedback', async () => {
    await expect(
      createContactSchema(t).validate({ ...contact, sender: 'invalid' }),
    ).rejects.toThrow(t('validationEmail'));
  });
});
