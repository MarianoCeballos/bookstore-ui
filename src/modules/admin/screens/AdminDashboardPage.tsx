import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AdminQuickLinks } from '@/modules/admin/components/AdminQuickLinks';
import { AdminRecentOrders } from '@/modules/admin/components/AdminRecentOrders';
import { adminService } from '@/modules/admin/services/admin.service';

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const stats = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: adminService.stats,
  });

  return (
    <Container maxWidth="xl">
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 3,
          color: '#fffaf0',
          background: 'linear-gradient(135deg, #4a2f22 0%, #674533 100%)',
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: 48,
                height: 48,
                flexShrink: 0,
                borderRadius: 2,
                bgcolor: 'rgba(255, 250, 240, 0.16)',
              }}
            >
              <DashboardOutlinedIcon />
            </Box>
            <Typography variant="h3" sx={{ color: '#fffaf0' }}>
              {t('adminDashboard')}
            </Typography>
          </Stack>
          <Typography
            sx={{ color: 'rgba(255, 250, 240, 0.85)', maxWidth: 640 }}
          >
            {t('adminDashboardSubtitle')}
          </Typography>
        </Stack>
      </Paper>

      {stats.isError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
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
      )}

      {stats.isPending && (
        <Box
          aria-busy="true"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: 2,
          }}
        >
          <Skeleton variant="rounded" height={320} />
          <Skeleton variant="rounded" height={320} />
        </Box>
      )}

      <Stack spacing={3}>
        <AdminQuickLinks />
        {stats.data && <AdminRecentOrders payments={stats.data.payments} />}
      </Stack>
    </Container>
  );
}
