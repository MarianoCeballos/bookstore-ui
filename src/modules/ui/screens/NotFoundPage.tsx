import { Button, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <Container maxWidth="sm">
      <Stack spacing={2} sx={{ py: 8, alignItems: 'center' }}>
        <Typography variant="h2">404</Typography>
        <Typography variant="h5">{t('notFound')}</Typography>
        <Button component={Link} to="/" variant="contained">
          {t('backHome')}
        </Button>
      </Stack>
    </Container>
  );
}
