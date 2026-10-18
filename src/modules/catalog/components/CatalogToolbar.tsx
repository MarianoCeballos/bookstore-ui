import SortRoundedIcon from '@mui/icons-material/SortRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import {
  Badge,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CATALOG_SORT_LABEL_KEYS,
  CATALOG_SORT_OPTIONS,
  type CatalogSortOption,
} from '@/modules/catalog/constants';

interface CatalogToolbarProps {
  sort: CatalogSortOption;
  totalResults: number;
  activeFilterCount: number;
  onSortChange: (sort: CatalogSortOption) => void;
  onOpenFilters: () => void;
}

export function CatalogToolbar({
  sort,
  totalResults,
  activeFilterCount,
  onSortChange,
  onOpenFilters,
}: CatalogToolbarProps) {
  const { t } = useTranslation();
  const sortLabelId = useId();

  return (
    <Paper
      variant="outlined"
      elevation={0}
      sx={{
        p: 1.5,
        mb: 2,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1.5,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 2,
        bgcolor: '#fffaf0',
        borderColor: 'rgba(103, 69, 51, 0.25)',
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Badge
          color="primary"
          badgeContent={activeFilterCount}
          invisible={activeFilterCount === 0}
          sx={{ display: { xs: 'inline-flex', md: 'none' } }}
        >
          <Button
            size="small"
            variant="outlined"
            startIcon={<TuneRoundedIcon fontSize="small" />}
            onClick={onOpenFilters}
          >
            {t('filters')}
          </Button>
        </Badge>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 600 }}
        >
          {t('resultsCount', { count: totalResults })}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <SortRoundedIcon
          fontSize="small"
          sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}
        />
        <FormControl size="small" sx={{ minWidth: { xs: 152, sm: 210 } }}>
          <InputLabel id={sortLabelId}>{t('sortBy')}</InputLabel>
          <Select
            labelId={sortLabelId}
            label={t('sortBy')}
            value={sort}
            onChange={(event) =>
              onSortChange(event.target.value as CatalogSortOption)
            }
          >
            {CATALOG_SORT_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {t(CATALOG_SORT_LABEL_KEYS[option])}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
}
