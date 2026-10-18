import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_CATALOG_PAGE_SIZE } from '@/constants';
import type { CatalogFilters } from '@/modules/catalog/types';
import {
  buildCatalogSearchParams,
  createEmptyCatalogFilters,
  parseCatalogFilters,
  parseCatalogPagination,
} from '@/modules/catalog/utils/catalogFilters';

/**
 * Catalogue filter state, kept entirely in the URL so filters, sorting and
 * paging stay shareable, bookmarkable and back/forward friendly.
 */
export function useCatalogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => parseCatalogFilters(searchParams),
    [searchParams],
  );
  const pagination = useMemo(
    () => parseCatalogPagination(searchParams),
    [searchParams],
  );

  const applyFilters = useCallback(
    (patch: Partial<CatalogFilters>) => {
      const next = { ...parseCatalogFilters(searchParams), ...patch };
      setSearchParams(
        buildCatalogSearchParams(next, {
          ...parseCatalogPagination(searchParams),
          page: 1,
        }),
      );
    },
    [searchParams, setSearchParams],
  );

  const setPage = useCallback(
    (page: number) => {
      setSearchParams(
        buildCatalogSearchParams(parseCatalogFilters(searchParams), {
          ...parseCatalogPagination(searchParams),
          page,
        }),
      );
    },
    [searchParams, setSearchParams],
  );

  const setPageSize = useCallback(
    (pageSize: number) => {
      setSearchParams(
        buildCatalogSearchParams(parseCatalogFilters(searchParams), {
          page: 1,
          pageSize,
        }),
      );
    },
    [searchParams, setSearchParams],
  );

  const reset = useCallback(() => {
    setSearchParams(
      buildCatalogSearchParams(createEmptyCatalogFilters(), {
        page: 1,
        pageSize: DEFAULT_CATALOG_PAGE_SIZE,
      }),
    );
  }, [setSearchParams]);

  return {
    filters,
    page: pagination.page,
    pageSize: pagination.pageSize,
    applyFilters,
    setPage,
    setPageSize,
    reset,
  };
}
