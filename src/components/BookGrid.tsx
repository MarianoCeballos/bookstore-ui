import { Box, Skeleton, Stack, Typography } from '@mui/material';
import type { Book } from '@/interfaces/models';
import BookCard from '@/components/BookCard';
import { useTranslation } from 'react-i18next';

export default function BookGrid({
  books,
  loading = false,
  horizontal = false,
}: {
  books?: Book[];
  loading?: boolean;
  horizontal?: boolean;
}) {
  const { t } = useTranslation();
  const gridClass = `book-grid${horizontal ? ' book-grid--horizontal' : ''}`;
  if (loading) {
    return (
      <Box className={gridClass}>
        {Array.from({ length: 8 }, (_, index) => (
          <Stack key={index} spacing={1}>
            <Skeleton variant="rounded" height={176} />
            <Skeleton width="70%" />
            <Skeleton width="40%" />
          </Stack>
        ))}
      </Box>
    );
  }
  if (!books?.length) return <Typography>{t('noBooks')}</Typography>;
  return (
    <Box className={gridClass}>
      {books.map((book) => (
        <BookCard key={book.ID} book={book} />
      ))}
    </Box>
  );
}
