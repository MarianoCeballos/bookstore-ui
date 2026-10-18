import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { CatalogFilters } from '@/modules/catalog/types';
import { formatCurrency, formatNumber } from '@/utils/format';

interface CatalogActiveFilterChipsProps {
  filters: CatalogFilters;
  onChange: (patch: Partial<CatalogFilters>) => void;
  onReset: () => void;
}

interface ActiveChip {
  key: string;
  label: string;
  onDelete: () => void;
}

export function CatalogActiveFilterChips({
  filters,
  onChange,
  onReset,
}: CatalogActiveFilterChipsProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const chips: ActiveChip[] = [];

  const addListChips = (
    key: keyof CatalogFilters,
    values: string[],
    label: (value: string) => string = (value) => value,
  ) => {
    values.forEach((value) =>
      chips.push({
        key: `${key}:${value}`,
        label: label(value),
        onDelete: () =>
          onChange({
            [key]: values.filter((entry) => entry !== value),
          } as Partial<CatalogFilters>),
      }),
    );
  };

  addListChips('categories', filters.categories);
  addListChips('authors', filters.authors);
  addListChips('languages', filters.languages, (value) =>
    t('filterValueWithLabel', { label: t('language'), value }),
  );
  addListChips('publishers', filters.publishers, (value) =>
    t('filterValueWithLabel', { label: t('publisher'), value }),
  );

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    const priceLabel =
      filters.minPrice !== null && filters.maxPrice !== null
        ? t('priceBetween', {
            min: formatCurrency(filters.minPrice, locale),
            max: formatCurrency(filters.maxPrice, locale),
          })
        : filters.minPrice !== null
          ? t('priceFrom', { price: formatCurrency(filters.minPrice, locale) })
          : t('priceUpTo', {
              price: formatCurrency(filters.maxPrice, locale),
            });
    chips.push({
      key: 'price',
      label: priceLabel,
      onDelete: () => onChange({ minPrice: null, maxPrice: null }),
    });
  }

  if (filters.minRating !== null) {
    chips.push({
      key: 'rating',
      label: t('ratingAndUp', {
        rating: formatNumber(filters.minRating, locale),
      }),
      onDelete: () => onChange({ minRating: null }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <Box sx={{ mb: 2 }}>
      <Stack
        direction="row"
        useFlexGap
        spacing={1}
        sx={{ alignItems: 'center', flexWrap: 'wrap' }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {t('activeFilters')}
        </Typography>
        {chips.map((chip) => (
          <Chip
            key={chip.key}
            size="small"
            label={chip.label}
            onDelete={chip.onDelete}
          />
        ))}
        <Button
          size="small"
          startIcon={<RestartAltRoundedIcon fontSize="small" />}
          onClick={onReset}
        >
          {t('clearFilters')}
        </Button>
      </Stack>
    </Box>
  );
}
