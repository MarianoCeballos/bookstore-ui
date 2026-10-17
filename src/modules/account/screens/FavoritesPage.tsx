import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import BookCard from '@/components/BookCard';
import BookGrid from '@/components/BookGrid';
import { PageStateCard } from '@/components/PageStateCard';
import { ROUTES } from '@/constants';
import type { Book } from '@/interfaces/models';
import { useFavorites } from '@/modules/account/context/FavoritesContext';
import { getLocalizedErrorMessage } from '@/utils/error';

export default function FavoritesPage() {
  const { items, loading, add, remove } = useFavorites();
  const { t } = useTranslation();
  const [removingId, setRemovingId] = useState<number | null>(null);

  const handleRemove = async (book: Book) => {
    setRemovingId(book.ID);
    try {
      await remove(book.ID);
      toast.success(t('toastRemovedFromFavorites'), {
        description: book.title,
        action: {
          label: t('undo'),
          onClick: () => void add(book.ID),
        },
      });
    } catch (err) {
      toast.error(getLocalizedErrorMessage(err, t));
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h3" sx={{ mb: 3 }}>
        {t('favoritesTitle')}
      </Typography>

      {loading && <BookGrid loading />}

      {!loading && items.length === 0 && (
        <PageStateCard
          title={t('favoritesTitle')}
          description={t('emptyFavorites')}
          icon={<FavoriteBorderRoundedIcon fontSize="medium" />}
          actionLabel={t('browse')}
          actionTo={ROUTES.BOOKS}
        />
      )}

      {!loading && items.length > 0 && (
        <Box className="book-grid">
          {items.map((book) => {
            const isRemoving = removingId === book.ID;
            return (
              <Box
                key={book.ID}
                sx={{ display: 'flex', flexDirection: 'column' }}
              >
                <Box sx={{ flex: 1 }}>
                  <BookCard book={book} />
                </Box>
                <Button
                  color="error"
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 1 }}
                  disabled={isRemoving}
                  startIcon={
                    isRemoving ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <DeleteOutlineRoundedIcon fontSize="small" />
                    )
                  }
                  onClick={() => void handleRemove(book)}
                >
                  {t('removeFromFavorites')}
                </Button>
              </Box>
            );
          })}
        </Box>
      )}
    </Container>
  );
}
