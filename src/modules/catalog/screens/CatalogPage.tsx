import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import BookGrid from '@/components/BookGrid';
import { DEFAULT_CATALOG_PAGE_SIZE, ROUTES } from '@/constants';
import type { paths } from '@/interfaces/generated/api';
import { CatalogPaginationBar } from '@/modules/catalog/components/CatalogPaginationBar';
import { HeroBannerCarousel } from '@/modules/catalog/components/HeroBannerCarousel';
import { useBooks, useHomeBooks } from '@/modules/catalog/hooks/useBooks';
import { useAuthors, useCategories } from '@/modules/lookups/hooks/useLookups';

type Search = NonNullable<paths['/books']['get']['parameters']['query']>;

export default function CatalogPage({
  featured = false,
}: {
  featured?: boolean;
}) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const urlAuthor = searchParams.get('author') ?? '';
  const urlCategory = searchParams.get('category') ?? '';

  const [author, setAuthor] = useState(urlAuthor);
  const [category, setCategory] = useState(urlCategory);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_CATALOG_PAGE_SIZE);

  const [prevUrlFilters, setPrevUrlFilters] = useState({
    search,
    urlAuthor,
    urlCategory,
  });

  if (
    prevUrlFilters.search !== search ||
    prevUrlFilters.urlAuthor !== urlAuthor ||
    prevUrlFilters.urlCategory !== urlCategory
  ) {
    setPrevUrlFilters({ search, urlAuthor, urlCategory });
    if (prevUrlFilters.urlAuthor !== urlAuthor) {
      setAuthor(urlAuthor);
    }
    if (prevUrlFilters.urlCategory !== urlCategory) {
      setCategory(urlCategory);
    }
    setPage(1);
  }

  const { data: authors = [] } = useAuthors(!featured);
  const { data: categories = [] } = useCategories(!featured);

  const filters: Search = useMemo(
    () => ({
      ...(search.trim() ? { title: search.trim() } : {}),
      ...(author ? { author } : {}),
      ...(category ? { category } : {}),
    }),
    [author, category, search],
  );

  const booksQuery = useBooks(filters, !featured);
  const homeQuery = useHomeBooks(featured);

  const allBooks = booksQuery.data ?? [];
  const totalBooks = allBooks.length;
  const totalPages = Math.max(1, Math.ceil(totalBooks / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedBooks = allBooks.slice(startIndex, startIndex + pageSize);
  const rangeStart = totalBooks === 0 ? 0 : startIndex + 1;
  const rangeEnd = Math.min(startIndex + pageSize, totalBooks);

  const hasActiveFilters = Boolean(search.trim() || author || category);

  const handleClearFilters = () => {
    setAuthor('');
    setCategory('');
    setPage(1);
    setSearchParams({}, { replace: true });
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    if (
      typeof window !== 'undefined' &&
      typeof window.scrollTo === 'function'
    ) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (featured) {
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

  return (
    <Container maxWidth="xl" className="catalog-panel">
      <Typography
        variant="h3"
        sx={{ mb: 1, color: 'primary.dark', fontFamily: 'Roboto, sans-serif' }}
      >
        {t('explore')}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {t('catalogDescription')}
      </Typography>

      {search.trim() && (
        <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
          <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
            {t('resultsFor', { term: search.trim() })}
          </Typography>
          <Button
            size="small"
            onClick={() => {
              const nextParams = new URLSearchParams(searchParams);
              nextParams.delete('search');
              setSearchParams(nextParams, { replace: true });
            }}
          >
            {t('clearSearch')}
          </Button>
        </Stack>
      )}

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{ mb: 4, alignItems: { xs: 'stretch', md: 'center' } }}
      >
        <FormControl sx={{ flex: 1 }}>
          <InputLabel id="author-label">{t('author')}</InputLabel>
          <Select
            labelId="author-label"
            label={t('author')}
            value={author}
            onChange={(event) => {
              const nextAuthor = event.target.value;
              setAuthor(nextAuthor);
              setPage(1);
            }}
          >
            <MenuItem value="">{t('allAuthors')}</MenuItem>
            {authors.map((item) => (
              <MenuItem value={item.name} key={item.ID}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ flex: 1 }}>
          <InputLabel id="category-label">{t('category')}</InputLabel>
          <Select
            labelId="category-label"
            label={t('category')}
            value={category}
            onChange={(event) => {
              const nextCategory = event.target.value;
              setCategory(nextCategory);
              setPage(1);
            }}
          >
            <MenuItem value="">{t('allCategories')}</MenuItem>
            {categories.map((item) => (
              <MenuItem value={item.category} key={item.ID}>
                {item.category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {hasActiveFilters && (
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            sx={{ flexShrink: 0, height: 56 }}
          >
            {t('clearFilters')}
          </Button>
        )}
      </Stack>

      {booksQuery.isError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => void booksQuery.refetch()}
            >
              {t('retry')}
            </Button>
          }
        >
          {t('booksError')}
        </Alert>
      )}

      <BookGrid books={paginatedBooks} loading={booksQuery.isPending} />

      <CatalogPaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        rangeStart={rangeStart}
        rangeEnd={rangeEnd}
        totalBooks={totalBooks}
        onPageChange={handlePageChange}
        onPageSizeChange={(nextSize) => {
          setPageSize(nextSize);
          setPage(1);
        }}
      />
    </Container>
  );
}
