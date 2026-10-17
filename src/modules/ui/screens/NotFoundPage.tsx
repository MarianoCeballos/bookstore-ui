import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PageStateCard } from '@/components/PageStateCard';
import { ROUTES } from '@/constants';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <PageStateCard
        variant="error"
        title="404"
        description={t('notFound')}
        actionLabel={t('backHome')}
        actionTo={ROUTES.HOME}
      />
    </Container>
  );
}
