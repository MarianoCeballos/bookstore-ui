import type { AdminStats } from '@/interfaces/models';

type StatsBook = AdminStats['books'][number];
type StatsPayment = AdminStats['payments'][number];

/**
 * Parses a monetary string, rejecting partial values such as `"19.90oops"`.
 * `Number.parseFloat` would silently accept them.
 */
function parseAmount(value: string): number {
  const trimmed = value.trim();
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(trimmed)) return 0;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Sum of every recorded payment total, ignoring malformed decimal strings. */
export function sumRevenue(payments: StatsPayment[]): number {
  return payments.reduce(
    (total, payment) => total + parseAmount(payment.total),
    0,
  );
}

/** Total copies sold across the catalog snapshot. */
export function sumUnitsSold(books: StatsBook[]): number {
  return books.reduce((total, book) => total + (book.soldCopies ?? 0), 0);
}

export interface DailySalesPoint {
  /** Calendar day in `YYYY-MM-DD`. */
  date: string;
  revenue: number;
  orders: number;
}

function toDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Inverse of `toDateKey`: rebuilds the day in local time (not UTC). */
function fromDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Aggregates payments into an ascending daily sales series, filling days
 * without sales with zero-revenue points so the chart keeps a continuous axis.
 */
export function buildDailySales(payments: StatsPayment[]): DailySalesPoint[] {
  const byDay = new Map<string, DailySalesPoint>();

  for (const payment of payments) {
    const created = new Date(payment.createdAt);
    if (Number.isNaN(created.getTime())) continue;

    const key = toDateKey(created);
    const point = byDay.get(key) ?? { date: key, revenue: 0, orders: 0 };
    point.revenue += parseAmount(payment.total);
    point.orders += 1;
    byDay.set(key, point);
  }

  const keys = [...byDay.keys()].sort((a, b) => a.localeCompare(b));
  if (keys.length === 0) return [];

  const series: DailySalesPoint[] = [];
  const cursor = fromDateKey(keys[0]);
  const last = fromDateKey(keys[keys.length - 1]);
  while (cursor <= last) {
    const key = toDateKey(cursor);
    series.push(byDay.get(key) ?? { date: key, revenue: 0, orders: 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  return series;
}
