import i18n from '@/i18n';
import {
  createLoginSchema,
  createRegisterSchema,
} from '@/modules/auth/schemas/auth.schema';

const t = i18n.getFixedT('en');
const registration = {
  username: 'reader',
  name: 'Jane',
  surname: 'Doe',
  email: 'reader@example.com',
  password: 'long-password',
};

describe('authentication schemas', () => {
  it('trims the login identifier while preserving password whitespace', async () => {
    expect(
      await createLoginSchema(t).validate({
        username: ' reader ',
        password: ' secret ',
      }),
    ).toEqual({ username: 'reader', password: ' secret ' });
  });

  it.each([
    { username: '   ', password: 'secret' },
    { username: 'reader', password: '' },
  ])('rejects missing login credentials %p', async (input) => {
    await expect(createLoginSchema(t).validate(input)).rejects.toThrow(
      t('validationRequired'),
    );
  });

  it('trims registration identity fields without changing the password', async () => {
    expect(
      await createRegisterSchema(t).validate({
        ...registration,
        username: ' reader ',
        name: ' Jane ',
        surname: ' Doe ',
        email: ' reader@example.com ',
      }),
    ).toEqual(registration);
  });

  it.each(['username', 'name', 'surname', 'email', 'password'] as const)(
    'requires registration %s',
    async (field) => {
      expect(
        await createRegisterSchema(t).isValid({ ...registration, [field]: '' }),
      ).toBe(false);
    },
  );

  it.each([
    ['username', 2],
    ['username', 41],
    ['name', 101],
    ['surname', 101],
    ['password', 11],
    ['password', 129],
  ] as const)('rejects %s with length %i', async (field, length) => {
    expect(
      await createRegisterSchema(t).isValid({
        ...registration,
        [field]: 'a'.repeat(length),
      }),
    ).toBe(false);
  });

  it('accepts registration length boundaries and rejects malformed emails', async () => {
    expect(
      await createRegisterSchema(t).isValid({
        ...registration,
        username: 'abc',
        password: 'a'.repeat(12),
      }),
    ).toBe(true);
    expect(
      await createRegisterSchema(t).isValid({
        ...registration,
        username: 'a'.repeat(40),
        name: 'a'.repeat(100),
        surname: 'a'.repeat(100),
        password: 'a'.repeat(128),
      }),
    ).toBe(true);
    await expect(
      createRegisterSchema(t).validate({ ...registration, email: 'invalid' }),
    ).rejects.toThrow(t('validationEmail'));
  });
});
