const currencyFormatters = new Map<string, Intl.NumberFormat>();

export function formatCurrency(
  value: string | number | null | undefined,
  locale = 'en',
): string {
  const numericValue = Number(value ?? 0);
  const safeAmount = Number.isFinite(numericValue) ? numericValue : 0;
  const resolvedLocale = locale.startsWith('es') ? 'es-AR' : 'en-US';
  let formatter = currencyFormatters.get(resolvedLocale);
  if (!formatter) {
    formatter = new Intl.NumberFormat(resolvedLocale, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    currencyFormatters.set(resolvedLocale, formatter);
  }
  return formatter.format(safeAmount);
}

const numberFormatters = new Map<string, Intl.NumberFormat>();

export function formatNumber(
  value: number | string | null | undefined,
  locale = 'en',
): string {
  const numericValue = Number(value ?? 0);
  const safeAmount = Number.isFinite(numericValue) ? numericValue : 0;
  const resolvedLocale = locale.startsWith('es') ? 'es-AR' : 'en-US';
  let formatter = numberFormatters.get(resolvedLocale);
  if (!formatter) {
    formatter = new Intl.NumberFormat(resolvedLocale, {
      maximumFractionDigits: 2,
    });
    numberFormatters.set(resolvedLocale, formatter);
  }
  return formatter.format(safeAmount);
}

export function formatDate(
  value: string | Date | null | undefined,
  locale = 'en',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  },
): string {
  if (!value) {
    return '—';
  }
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }
  const resolvedLocale = locale.startsWith('es') ? 'es-ES' : 'en-US';
  return new Intl.DateTimeFormat(resolvedLocale, options).format(parsed);
}

/** Takes the first `count` Unicode code points so astral characters stay whole. */
const firstCodePoints = (value: string, count = 1): string =>
  Array.from(value).slice(0, count).join('');

export function getUserInitials(
  user?: {
    name?: string;
    surname?: string;
    username?: string;
  } | null,
): string {
  const fullParts = [user?.name?.trim(), user?.surname?.trim()].filter(
    Boolean,
  ) as string[];
  if (fullParts.length > 0) {
    return fullParts
      .map((part) => firstCodePoints(part))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }
  const username = user?.username?.trim() ?? '';
  if (username.length > 0) {
    return firstCodePoints(username, 2).toUpperCase();
  }
  return '?';
}
