import { Box, Container, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AccountProfileHeader } from '@/modules/account/components/AccountProfileHeader';
import { AccountQuickStats } from '@/modules/account/components/AccountQuickStats';
import { AccountReviewsSection } from '@/modules/account/components/AccountReviewsSection';
import { ProfileDetailsForm } from '@/modules/account/components/ProfileDetailsForm';
import { SecurityPasswordForm } from '@/modules/account/components/SecurityPasswordForm';
import { useCart } from '@/modules/account/context/CartContext';
import { useFavorites } from '@/modules/account/context/FavoritesContext';
import { useUserReviews } from '@/modules/account/hooks/useUserReviews';
import { useAuthenticatedUser } from '@/modules/auth/context/AuthenticatedUserContext';
import { useOrders } from '@/modules/catalog/hooks/useCatalogQueries';

export default function AccountPage() {
  const { t } = useTranslation();
  const user = useAuthenticatedUser();
  const { items: favorites } = useFavorites();
  const { items: cart } = useCart();
  const orders = useOrders();
  const userReviews = useUserReviews(user.ID);

  const reviews = userReviews.data?.reviews ?? [];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" sx={{ mb: 0.75 }}>
          {t('accountTitle')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('accountSubtitle')}
        </Typography>
      </Box>

      <Stack spacing={3}>
        <AccountProfileHeader user={user} />

        <AccountQuickStats
          savedBooks={favorites.length}
          cartBooks={cart.length}
          completedOrders={orders.data?.length ?? 0}
          publishedReviews={reviews.length}
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '7fr 5fr' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          <ProfileDetailsForm user={user} />
          <SecurityPasswordForm />
        </Box>

        <AccountReviewsSection
          reviews={reviews}
          isPending={userReviews.isPending}
          isError={userReviews.isError}
          onRetry={() => void userReviews.refetch()}
        />
      </Stack>
    </Container>
  );
}
