import { Alert, Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { PageLoader } from '@/components/PageLoader';
import { AdminChartsSection } from '@/modules/admin/components/AdminChartsSection';
import { AdminStatGrid } from '@/modules/admin/components/AdminStatGrid';
import { adminService } from '@/modules/admin/services/admin.service';

export function AdminStatsSection() {
  const { t } = useTranslation();
  const stats = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminService.stats,
  });

  if (stats.isError && !stats.data) {
    return (
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => void stats.refetch()}
          >
            {t('retry')}
          </Button>
        }
      >
        {t('errorGeneric')}
      </Alert>
    );
  }

  if (stats.isPending || !stats.data) {
    return <PageLoader minHeight={392} />;
  }

  return (
    <>
      {stats.isError && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => void stats.refetch()}
            >
              {t('retry')}
            </Button>
          }
        >
          {t('statsRefreshError')}
        </Alert>
      )}
      <AdminStatGrid stats={stats.data} />
      <AdminChartsSection stats={stats.data} />
    </>
  );
}
