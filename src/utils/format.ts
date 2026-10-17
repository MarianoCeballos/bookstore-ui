const currencyFormatters = new Map<string, Intl.NumberFormat>();

export function formatCurrency(
  value: string | number | null | undefined,
  locale = 'en',
): string {
  const numericValue =
    typeof value === 'string' ? Number.parseFloat(value) : Number(value ?? 0);
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
      .map((part) => part[0] ?? '')
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
  const username = user?.username?.trim() ?? '';
  if (username.length > 0) {
    return username.slice(0, 2).toUpperCase();
  }
  return '?';
}
