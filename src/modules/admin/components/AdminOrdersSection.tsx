import { Chip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { DataTable } from '@/modules/admin/components/DataTable';
import { adminService } from '@/modules/admin/services/admin.service';
import { useUi } from '@/modules/ui/context/UiContext';
import { formatCurrency, formatDate } from '@/utils/format';
import { getOrderStatusLabel } from '@/utils/orderStatus';

export function AdminOrdersSection() {
  const { t } = useTranslation();
  const { language } = useUi();

  const ordersQuery = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: adminService.orders,
  });

  return (
    <DataTable
      loading={ordersQuery.isPending}
      error={ordersQuery.isError}
      onRetry={() => void ordersQuery.refetch()}
      rows={ordersQuery.data ?? []}
      getRowKey={(item) => item.ID}
      columns={[
        {
          id: 'id',
          label: t('idColumn'),
          sortValue: (item) => item.ID,
          render: (item) => `#${item.ID}`,
        },
        {
          id: 'orderDate',
          label: t('orderDate'),
          sortValue: (item) => new Date(item.createdAt).getTime(),
          render: (item) =>
            formatDate(item.createdAt, language, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
        },
        {
          id: 'status',
          label: t('status'),
          sortValue: (item) => item.status,
          render: (item) => (
            <Chip
              size="small"
              label={getOrderStatusLabel(item.status, t)}
              variant="outlined"
            />
          ),
        },
        {
          id: 'purchases',
          label: t('purchases'),
          align: 'right',
          sortValue: (item) => item.items.length,
        },
        {
          id: 'total',
          label: t('total'),
          align: 'right',
          sortValue: (item) => Number(item.total),
          render: (item) => formatCurrency(item.total, language),
        },
      ]}
    />
  );
}
