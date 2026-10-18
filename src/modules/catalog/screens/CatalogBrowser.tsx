import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BookGrid from '@/components/BookGrid';
import { CatalogActiveFilterChips } from '@/modules/catalog/components/CatalogActiveFilterChips';
import { CatalogFilterDrawer } from '@/modules/catalog/components/CatalogFilterDrawer';
import { CatalogFilterPanel } from '@/modules/catalog/components/CatalogFilterPanel';
import { CatalogPaginationBar } from '@/modules/catalog/components/CatalogPaginationBar';
import { CatalogToolbar } from '@/modules/catalog/components/CatalogToolbar';
import { useBooks } from '@/modules/catalog/hooks/useBooks';
import { useCatalogFilters } from '@/modules/catalog/hooks/useCatalogFilters';
import type { BookSearchParams } from '@/modules/catalog/types';
import {
  applyCatalogFilters,
  buildCatalogFacets,
  countActiveCatalogFilters,
} from '@/modules/catalog/utils/catalogFilters';

/** The catalog is small enough to filter, sort and facet in the browser. */
const ALL_BOOKS_QUERY: BookSearchParams = {};

export default function CatalogBrowser() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { filters, page, pageSize, applyFilters, setPage, setPageSize, reset } =
    useCatalogFilters();

  const booksQuery = useBooks(ALL_BOOKS_QUERY);
  const allBooks = useMemo(() => booksQuery.data ?? [], [booksQuery.data]);
  const facets = useMemo(
    () => buildCatalogFacets(allBooks, filters),
    [allBooks, filters],
  );
  const results = useMemo(
    () => applyCatalogFilters(allBooks, filters),
    [allBooks, filters],
  );
  const activeFilterCount = countActiveCatalogFilters(filters);

  const totalBooks = results.length;
  const totalPages = Math.max(1, Math.ceil(totalBooks / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedBooks = results.slice(startIndex, startIndex + pageSize);
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

  const filterPanel = (
    <CatalogFilterPanel
      facets={facets}
      filters={filters}
      activeFilterCount={activeFilterCount}
      onChange={applyFilters}
      onReset={reset}
    />
  );

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

      {filters.search && (
        <Stack direction="row" spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
          <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
            {t('resultsFor', { term: filters.search })}
          </Typography>
          <Button size="small" onClick={() => applyFilters({ search: '' })}>
            {t('clearSearch')}
          </Button>
        </Stack>
      )}

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

      <Grid container spacing={3}>
        {isDesktop && (
          <Grid size={{ md: 4, lg: 3 }}>
            <Box sx={{ position: 'sticky', top: 84 }}>{filterPanel}</Box>
          </Grid>
        )}
        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <CatalogToolbar
            sort={filters.sort}
            totalResults={totalBooks}
            activeFilterCount={activeFilterCount}
            onSortChange={(sort) => applyFilters({ sort })}
            onOpenFilters={() => setFiltersOpen(true)}
          />

          <CatalogActiveFilterChips
            filters={filters}
            onChange={applyFilters}
            onReset={reset}
          />

          <BookGrid
            books={paginatedBooks}
            loading={booksQuery.isPending}
            emptyAction={
              activeFilterCount > 0
                ? { label: t('clearFilters'), onClick: reset }
                : undefined
            }
          />

          <CatalogPaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            totalBooks={totalBooks}
            onPageChange={handlePageChange}
            onPageSizeChange={setPageSize}
          />
        </Grid>
      </Grid>

      <CatalogFilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        onShowResults={() => setFiltersOpen(false)}
      >
        {filterPanel}
      </CatalogFilterDrawer>
    </Container>
  );
}
