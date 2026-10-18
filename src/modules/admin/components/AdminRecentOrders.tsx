import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import type { AdminStats } from '@/interfaces/models';
import { DataTable } from '@/modules/admin/components/DataTable';
import { RECENT_ORDERS_LIMIT } from '@/modules/admin/constants';
import { useUi } from '@/modules/ui/context/UiContext';
import { formatCurrency, formatDate } from '@/utils/format';

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
    .slice(0, RECENT_ORDERS_LIMIT);

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2 }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1.5,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Box sx={{ display: 'flex', color: 'text.secondary' }}>
            <ReceiptLongOutlinedIcon fontSize="small" />
          </Box>
          <Typography variant="h6">{t('recentOrders')}</Typography>
        </Stack>
        <Button
          component={Link}
          to={ROUTES.ADMIN_SECTION('orders')}
          size="small"
        >
          {t('viewAllOrders')}
        </Button>
      </Stack>

      <DataTable
        variant="plain"
        rows={rows}
        getRowKey={(order, index) => `${order.createdAt}-${index}`}
        emptyMessage={t('noSalesYet')}
        columns={[
          {
            id: 'orderDate',
            label: t('orderDate'),
            sortValue: (order) => new Date(order.createdAt).getTime(),
            render: (order) =>
              formatDate(order.createdAt, language, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }),
          },
          {
            id: 'purchases',
            label: t('purchases'),
            align: 'right',
            sortValue: (order) => order.items,
          },
          {
            id: 'total',
            label: t('total'),
            align: 'right',
            sortValue: (order) => Number(order.total),
            render: (order) => formatCurrency(order.total, language),
          },
        ]}
      />
    </Paper>
  );
}
