import { Alert, Box, Button, Container, Paper, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/modules/admin/services/admin.service';
import { useTranslation } from 'react-i18next';

const sections = [
  ['Books', 'books'],
  ['Users', 'users'],
  ['Reviews', 'reviews'],
  ['Purchases', 'orders'],
] as const;

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const stats = useQuery({ queryKey: ['admin', 'stats'], queryFn: adminService.stats });
  const chartData = stats.data?.books.slice(0, 10).map((book) => ({
    title: book.title.length > 18 ? `${book.title.slice(0, 18)}…` : book.title,
    sold: book.soldCopies,
  })) ?? [];

  return (
    <Container maxWidth="xl">
      <Typography variant="h3" sx={{ mb: 3 }}>{t('adminDashboard')}</Typography>
      {stats.isError && <Alert severity="error" sx={{ mb: 2 }}>Analytics could not be loaded.</Alert>}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
        {sections.map(([label, path]) => (
          <Button key={path} component={Link} to={`/admin/${path}`} variant="outlined">
            {t('manage')} {label.toLowerCase()}
          </Button>
        ))}
      </Stack>
      {stats.data && (
        <>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Paper variant="outlined" sx={{ p: 3, flex: 1 }}>
              <Typography color="text.secondary">{t('registeredReaders')}</Typography>
              <Typography variant="h3">{stats.data.users.totalUsers}</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 3, flex: 1 }}>
              <Typography color="text.secondary">{t('booksInCatalog')}</Typography>
              <Typography variant="h3">{stats.data.books.length}</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 3, flex: 1 }}>
              <Typography color="text.secondary">{t('purchases')}</Typography>
              <Typography variant="h3">{stats.data.payments.length}</Typography>
            </Paper>
          </Stack>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>{t('topSelling')}</Typography>
            <Box sx={{ height: 360, minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" angle={-25} textAnchor="end" interval={0} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="sold" fill="#225746" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </>
      )}
    </Container>
  );
}
