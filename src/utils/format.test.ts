import {
  formatCurrency,
  formatDate,
  formatNumber,
  getUserInitials,
} from '@/utils/format';

describe('format utilities', () => {
  it('formats currency values safely for English and Spanish locales', () => {
    expect(formatCurrency('19.9', 'en')).toContain('19.90');
    expect(formatCurrency(0, 'en')).toContain('0.00');
    expect(formatCurrency('invalid', 'en')).toContain('0.00');
  });

  it('formats dates and handles empty or invalid dates gracefully', () => {
    expect(formatDate(null, 'en')).toBe('—');
    expect(formatDate('2025-03-15T12:00:00.000Z', 'en')).toContain('2025');
    expect(formatDate('not-a-date', 'en')).toBe('not-a-date');
  });

  it('formats counts with locale-aware grouping and safe fallbacks', () => {
    expect(formatNumber(1234, 'en')).toBe('1,234');
    expect(formatNumber('invalid', 'en')).toBe('0');
    expect(formatNumber(null, 'en')).toBe('0');
  });

  it('derives initials from name, surname, or username', () => {
    expect(
      getUserInitials({ name: 'Jane', surname: 'Doe', username: 'jdoe' }),
    ).toBe('JD');
    expect(
      getUserInitials({ name: 'Alex', surname: '', username: 'alex' }),
    ).toBe('A');
    expect(getUserInitials({ username: 'reader' })).toBe('RE');
    expect(getUserInitials(null)).toBe('?');
  });

  it('uses Spanish locale grouping and decimal separators for regional locales', () => {
    expect(formatCurrency('1234.5', 'es-AR')).toContain('1.234,50');
    expect(formatNumber(1234.567, 'es-MX')).toBe('1.234,57');
    expect(formatNumber(1234.567, 'en-GB')).toBe('1,234.57');
  });

  it.each([undefined, null, NaN, Infinity, -Infinity, 'invalid'])(
    'formats nonfinite and missing amounts %p as zero',
    (value) => {
      expect(formatCurrency(value)).toBe('$0.00');
      expect(formatNumber(value)).toBe('0');
    },
  );

  it('formats negative amounts without losing the sign', () => {
    expect(formatCurrency(-12.5)).toBe('-$12.50');
    expect(formatNumber('-1234.5')).toBe('-1,234.5');
  });

  it('supports explicit date options and Date objects without local timezone assumptions', () => {
    const date = new Date('2026-01-01T23:30:00Z');
    expect(
      formatDate(date, 'en', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'UTC',
      }),
    ).toBe('01/01/2026');
    expect(
      formatDate(date, 'es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'UTC',
      }),
    ).toBe('01/01/2026');
  });

  it('trims names before deriving initials and falls back for whitespace-only identities', () => {
    expect(
      getUserInitials({ name: ' Jane ', surname: ' Doe ', username: 'other' }),
    ).toBe('JD');
    expect(getUserInitials({ name: ' ', surname: ' ', username: ' a ' })).toBe(
      'A',
    );
    expect(getUserInitials({ name: ' ', surname: '', username: ' ' })).toBe(
      '?',
    );
    expect(getUserInitials()).toBe('?');
  });

  it('derives initials without splitting astral characters', () => {
    expect(getUserInitials({ name: '😀 Ada', surname: 'Lovelace' })).toBe(
      '😀L',
    );
    expect(getUserInitials({ username: '😀reader' })).toBe('😀R');
  });
});
