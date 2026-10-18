import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { Box, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { AdminStats } from '@/interfaces/models';
import { useUi } from '@/modules/ui/context/UiContext';
import { sumRevenue, sumUnitsSold } from '@/modules/admin/utils/stats';
import { formatCurrency, formatNumber } from '@/utils/format';

interface StatCard {
  label: string;
  value: string;
  icon: ReactNode;
  accent: string;
}

export function AdminStatGrid({ stats }: { stats: AdminStats }) {
  const { t } = useTranslation();
  const { language } = useUi();

  const totalRevenue = sumRevenue(stats.payments);
  const orderCount = stats.payments.length;
  const averageOrder = orderCount > 0 ? totalRevenue / orderCount : 0;

  const cards: StatCard[] = [
    {
      label: t('totalRevenue'),
      value: formatCurrency(totalRevenue, language),
      icon: <PaidOutlinedIcon />,
      accent: '#24663b',
    },
    {
      label: t('purchases'),
      value: formatNumber(orderCount, language),
      icon: <ReceiptLongOutlinedIcon />,
      accent: '#674533',
    },
    {
      label: t('averageOrderValue'),
      value: formatCurrency(averageOrder, language),
      icon: <InsightsOutlinedIcon />,
      accent: '#9a5b13',
    },
    {
      label: t('registeredReaders'),
      value: formatNumber(stats.users.totalUsers, language),
      icon: <GroupOutlinedIcon />,
      accent: '#4a2f22',
    },
    {
      label: t('booksInCatalog'),
      value: formatNumber(stats.books.length, language),
      icon: <LibraryBooksOutlinedIcon />,
      accent: '#8a5a3b',
    },
    {
      label: t('unitsSold'),
      value: formatNumber(sumUnitsSold(stats.books), language),
      icon: <MenuBookOutlinedIcon />,
      accent: '#4e3325',
    },
  ];

  return (
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
      {cards.map((card) => (
        <Paper
          key={card.label}
          variant="outlined"
          sx={{
            p: 2.5,
            borderRadius: 2,
            bgcolor: 'rgba(239, 227, 202, 0.35)',
          }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                display: 'grid',
                placeItems: 'center',
                width: 44,
                height: 44,
                flexShrink: 0,
                borderRadius: 1.5,
                color: card.accent,
                bgcolor: 'rgba(255, 250, 240, 0.9)',
                border: '1px solid rgba(103, 69, 51, 0.2)',
              }}
            >
              {card.icon}
            </Box>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ fontWeight: 700, letterSpacing: '0.06em' }}
            >
              {card.label}
            </Typography>
          </Stack>
          <Typography variant="h4" sx={{ mt: 1.5 }}>
            {card.value}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
