import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import { Box, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AdminStats } from '@/interfaces/models';
import {
  CHART_AXIS_TICK,
  CHART_TOOLTIP_STYLE,
} from '@/modules/admin/constants';
import { buildDailySales } from '@/modules/admin/utils/stats';
import { useUi } from '@/modules/ui/context/UiContext';
import { formatCurrency, formatDate } from '@/utils/format';

function truncate(value: string, max = 18): string {
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

interface ChartCardProps {
  title: string;
  icon: ReactNode;
  empty: boolean;
  children: ReactNode;
}

function ChartCard({ title, icon, empty, children }: ChartCardProps) {
  const { t } = useTranslation();

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', color: 'text.secondary' }}>{icon}</Box>
        <Typography variant="h6">{title}</Typography>
      </Stack>
      {empty ? (
        <Box sx={{ height: 320, display: 'grid', placeItems: 'center' }}>
          <Typography color="text.secondary">{t('noSalesYet')}</Typography>
        </Box>
      ) : (
        <Box sx={{ height: 320, minWidth: 0 }}>{children}</Box>
      )}
    </Paper>
  );
}

export function AdminChartsSection({ stats }: { stats: AdminStats }) {
  const { t } = useTranslation();
  const { language } = useUi();

  const topBooks = [...stats.books]
    .sort((a, b) => b.soldCopies - a.soldCopies)
    .slice(0, 10)
    .map((book) => ({ label: truncate(book.title), sold: book.soldCopies }));

  const topCategories = [...stats.categories]
    .sort((a, b) => b.soldCopies - a.soldCopies)
    .slice(0, 10)
    .map((category) => ({
      label: truncate(category.category),
      sold: category.soldCopies,
    }));

  const salesSeries = buildDailySales(stats.payments);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          lg: 'repeat(2, minmax(0, 1fr))',
        },
        gap: 2,
        mb: 4,
      }}
    >
      <ChartCard
        title={t('topSelling')}
        icon={<BarChartOutlinedIcon fontSize="small" />}
        empty={topBooks.length === 0}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topBooks}
            margin={{ top: 8, right: 16, left: 0, bottom: 40 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(103, 69, 51, 0.18)"
            />
            <XAxis
              dataKey="label"
              angle={-25}
              textAnchor="end"
              interval={0}
              tick={CHART_AXIS_TICK}
            />
            <YAxis allowDecimals={false} tick={CHART_AXIS_TICK} />
            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              labelStyle={{ color: '#1e110b', fontWeight: 600 }}
              cursor={{ fill: 'rgba(103, 69, 51, 0.08)' }}
            />
            <Bar
              dataKey="sold"
              fill="#674533"
              radius={[6, 6, 0, 0]}
              maxBarSize={44}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title={t('topCategories')}
        icon={<CategoryOutlinedIcon fontSize="small" />}
        empty={topCategories.length === 0}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topCategories}
            margin={{ top: 8, right: 16, left: 0, bottom: 40 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(103, 69, 51, 0.18)"
            />
            <XAxis
              dataKey="label"
              angle={-25}
              textAnchor="end"
              interval={0}
              tick={CHART_AXIS_TICK}
            />
            <YAxis allowDecimals={false} tick={CHART_AXIS_TICK} />
            <Tooltip
              contentStyle={CHART_TOOLTIP_STYLE}
              labelStyle={{ color: '#1e110b', fontWeight: 600 }}
              cursor={{ fill: 'rgba(103, 69, 51, 0.08)' }}
            />
            <Bar
              dataKey="sold"
              fill="#9a5b13"
              radius={[6, 6, 0, 0]}
              maxBarSize={44}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <Box sx={{ gridColumn: { lg: '1 / -1' } }}>
        <ChartCard
          title={t('salesTrend')}
          icon={<ShowChartOutlinedIcon fontSize="small" />}
          empty={salesSeries.length === 0}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={salesSeries}
              margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
            >
              <defs>
                <linearGradient
                  id="adminRevenueFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#674533" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#674533" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(103, 69, 51, 0.18)"
              />
              <XAxis
                dataKey="date"
                tick={CHART_AXIS_TICK}
                minTickGap={24}
                tickFormatter={(value) =>
                  formatDate(String(value), language, {
                    month: 'short',
                    day: 'numeric',
                  })
                }
              />
              <YAxis tick={CHART_AXIS_TICK} />
              <Tooltip
                contentStyle={CHART_TOOLTIP_STYLE}
                labelStyle={{ color: '#1e110b', fontWeight: 600 }}
                formatter={(value) => formatCurrency(Number(value), language)}
                labelFormatter={(value) =>
                  formatDate(String(value), language, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                }
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#4a2f22"
                strokeWidth={2}
                fill="url(#adminRevenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>
    </Box>
  );
}
