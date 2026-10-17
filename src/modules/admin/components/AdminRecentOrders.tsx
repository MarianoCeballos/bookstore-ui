import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import type { AdminStats } from '@/interfaces/models';
import { DataTable } from '@/modules/admin/components/DataTable';
import { useUi } from '@/modules/ui/context/UiContext';
import { formatCurrency, formatDate } from '@/utils/format';

const RECENT_ORDERS_LIMIT = 5;

export function AdminRecentOrders({
  payments,
}: {
  payments: AdminStats['payments'];
}) {
  const { t } = useTranslation();
  const { language } = useUi();

  const rows = [...payments]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, RECENT_ORDERS_LIMIT)
    .map((order) => [
      formatDate(order.createdAt, language, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      order.items,
      formatCurrency(order.total, language),
    ]);

  return (
    <Box sx={{ minWidth: 0 }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          mb: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">{t('recentOrders')}</Typography>
        <Button
          component={Link}
          to={ROUTES.ADMIN_SECTION('orders')}
          size="small"
        >
          {t('viewAllOrders')}
        </Button>
      </Stack>
      <DataTable
        headers={[t('publishedDate'), t('purchases'), t('total')]}
        rows={rows}
        emptyMessage={t('noSalesYet')}
      />
    </Box>
  );
}
