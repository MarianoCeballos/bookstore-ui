import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { TableLoader } from '@/components/TableLoader';

export type DataTableSortDirection = 'asc' | 'desc';

/**
 * Identifier for a column, also used as its React key.
 *
 * The row's own string keys are offered for autocompletion, but synthetic
 * columns that have no backing field (for example an `actions` column, or a
 * column rendering `items.length`) may use any identifier.
 *
 * `Record<never, never>` keeps the row keys in the union while still allowing
 * arbitrary strings; unlike `string & {}` it does not trip
 * `@typescript-eslint/no-empty-object-type`.
 */
export type DataTableColumnId<T extends Record<string, unknown>> =
  | Extract<keyof T, string>
  | (string & Record<never, never>);

export interface DataTableColumn<T extends Record<string, unknown>> {
  /** Stable identifier, also used as the React key for the column. */
  id: DataTableColumnId<T>;
  label: string;
  align?: 'left' | 'center' | 'right';
  /** Provide a value to make the column sortable. */
  sortValue?: (row: T) => string | number | null | undefined;
  /** Cell content for a row. Falls back to the column's `sortValue`. */
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T, index: number) => string | number;
  loading?: boolean;
  emptyMessage?: string;
  /** `plain` drops the table's own outlined surface so it can sit inside a card. */
  variant?: 'outlined' | 'plain';
  /** Column to sort by before the user interacts with the headers. */
  defaultSort?: {
    columnId: DataTableColumnId<T>;
    direction: DataTableSortDirection;
  };
}

function compareValues(
  a: string | number | null | undefined,
  b: string | number | null | undefined,
): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  getRowKey,
  loading = false,
  emptyMessage,
  variant = 'outlined',
  defaultSort,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const [sort, setSort] = useState<{
    columnId: DataTableColumnId<T>;
    direction: DataTableSortDirection;
  } | null>(defaultSort ?? null);

  const activeSortValue = sort
    ? columns.find((column) => column.id === sort.columnId)?.sortValue
    : undefined;

  const sortedRows = useMemo(() => {
    if (!sort || !activeSortValue) return rows;
    const factor = sort.direction === 'asc' ? 1 : -1;
    return [...rows].sort(
      (a, b) => factor * compareValues(activeSortValue(a), activeSortValue(b)),
    );
  }, [rows, sort, activeSortValue]);

  const handleSort = (columnId: DataTableColumnId<T>) => {
    setSort((current) =>
      current?.columnId === columnId
        ? {
            columnId,
            direction: current.direction === 'asc' ? 'desc' : 'asc',
          }
        : { columnId, direction: 'asc' },
    );
  };

  return (
    <Paper
      variant="outlined"
      elevation={0}
      sx={{
        position: 'relative',
        overflowX: 'auto',
        borderRadius: 2,
        ...(variant === 'plain' ? { border: 'none' } : {}),
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'rgba(239, 227, 202, 0.45)' }}>
            {columns.map((column) => {
              const isActive = sort?.columnId === column.id;
              const direction = isActive ? sort.direction : 'asc';
              return (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sortDirection={isActive ? direction : false}
                  sx={{ fontWeight: 700, py: 1.5, whiteSpace: 'nowrap' }}
                >
                  {column.sortValue ? (
                    <TableSortLabel
                      active={isActive}
                      direction={direction}
                      onClick={() => handleSort(column.id)}
                      aria-label={t('sortByColumn', { column: column.label })}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading &&
            Array.from({ length: 5 }, (_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`} sx={{ opacity: 0.55 }}>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    <Skeleton variant="text" height={28} />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!loading &&
            sortedRows.map((row, index) => (
              <TableRow
                key={getRowKey(row, index)}
                hover
                sx={{ '& td': { transition: 'background-color 150ms ease' } }}
              >
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    {column.render
                      ? column.render(row)
                      : (column.sortValue?.(row) ?? null)}
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!loading && rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                sx={{ py: 4, textAlign: 'center' }}
              >
                <Typography variant="body2" color="text.secondary">
                  {emptyMessage ?? t('noRecords')}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {loading && <TableLoader />}
    </Paper>
  );
}
