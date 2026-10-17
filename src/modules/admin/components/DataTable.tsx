import {
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface DataTableProps {
  headers: string[];
  rows: ReactNode[][];
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable({
  headers,
  rows,
  loading = false,
  emptyMessage,
}: DataTableProps) {
  const { t } = useTranslation();

  return (
    <Paper variant="outlined" sx={{ overflowX: 'auto', borderRadius: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ bgcolor: 'rgba(239, 227, 202, 0.45)' }}>
            {headers.map((header) => (
              <TableCell key={header} sx={{ fontWeight: 700, py: 1.5 }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading &&
            Array.from({ length: 5 }, (_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`}>
                {headers.map((header) => (
                  <TableCell key={header}>
                    <Skeleton variant="text" height={28} />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!loading &&
            rows.map((row, index) => (
              <TableRow key={index} hover>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}

          {!loading && rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={headers.length}
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
    </Paper>
  );
}
