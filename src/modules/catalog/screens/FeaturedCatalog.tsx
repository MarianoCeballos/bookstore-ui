import {
  Alert,
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import BookGrid from '@/components/BookGrid';
import { ROUTES } from '@/constants';
import { HeroBannerCarousel } from '@/modules/catalog/components/HeroBannerCarousel';
import { useHomeBooks } from '@/modules/catalog/hooks/useBooks';

export default function FeaturedCatalog() {
  const { t } = useTranslation();
  const homeQuery = useHomeBooks();
  const sections = [
    [t('bestsellers'), homeQuery.data?.bestSellers],
    [t('readerFavorites'), homeQuery.data?.mostPopular],
    [t('newReleases'), homeQuery.data?.newReleases],
  ] as const;

  return (
    <Container maxWidth="xl">
      <HeroBannerCarousel />
      {homeQuery.isError && (
        <Alert
          severity="error"
          sx={{ mt: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => void homeQuery.refetch()}
            >
              {t('retry')}
            </Button>
          }
        >
          {t('booksError')}
        </Alert>
      )}
      {sections.map(([title, books]) => (
        <Box key={title} className="home-section">
          <Typography
            variant="h4"
            className="home-section__title"
            sx={{ mb: 2 }}
          >
            {title}
          </Typography>
          <BookGrid books={books} loading={homeQuery.isPending} horizontal />
        </Box>
      ))}
      <Stack sx={{ mt: 4, alignItems: 'center' }}>
        <Button
          component={Link}
          to={ROUTES.BOOKS}
          variant="outlined"
          size="large"
        >
          {t('browseAll')}
        </Button>
      </Stack>
    </Container>
  );
}
