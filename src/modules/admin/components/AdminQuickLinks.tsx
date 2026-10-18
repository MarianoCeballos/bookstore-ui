import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
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
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: 2 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
        <Box sx={{ display: 'flex', color: 'text.secondary' }}>
          <StorefrontOutlinedIcon fontSize="small" />
        </Box>
        <Typography variant="h6">{t('manageStore')}</Typography>
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
          gap: 1,
        }}
      >
        {links.map((link) => (
          <ButtonBase
            key={link.to}
            component={Link}
            to={link.to}
            sx={{
              display: 'flex',
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              alignItems: 'center',
              columnGap: { xs: 1, sm: 1.25 },
              rowGap: 0.25,
              px: 1.5,
              py: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
              bgcolor: 'rgba(239, 227, 202, 0.3)',
              color: 'inherit',
              textAlign: 'left',
              transition:
                'background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease',
              '&:hover': {
                bgcolor: 'rgba(239, 227, 202, 0.8)',
                borderColor: 'primary.main',
                boxShadow: '0 4px 12px rgba(74, 47, 34, 0.16)',
                transform: 'translateY(-1px)',
              },
              '&:hover .adminQuickLinkIcon': { color: 'primary.main' },
              '&:hover .adminQuickLinkChevron': {
                color: 'primary.main',
                transform: 'translateX(3px)',
              },
              '@media (prefers-reduced-motion: reduce)': {
                transition: 'none',
                '&:hover': { transform: 'none' },
                '&:hover .adminQuickLinkChevron': { transform: 'none' },
              },
            }}
          >
            <Box
              className="adminQuickLinkIcon"
              sx={{
                display: 'flex',
                color: 'primary.dark',
                transition: 'color 0.15s ease',
              }}
            >
              {link.icon}
            </Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}
            >
              {link.label}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                order: { xs: 3, sm: 0 },
                flex: 1,
                width: { xs: '100%', sm: 'auto' },
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: { xs: 'normal', sm: 'nowrap' },
              }}
            >
              {link.hint}
            </Typography>
            <ChevronRightRoundedIcon
              className="adminQuickLinkChevron"
              sx={{
                order: { xs: 2, sm: 0 },
                ml: { xs: 'auto', sm: 0 },
                flexShrink: 0,
                fontSize: 18,
                color: 'text.secondary',
                transition: 'color 0.15s ease, transform 0.15s ease',
              }}
            />
          </ButtonBase>
        ))}
      </Box>
    </Paper>
  );
}
