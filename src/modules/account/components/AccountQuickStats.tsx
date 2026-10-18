import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

interface AccountQuickStatsProps {
  savedBooks: number;
  cartBooks: number;
  completedOrders: number;
  publishedReviews: number;
}

export function AccountQuickStats({
  savedBooks,
  cartBooks,
  completedOrders,
  publishedReviews,
}: AccountQuickStatsProps) {
  const { t } = useTranslation();

  const quickStats = [
    {
      label: t('savedBooksCount'),
      value: savedBooks,
      icon: <FavoriteBorderRoundedIcon fontSize="small" color="primary" />,
      to: ROUTES.FAVORITES,
    },
    {
      label: t('booksInCartCount'),
      value: cartBooks,
      icon: <ShoppingBagOutlinedIcon fontSize="small" color="primary" />,
      to: ROUTES.CART,
    },
    {
      label: t('completedOrdersCount'),
      value: completedOrders,
      icon: <ReceiptLongOutlinedIcon fontSize="small" color="primary" />,
      to: ROUTES.HISTORY,
    },
    {
      label: t('publishedReviewsCount'),
      value: publishedReviews,
      icon: <RateReviewOutlinedIcon fontSize="small" color="primary" />,
      to: '#my-reviews-section',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr 1fr',
          md: 'repeat(4, 1fr)',
        },
        gap: 2,
      }}
    >
      {quickStats.map((stat) => {
        const isHashLink = stat.to.startsWith('#');
        return (
          <Paper
            key={stat.label}
            component={isHashLink ? 'a' : Link}
            {...(isHashLink ? { href: stat.to } : { to: stat.to })}
            variant="outlined"
            sx={{
              p: 2.25,
              borderRadius: 2,
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: 'primary.main',
              },
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600 }}
              >
                {stat.label}
              </Typography>
              {stat.icon}
            </Stack>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {stat.value}
            </Typography>
          </Paper>
        );
      })}
    </Box>
  );
}
