import { Alert, Box, Button, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AdminChartsSection } from '@/modules/admin/components/AdminChartsSection';
import { AdminStatGrid } from '@/modules/admin/components/AdminStatGrid';
import { adminService } from '@/modules/admin/services/admin.service';

const STAT_SKELETONS = 6;

export function AdminStatsSection() {
  const { t } = useTranslation();
  const stats = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminService.stats,
  });

  if (stats.isError) {
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
    return (
      <Box aria-busy="true">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 2,
            mb: 4,
          }}
        >
          {Array.from({ length: STAT_SKELETONS }, (_, index) => (
            <Skeleton key={index} variant="rounded" height={128} />
          ))}
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: 'repeat(2, minmax(0, 1fr))',
            },
            gap: 2,
          }}
        >
          <Skeleton variant="rounded" height={392} />
          <Skeleton variant="rounded" height={392} />
        </Box>
      </Box>
    );
  }

  return (
    <>
      <AdminStatGrid stats={stats.data} />
      <AdminChartsSection stats={stats.data} />
    </>
  );
}
