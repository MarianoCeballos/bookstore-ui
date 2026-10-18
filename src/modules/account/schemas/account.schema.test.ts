import i18n from '@/i18n';
import {
  createPasswordSchema,
  createProfileSchema,
} from '@/modules/account/schemas/account.schema';

const profile = {
  username: 'reader',
  name: 'Jane',
  surname: 'Doe',
  email: 'reader@example.com',
};
const passwords = {
  password: 'current-secret',
  newPassword: 'new-password',
  confirmPassword: 'new-password',
};
const t = i18n.getFixedT('en');

describe('account schemas', () => {
  it('trims profile fields before accepting them', async () => {
    expect(
      await createProfileSchema(t).validate({
        username: ' reader ',
        name: ' Jane ',
        surname: ' Doe ',
        email: ' reader@example.com ',
      }),
    ).toEqual(profile);
  });

  it.each(['username', 'name', 'surname', 'email'] as const)(
    'rejects a blank %s',
    async (field) => {
      await expect(
        createProfileSchema(t).validate({ ...profile, [field]: '   ' }),
      ).rejects.toThrow(t('validationRequired'));
    },
  );

  it.each([
    ['username', 3, 40],
    ['name', 1, 100],
    ['surname', 1, 100],
  ] as const)('enforces the %s length boundaries', async (field, min, max) => {
    const schema = createProfileSchema(t);
    expect(await schema.isValid({ ...profile, [field]: 'a'.repeat(min) })).toBe(
      true,
    );
    expect(await schema.isValid({ ...profile, [field]: 'a'.repeat(max) })).toBe(
      true,
    );
    expect(
      await schema.isValid({ ...profile, [field]: 'a'.repeat(max + 1) }),
    ).toBe(false);
    expect(
      await schema.isValid({ ...profile, [field]: 'a'.repeat(min - 1) }),
    ).toBe(false);
  });

  it('rejects a malformed email with localized feedback', async () => {
    await expect(
      createProfileSchema(t).validate({ ...profile, email: 'not-an-email' }),
    ).rejects.toThrow(t('validationEmail'));
  });

  it('accepts new passwords at the minimum and maximum lengths', async () => {
    for (const length of [12, 128]) {
      expect(
        await createPasswordSchema(t).isValid({
          ...passwords,
          newPassword: 'a'.repeat(length),
          confirmPassword: 'a'.repeat(length),
        }),
      ).toBe(true);
    }
  });

  it.each([11, 129])(
    'rejects a new password of %i characters',
    async (length) => {
      expect(
        await createPasswordSchema(t).isValid({
          ...passwords,
          newPassword: 'a'.repeat(length),
          confirmPassword: 'a'.repeat(length),
        }),
      ).toBe(false);
    },
  );

  it('requires the current password and a matching confirmation', async () => {
    await expect(
      createPasswordSchema(t).validate({ ...passwords, password: '' }),
    ).rejects.toThrow(t('validationRequired'));
    await expect(
      createPasswordSchema(t).validate({
        ...passwords,
        confirmPassword: 'different-password',
      }),
    ).rejects.toThrow(t('validationPasswordsMatch'));
  });
});
