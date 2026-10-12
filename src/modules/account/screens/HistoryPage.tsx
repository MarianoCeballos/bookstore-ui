import { Alert, Container, Paper, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useOrders } from '@/modules/catalog/hooks/useCatalogQueries';
import { useTranslation } from 'react-i18next';

export default function HistoryPage() {
  const { t } = useTranslation();
  const orders = useOrders();
  return (
    <Container maxWidth="lg">
      <Typography variant="h3" sx={{ mb: 3 }}>
        {t('purchaseHistory')}
      </Typography>
      {orders.isError && (
        <Alert severity="error">Purchase history could not be loaded.</Alert>
      )}
      {!orders.isPending && !orders.data?.length && (
        <Alert severity="info">
          {t('emptyHistory')} <Link to="/books">{t('browse')}</Link>.
        </Alert>
      )}
      <Stack spacing={2}>
        {orders.data?.map((order) => (
          <Paper variant="outlined" sx={{ p: 3 }} key={order.ID}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              sx={{ justifyContent: 'space-between' }}
            >
              <Typography variant="h6">
                {t('order')} #{order.ID}
              </Typography>
              <Typography>
                {new Date(order.createdAt).toLocaleString()}
              </Typography>
            </Stack>
            <Typography color="text.secondary">
              {t('status')}: {order.status}
            </Typography>
            <Stack spacing={0.5} sx={{ my: 2 }}>
              {order.items.map((item, index) => (
                <Typography key={`${order.ID}-${item.ID}-${index}`}>
                  {item.title} · ${Number(item.price).toFixed(2)}
                </Typography>
              ))}
            </Stack>
            <Typography sx={{ fontWeight: 700 }}>
              {t('total')}: ${Number(order.total).toFixed(2)}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}
