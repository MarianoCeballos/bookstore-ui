import {
  Box,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE_OPTIONS = [8, 12, 24, 48] as const;

interface CatalogPaginationBarProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  rangeStart: number;
  rangeEnd: number;
  totalBooks: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function CatalogPaginationBar({
  currentPage,
  totalPages,
  pageSize,
  rangeStart,
  rangeEnd,
  totalBooks,
  onPageChange,
  onPageSizeChange,
}: CatalogPaginationBarProps) {
  const { t } = useTranslation();

  if (totalBooks === 0) {
    return null;
  }

  return (
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
        onChange={(_, value) => onPageChange(value)}
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
              bgcolor: '#4a2f22',
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
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
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
  );
}
