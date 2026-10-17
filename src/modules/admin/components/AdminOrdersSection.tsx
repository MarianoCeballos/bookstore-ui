import { Chip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { DataTable } from '@/modules/admin/components/DataTable';
import { adminService } from '@/modules/admin/services/admin.service';
import { useUi } from '@/modules/ui/context/UiContext';
import { formatCurrency, formatDate } from '@/utils/format';

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
      headers={[
        t('idColumn'),
        t('publishedDate'),
        t('status'),
        t('purchases'),
        t('total'),
      ]}
      rows={
        ordersQuery.data?.map((item) => [
          `#${item.ID}`,
          formatDate(item.createdAt, language, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          <Chip
            key="status"
            size="small"
            label={item.status}
            variant="outlined"
          />,
          item.items.length,
          formatCurrency(item.total, language),
        ]) ?? []
      }
    />
  );
}
