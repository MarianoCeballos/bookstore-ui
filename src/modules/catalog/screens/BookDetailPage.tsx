import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { PageStateCard } from '@/components/PageStateCard';
import { ROUTES } from '@/constants';
import { BookDetailHero } from '@/modules/catalog/components/BookDetailHero';
import { BookDetailSkeleton } from '@/modules/catalog/components/BookDetailSkeleton';
import { BookReviewsSection } from '@/modules/catalog/components/BookReviewsSection';
import { useBook } from '@/modules/catalog/hooks/useBooks';

export default function BookDetailPage() {
  const rawId = useParams().id;
  const id = Number(rawId);
  const isValidId = Number.isSafeInteger(id) && id > 0;
  const { t } = useTranslation();

  const {
    data: book,
    isPending: isBookPending,
    isError: isBookError,
  } = useBook(id);

  if (!isValidId) {
    return (
      <Container maxWidth="md">
        <PageStateCard
          variant="error"
          title={t('bookNotFound')}
          description={t('bookNotFoundDescription')}
          actionLabel={t('backToCatalog')}
          actionTo={ROUTES.BOOKS}
        />
      </Container>
    );
  }

  if (isBookPending) {
    return <BookDetailSkeleton />;
  }

  if (isBookError || !book) {
    return (
      <Container maxWidth="md">
        <PageStateCard
          variant="error"
          title={t('bookNotFound')}
          description={t('bookNotFoundDescription')}
          actionLabel={t('backToCatalog')}
          actionTo={ROUTES.BOOKS}
        />
      </Container>
    );
  }

  const reviews = book.reviews ?? [];

  return (
    <Container maxWidth="lg">
      <BookDetailHero book={book} reviewCount={reviews.length} />
      <BookReviewsSection bookId={book.ID} reviews={reviews} />
    </Container>
  );
}
