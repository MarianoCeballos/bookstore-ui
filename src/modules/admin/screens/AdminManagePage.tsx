import { Button, Container, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { PageStateCard } from '@/components/PageStateCard';
import { ROUTES } from '@/constants';
import { AdminBooksSection } from '@/modules/admin/components/AdminBooksSection';
import { AdminOrdersSection } from '@/modules/admin/components/AdminOrdersSection';
import { AdminReviewsSection } from '@/modules/admin/components/AdminReviewsSection';
import { AdminUsersSection } from '@/modules/admin/components/AdminUsersSection';

const sections = ['books', 'users', 'reviews', 'orders'] as const;
type Section = (typeof sections)[number];

export default function AdminManagePage() {
  const { t } = useTranslation();
  const section = useParams().section as Section;

  if (!sections.includes(section)) {
    return (
      <Container maxWidth="md">
        <PageStateCard
          variant="error"
          title={t('notFound')}
          actionLabel={t('adminDashboard')}
          actionTo={ROUTES.ADMIN}
        />
      </Container>
    );
  }

  const sectionLabels: Record<Section, string> = {
    books: t('booksSectionTitle'),
    users: t('usersSectionTitle'),
    reviews: t('reviewsSectionTitle'),
    orders: t('ordersSectionTitle'),
  };

  return (
    <Container maxWidth="xl">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mb: 3,
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
        }}
      >
        <Stack spacing={0.5} sx={{ alignItems: 'flex-start' }}>
          <Button component={Link} to={ROUTES.ADMIN} size="small">
            {t('backDashboard')}
          </Button>
          <Typography variant="h3">
            {t('manage')} · {sectionLabels[section]}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {sections.map((item) => (
            <Button
              key={item}
              component={Link}
              to={ROUTES.ADMIN_SECTION(item)}
              variant={item === section ? 'contained' : 'outlined'}
              size="small"
            >
              {sectionLabels[item]}
            </Button>
          ))}
        </Stack>
      </Stack>

      {section === 'books' && <AdminBooksSection />}
      {section === 'users' && <AdminUsersSection />}
      {section === 'reviews' && <AdminReviewsSection />}
      {section === 'orders' && <AdminOrdersSection />}
    </Container>
  );
}
