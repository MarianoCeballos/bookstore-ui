import type { AdminStats } from '@/interfaces/models';

type StatsBook = AdminStats['books'][number];
type StatsPayment = AdminStats['payments'][number];

/** Sum of every recorded payment total, ignoring malformed decimal strings. */
export function sumRevenue(payments: StatsPayment[]): number {
  return payments.reduce((total, payment) => {
    const value = Number.parseFloat(payment.total);
    return total + (Number.isFinite(value) ? value : 0);
  }, 0);
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

/** Aggregates payments into an ascending, gap-free-by-day sales series. */
export function buildDailySales(payments: StatsPayment[]): DailySalesPoint[] {
  const byDay = new Map<string, DailySalesPoint>();

  for (const payment of payments) {
    const created = new Date(payment.createdAt);
    if (Number.isNaN(created.getTime())) continue;

    const key = toDateKey(created);
    const point = byDay.get(key) ?? { date: key, revenue: 0, orders: 0 };
    const value = Number.parseFloat(payment.total);
    point.revenue += Number.isFinite(value) ? value : 0;
    point.orders += 1;
    byDay.set(key, point);
  }

  return [...byDay.values()].sort((a, b) => a.date.localeCompare(b.date));
}
