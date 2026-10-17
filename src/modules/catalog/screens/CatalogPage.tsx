import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHomeBooks, useBooks } from '@/modules/catalog/hooks/useBooks';
import { useAuthors, useCategories } from '@/modules/lookups/hooks/useLookups';
import BookGrid from '@/components/BookGrid';
import type { paths } from '@/interfaces/generated/api';
import banner from '@/assets/banner.jpg';
import bannerB from '@/assets/bannerB.jpg';
import bannerC from '@/assets/bannerC.jpg';
import bannerD from '@/assets/bannerD.jpg';
import bannerE from '@/assets/bannerE.jpg';

type Search = NonNullable<paths['/books']['get']['parameters']['query']>;
const banners = [banner, bannerB, bannerC, bannerD, bannerE];
const PAGE_SIZE_OPTIONS = [8, 12, 24, 48] as const;

export default function CatalogPage({
  featured = false,
}: {
  featured?: boolean;
}) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [bannerIndex, setBannerIndex] = useState(0);
  useEffect(() => {
    if (!featured) return;
    const timer = window.setInterval(() => {
      setBannerIndex((index) => (index + 1) % banners.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [featured]);
  const { data: authors = [] } = useAuthors(!featured);
  const { data: categories = [] } = useCategories(!featured);
  const [pageSearch, setPageSearch] = useState(search);
  if (pageSearch !== search) {
    setPageSearch(search);
    setPage(1);
  }
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
        <Box className="home-banner">
          <Box
            component="img"
            src={banners[bannerIndex]}
            alt={t('featuredBanner', { number: bannerIndex + 1 })}
          />
          <Box className="home-banner__controls">
            <IconButton
              aria-label={t('previousBanner')}
              onClick={() =>
                setBannerIndex(
                  (index) => (index - 1 + banners.length) % banners.length,
                )
              }
              sx={{
                color: 'white',
                bgcolor: 'rgb(30 17 11 / 55%)',
                '&:hover': { bgcolor: 'rgb(30 17 11 / 78%)' },
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <IconButton
              aria-label={t('nextBanner')}
              onClick={() =>
                setBannerIndex((index) => (index + 1) % banners.length)
              }
              sx={{
                color: 'white',
                bgcolor: 'rgb(30 17 11 / 55%)',
                '&:hover': { bgcolor: 'rgb(30 17 11 / 78%)' },
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{ py: 1, justifyContent: 'center' }}
          >
            {banners.map((bannerItem, index) => (
              <Button
                key={bannerItem}
                aria-label={t('showBanner', { number: index + 1 })}
                onClick={() => setBannerIndex(index)}
                sx={{
                  minWidth: 10,
                  width: 10,
                  height: 10,
                  p: 0,
                  borderRadius: '50%',
                  bgcolor: index === bannerIndex ? '#ddb577' : '#fffaf0',
                  border: '1px solid #674533',
                }}
              />
            ))}
          </Stack>
          <Stack sx={{ alignItems: 'center', pb: 2 }}>
            <Button component={Link} to="/books" variant="contained">
              {t('explore')}
            </Button>
          </Stack>
        </Box>
        {homeQuery.isError && (
          <Alert severity="error" sx={{ mt: 3 }}>
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
          <Button component={Link} to="/books" variant="outlined" size="large">
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
        sx={{ mb: 1, color: '#674533', fontFamily: 'Roboto, sans-serif' }}
      >
        {t('explore')}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {t('catalogDescription')}
      </Typography>
      {search.trim() && (
        <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
          <Typography color="text.secondary">
            {t('resultsFor', { term: search.trim() })}
          </Typography>
          <Button
            size="small"
            onClick={() => setSearchParams({}, { replace: true })}
          >
            {t('clearSearch')}
          </Button>
        </Stack>
      )}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <FormControl sx={{ flex: 1 }}>
          <InputLabel id="author-label">{t('author')}</InputLabel>
          <Select
            labelId="author-label"
            label={t('author')}
            value={author}
            onChange={(event) => {
              setAuthor(event.target.value);
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
              setCategory(event.target.value);
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
      </Stack>
      {booksQuery.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t('booksError')}
        </Alert>
      )}
      <BookGrid books={paginatedBooks} loading={booksQuery.isPending} />
      {totalBooks > 0 && (
        <Box
          sx={{
            mt: 4,
            px: { xs: 2, sm: 3 },
            py: 2,
            borderRadius: 2,
            bgcolor: '#fffaf0',
            border: '1px solid rgba(103, 69, 51, 0.25)',
            boxShadow: '0 2px 10px rgba(30, 17, 11, 0.06)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            {t('showingResults', {
              start: rangeStart,
              end: rangeEnd,
              total: totalBooks,
            })}
          </Typography>

          <Pagination
            page={currentPage}
            count={totalPages}
            onChange={(_, value) => handlePageChange(value)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            siblingCount={1}
            boundaryCount={1}
            sx={{
              '& .MuiPaginationItem-root': {
                fontWeight: 600,
                borderRadius: 1.5,
                color: '#1e110b',
                border: '1px solid rgba(103, 69, 51, 0.2)',
                bgcolor: 'rgba(223, 201, 154, 0.2)',
                '&:hover': {
                  bgcolor: 'rgba(221, 181, 119, 0.45)',
                },
              },
              '& .MuiPaginationItem-root.Mui-selected': {
                bgcolor: '#674533',
                color: '#fffaf0',
                borderColor: '#674533',
                boxShadow: '0 2px 6px rgba(30, 17, 11, 0.2)',
                '&:hover': {
                  bgcolor: '#805436',
                },
              },
              '& .MuiPaginationItem-ellipsis': {
                border: 'none',
                bgcolor: 'transparent',
              },
            }}
          />

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {t('perPage')}:
            </Typography>
            <Select
              size="small"
              value={pageSize}
              aria-label={t('perPage')}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              sx={{
                minWidth: 72,
                bgcolor: 'rgba(223, 201, 154, 0.2)',
                borderRadius: 1.5,
                fontWeight: 600,
                '& .MuiSelect-select': { py: 0.75 },
              }}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        </Box>
      )}
    </Container>
  );
}
