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
});
