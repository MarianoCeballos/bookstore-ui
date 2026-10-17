import {
  buildDailySales,
  sumRevenue,
  sumUnitsSold,
} from '@/modules/admin/utils/stats';

describe('admin stats utilities', () => {
  it('sums revenue from decimal strings and ignores malformed totals', () => {
    expect(
      sumRevenue([
        { items: 1, createdAt: '2026-01-01T00:00:00.000Z', total: '19.90' },
        { items: 2, createdAt: '2026-01-02T00:00:00.000Z', total: '0.10' },
        { items: 1, createdAt: '2026-01-03T00:00:00.000Z', total: 'invalid' },
      ]),
    ).toBeCloseTo(20);
  });

  it('sums units sold across the catalog snapshot', () => {
    expect(
      sumUnitsSold([
        { ID: 1, title: 'A', soldCopies: 3 },
        { ID: 2, title: 'B', soldCopies: 2 },
      ]),
    ).toBe(5);
  });

  it('aggregates payments into an ascending per-day series', () => {
    const series = buildDailySales([
      { items: 1, createdAt: '2026-02-02T10:00:00.000Z', total: '10.00' },
      { items: 1, createdAt: '2026-02-01T09:00:00.000Z', total: '5.00' },
      { items: 2, createdAt: '2026-02-01T18:00:00.000Z', total: '7.50' },
      { items: 1, createdAt: 'not-a-date', total: '99.00' },
    ]);

    expect(series).toEqual([
      { date: '2026-02-01', revenue: 12.5, orders: 2 },
      { date: '2026-02-02', revenue: 10, orders: 1 },
    ]);
  });
});
