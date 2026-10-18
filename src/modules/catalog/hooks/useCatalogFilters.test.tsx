import { act, renderHook } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import { useCatalogFilters } from '@/modules/catalog/hooks/useCatalogFilters';

function setup(url = '/books') {
  return renderHook(
    () => ({
      ...useCatalogFilters(),
      location: useLocation(),
      navigate: useNavigate(),
    }),
    {
      wrapper: ({ children }: PropsWithChildren) => (
        <MemoryRouter initialEntries={[url]}>{children}</MemoryRouter>
      ),
    },
  );
}

describe('useCatalogFilters', () => {
  it('initializes filters and pagination from the URL', () => {
    const { result } = setup(
      '/books?search=dune&category=Sci-Fi&page=3&pageSize=24&sort=price-asc',
    );
    expect(result.current.filters).toMatchObject({
      search: 'dune',
      categories: ['Sci-Fi'],
      sort: 'price-asc',
    });
    expect(result.current.page).toBe(3);
    expect(result.current.pageSize).toBe(24);
  });

  it('resets the page when filters change while preserving page size and other filters', () => {
    const { result } = setup(
      '/books?search=dune&category=Sci-Fi&page=3&pageSize=24',
    );
    act(() => result.current.applyFilters({ minRating: 4 }));
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(24);
    expect(result.current.filters).toMatchObject({
      search: 'dune',
      categories: ['Sci-Fi'],
      minRating: 4,
    });
    expect(
      new URLSearchParams(result.current.location.search).has('page'),
    ).toBe(false);
  });

  it('preserves filters when changing page and resets to page one on size changes', () => {
    const { result } = setup('/books?category=Sci-Fi');
    act(() => result.current.setPage(4));
    expect(result.current.page).toBe(4);
    expect(result.current.filters.categories).toEqual(['Sci-Fi']);
    act(() => result.current.setPageSize(48));
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(48);
    expect(result.current.filters.categories).toEqual(['Sci-Fi']);
  });

  it('clears filters, sorting, and pagination back to the canonical URL', () => {
    const { result } = setup(
      '/books?search=dune&category=Sci-Fi&sort=popular&page=3&pageSize=24',
    );
    act(() => result.current.reset());
    expect(result.current.location.search).toBe('');
    expect(result.current.page).toBe(1);
    expect(result.current.pageSize).toBe(12);
    expect(result.current.filters).toMatchObject({
      search: '',
      categories: [],
      sort: 'relevance',
    });
  });

  it('restores filters and page through browser back and forward navigation', () => {
    const { result } = setup('/books?category=Classics&page=2');
    act(() => result.current.applyFilters({ categories: ['Sci-Fi'] }));
    act(() => result.current.navigate(-1));
    expect(result.current.page).toBe(2);
    expect(result.current.filters.categories).toEqual(['Classics']);
    act(() => result.current.navigate(1));
    expect(result.current.page).toBe(1);
    expect(result.current.filters.categories).toEqual(['Sci-Fi']);
  });
});
