import { Alert, Box, Button, Container, Typography } from '@mui/material';
import BookGrid from '@/components/BookGrid';
import { useFavorites } from '@/modules/account/context/FavoritesContext';
import { toast } from 'sonner';
import BookCard from '@/components/BookCard';
import { useTranslation } from 'react-i18next';

export default function FavoritesPage() {
  const { items, loading, remove } = useFavorites();
  const { t } = useTranslation();
  return (
    <Container maxWidth="xl">
      <Typography variant="h3" sx={{ mb: 3 }}>
        {t('favoritesTitle')}
      </Typography>
      {!loading && !items.length && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {t('emptyFavorites')}
        </Alert>
      )}
      {loading ? (
        <BookGrid loading />
      ) : (
        <Box className="book-grid">
          {items.map((book) => (
            <Box key={book.ID}>
              <BookCard book={book} />
              <Button
                color="error"
                fullWidth
                sx={{ mt: 1 }}
                onClick={() =>
                  remove(book.ID)
                    .then(() => toast.success('Removed from favorites.'))
                    .catch(() => toast.error('The book could not be removed.'))
                }
              >
                {t('removeFromFavorites')}
              </Button>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
}
