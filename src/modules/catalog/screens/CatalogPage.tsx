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
      ...(!featured ? { page, pageSize: 12 } : {}),
    }),
    [author, category, featured, page, search],
  );
  const booksQuery = useBooks(filters, !featured);
  const homeQuery = useHomeBooks(featured);

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
            {banners.map((banner, index) => (
              <Button
                key={banner}
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
      <BookGrid books={booksQuery.data} loading={booksQuery.isPending} />
      {booksQuery.data && booksQuery.data.length > 0 && (
        <Stack sx={{ mt: 4, alignItems: 'center' }}>
          <Pagination
            page={page}
            count={booksQuery.data.length < 12 ? page : page + 1}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Stack>
      )}
    </Container>
  );
}
