import { Box, Skeleton, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BookCard from '@/components/BookCard';
import { PageStateCard } from '@/components/PageStateCard';
import type { Book } from '@/interfaces/models';

export default function BookGrid({
  books,
  loading = false,
  horizontal = false,
  emptyAction,
}: {
  books?: Book[];
  loading?: boolean;
  horizontal?: boolean;
  emptyAction?: { label: string; onClick: () => void };
}) {
  const { t } = useTranslation();
  const gridClass = `book-grid${horizontal ? ' book-grid--horizontal' : ''}`;

  if (loading) {
    return (
      <Box className={gridClass} aria-busy="true">
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

  if (!books?.length) {
    return (
      <PageStateCard
        title={t('noBooks')}
        description={t('noBooksDescription')}
        actionLabel={emptyAction?.label}
        onAction={emptyAction?.onClick}
      />
    );
  }

  return (
    <Box className={gridClass}>
      {books.map((book) => (
        <BookCard key={book.ID} book={book} />
      ))}
    </Box>
  );
}
