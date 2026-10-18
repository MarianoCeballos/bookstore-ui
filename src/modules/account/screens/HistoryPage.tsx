import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import {
  Alert,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageLoader } from '@/components/PageLoader';
import { PageStateCard } from '@/components/PageStateCard';
import { ROUTES } from '@/constants';
import { useOrders } from '@/modules/catalog/hooks/useCatalogQueries';
import { useUi } from '@/modules/ui/context/UiContext';
import { formatCurrency, formatDate } from '@/utils/format';

export default function HistoryPage() {
  const { t } = useTranslation();
  const { language } = useUi();
  const orders = useOrders();

  return (
    <Container maxWidth="lg">
      <Typography variant="h3" sx={{ mb: 3 }}>
        {t('purchaseHistory')}
      </Typography>

      {orders.isError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => void orders.refetch()}
            >
              {t('retry')}
            </Button>
          }
        ></Alert>
      )}

      {orders.isPending && (
        <PageLoader label={t('loadingHistory')} minHeight={280} />
      )}

      {!orders.isPending && !orders.isError && !orders.data?.length && (
        <PageStateCard
          title={t('purchaseHistory')}
          description={t('emptyHistory')}
          icon={<ReceiptLongOutlinedIcon fontSize="medium" />}
          actionLabel={t('browse')}
          actionTo={ROUTES.BOOKS}
        />
      )}

      {!orders.isPending && Boolean(orders.data?.length) && (
        <Stack spacing={2}>
          {orders.data?.map((order) => (
            <Paper
              variant="outlined"
              sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 2 }}
              key={order.ID}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  sx={{ alignItems: 'center' }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {t('order')} #{order.ID}
                  </Typography>
                  <Chip
                    label={order.status}
                    size="small"
                    color={
                      order.status.toLowerCase().includes('approved') ||
                      order.status.toLowerCase().includes('completed')
                        ? 'success'
                        : 'default'
                    }
                    variant="outlined"
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(order.createdAt, language, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1} sx={{ mb: 2 }}>
                {order.items.map((item, index) => (
                  <Stack
                    key={`${order.ID}-${item.ID}-${index}`}
                    direction="row"
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      component={Link}
                      to={ROUTES.BOOK_DETAIL(item.ID)}
                      color="inherit"
                      sx={{
                        textDecoration: 'none',
                        fontWeight: 600,
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(item.price, language)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

              <Typography sx={{ fontWeight: 800, textAlign: 'right' }}>
                {t('total')}: {formatCurrency(order.total, language)}
              </Typography>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
}
