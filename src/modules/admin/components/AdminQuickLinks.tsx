import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import { Box, ButtonBase, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';

interface QuickLink {
  label: string;
  hint: string;
  to: string;
  icon: ReactNode;
}

export function AdminQuickLinks() {
  const { t } = useTranslation();

  const links: QuickLink[] = [
    {
      label: t('statsSectionTitle'),
      hint: t('manageStatsHint'),
      to: ROUTES.ADMIN_SECTION('stats'),
      icon: <InsightsOutlinedIcon fontSize="small" />,
    },
    {
      label: t('booksSectionTitle'),
      hint: t('manageBooksHint'),
      to: ROUTES.ADMIN_SECTION('books'),
      icon: <LibraryBooksOutlinedIcon fontSize="small" />,
    },
    {
      label: t('usersSectionTitle'),
      hint: t('manageUsersHint'),
      to: ROUTES.ADMIN_SECTION('users'),
      icon: <GroupOutlinedIcon fontSize="small" />,
    },
    {
      label: t('reviewsSectionTitle'),
      hint: t('manageReviewsHint'),
      to: ROUTES.ADMIN_SECTION('reviews'),
      icon: <RateReviewOutlinedIcon fontSize="small" />,
    },
    {
      label: t('ordersSectionTitle'),
      hint: t('manageOrdersHint'),
      to: ROUTES.ADMIN_SECTION('orders'),
      icon: <LocalShippingOutlinedIcon fontSize="small" />,
    },
  ];

  return (
    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', color: 'text.secondary' }}>
          <StorefrontOutlinedIcon fontSize="small" />
        </Box>
        <Typography variant="h6">{t('manageStore')}</Typography>
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
          gap: 1.5,
        }}
      >
        {links.map((link) => (
          <Paper
            key={link.to}
            variant="outlined"
            sx={{
              borderRadius: 1.5,
              overflow: 'hidden',
              bgcolor: 'rgba(239, 227, 202, 0.3)',
            }}
          >
            <ButtonBase
              component={Link}
              to={link.to}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 0.75,
                p: 2,
                width: '100%',
                height: '100%',
                textAlign: 'left',
              }}
            >
              <Box sx={{ display: 'flex', color: '#4a2f22' }}>{link.icon}</Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {link.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {link.hint}
              </Typography>
            </ButtonBase>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
}
