import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  FormGroup,
  Paper,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useId, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CATALOG_FILTER_VISIBLE_LIMIT,
  CATALOG_RATING_FILTERS,
} from '@/modules/catalog/constants';
import type {
  CatalogFacetOption,
  CatalogFacets,
  CatalogFilters,
} from '@/modules/catalog/types';
import { formatNumber } from '@/utils/format';

interface CatalogFilterPanelProps {
  facets: CatalogFacets;
  filters: CatalogFilters;
  activeFilterCount: number;
  onChange: (patch: Partial<CatalogFilters>) => void;
  onReset: () => void;
}

const toggleValue = (values: string[], value: string): string[] => {
  const needle = value.toLowerCase();
  return values.some((entry) => entry.toLowerCase() === needle)
    ? values.filter((entry) => entry.toLowerCase() !== needle)
    : [...values, value];
};

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Box component="section">
      <Typography
        variant="overline"
        component="h3"
        sx={{
          display: 'block',
          mb: 0.75,
          fontWeight: 700,
          letterSpacing: '0.06em',
          color: 'text.secondary',
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

interface FacetCheckboxListProps {
  options: CatalogFacetOption[];
  selected: string[];
  onToggle: (value: string) => void;
  searchable?: boolean;
  searchLabel?: string;
}

function FacetCheckboxList({
  options,
  selected,
  onToggle,
  searchable = false,
  searchLabel,
}: FacetCheckboxListProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const needle = query.trim().toLowerCase();

  const matches = useMemo(
    () =>
      needle
        ? options.filter((option) =>
            option.value.toLowerCase().includes(needle),
          )
        : options,
    [needle, options],
  );

  const isSearching = needle.length > 0;
  const isExpanded = expanded || isSearching;
  const visible = isExpanded
    ? matches
    : matches.slice(0, CATALOG_FILTER_VISIBLE_LIMIT);

  return (
    <Stack spacing={1}>
      {searchable && (
        <TextField
          size="small"
          fullWidth
          value={query}
          label={searchLabel}
          onChange={(event) => setQuery(event.target.value)}
          slotProps={{ htmlInput: { 'aria-label': searchLabel } }}
        />
      )}

      {matches.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t('noFilterOptions')}
        </Typography>
      ) : (
        <FormGroup sx={{ gap: 0.25 }}>
          {visible.map((option) => {
            const checked = selected.some(
              (entry) => entry.toLowerCase() === option.value.toLowerCase(),
            );
            const unavailable = !checked && option.count === 0;
            return (
              <FormControlLabel
                key={option.value}
                sx={{
                  mx: 0,
                  alignItems: 'center',
                  '& .MuiFormControlLabel-label': { minWidth: 0, flex: 1 },
                }}
                control={
                  <Checkbox
                    size="small"
                    checked={checked}
                    disabled={unavailable}
                    onChange={() => onToggle(option.value)}
                  />
                }
                label={
                  <Stack
                    direction="row"
                    spacing={0.75}
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      variant="body2"
                      noWrap
                      title={option.value}
                      sx={{
                        fontWeight: checked ? 700 : 500,
                        color: unavailable ? 'text.disabled' : 'text.primary',
                      }}
                    >
                      {option.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontWeight: 600, flexShrink: 0 }}
                    >
                      {formatNumber(option.count)}
                    </Typography>
                  </Stack>
                }
              />
            );
          })}
        </FormGroup>
      )}

      {!isSearching && !expanded && matches.length > visible.length && (
        <Button
          size="small"
          onClick={() => setExpanded(true)}
          sx={{ alignSelf: 'flex-start' }}
        >
          {t('showAll', { count: formatNumber(matches.length) })}
        </Button>
      )}

      {!isSearching &&
        expanded &&
        matches.length > CATALOG_FILTER_VISIBLE_LIMIT && (
          <Button
            size="small"
            onClick={() => setExpanded(false)}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('showLess')}
          </Button>
        )}
    </Stack>
  );
}

interface PriceRangeFilterProps {
  bounds: { min: number; max: number };
  minPrice: number | null;
  maxPrice: number | null;
  onChange: (patch: Partial<CatalogFilters>) => void;
}

function PriceRangeFilter({
  bounds,
  minPrice,
  maxPrice,
  onChange,
}: PriceRangeFilterProps) {
  const { t } = useTranslation();
  const lower = minPrice ?? bounds.min;
  const upper = maxPrice ?? bounds.max;
  const [range, setRange] = useState<[number, number]>([lower, upper]);
  const [synced, setSynced] = useState<[number, number]>([lower, upper]);

  // Typed values stay local until blur/Enter, so typing does not push a
  // history entry (and reset the page to 1) on every keystroke. `source`
  // records the committed values the draft came from, which lets the visible
  // text fall back to the URL whenever it changes under us.
  const minText = minPrice === null ? '' : String(minPrice);
  const maxText = maxPrice === null ? '' : String(maxPrice);
  const [draft, setDraft] = useState({
    min: minText,
    max: maxText,
    source: [minPrice, maxPrice] as [number | null, number | null],
  });
  const displayed =
    draft.source[0] === minPrice && draft.source[1] === maxPrice
      ? { min: draft.min, max: draft.max }
      : { min: minText, max: maxText };

  // Keep the slider in step with the URL without an effect.
  if (synced[0] !== lower || synced[1] !== upper) {
    setSynced([lower, upper]);
    setRange([lower, upper]);
  }

  const commit = ([nextMin, nextMax]: [number, number]) => {
    onChange({
      minPrice: nextMin <= bounds.min ? null : nextMin,
      maxPrice: nextMax >= bounds.max ? null : nextMax,
    });
  };

  const commitInput = (key: 'minPrice' | 'maxPrice') => {
    const field = key === 'minPrice' ? 'min' : 'max';
    const raw = displayed[field].trim();
    const parsed = raw === '' ? null : Number(raw);
    const next =
      parsed !== null && Number.isFinite(parsed)
        ? Math.max(0, Math.round(parsed))
        : null;
    const text = next === null ? '' : String(next);
    setDraft({
      min: field === 'min' ? text : displayed.min,
      max: field === 'max' ? text : displayed.max,
      source: [minPrice, maxPrice],
    });
    if (next !== (field === 'min' ? minPrice : maxPrice)) {
      onChange({ [key]: next });
    }
  };

  return (
    <Stack spacing={1.5}>
      <Slider
        value={range}
        min={bounds.min}
        max={bounds.max}
        step={1}
        disableSwap
        valueLabelDisplay="auto"
        getAriaLabel={(index) => (index === 0 ? t('priceMin') : t('priceMax'))}
        onChange={(_, value) => setRange(value as [number, number])}
        onChangeCommitted={(_, value) => commit(value as [number, number])}
      />
      <Stack direction="row" spacing={1}>
        <TextField
          size="small"
          type="number"
          fullWidth
          label={t('priceMin')}
          value={displayed.min}
          onChange={(event) =>
            setDraft({
              min: event.target.value,
              max: displayed.max,
              source: [minPrice, maxPrice],
            })
          }
          onBlur={() => commitInput('minPrice')}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commitInput('minPrice');
          }}
          slotProps={{
            htmlInput: {
              min: bounds.min,
              max: bounds.max,
              'aria-label': t('priceMin'),
            },
          }}
        />
        <TextField
          size="small"
          type="number"
          fullWidth
          label={t('priceMax')}
          value={displayed.max}
          onChange={(event) =>
            setDraft({
              min: displayed.min,
              max: event.target.value,
              source: [minPrice, maxPrice],
            })
          }
          onBlur={() => commitInput('maxPrice')}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commitInput('maxPrice');
          }}
          slotProps={{
            htmlInput: {
              min: bounds.min,
              max: bounds.max,
              'aria-label': t('priceMax'),
            },
          }}
        />
      </Stack>
    </Stack>
  );
}

export function CatalogFilterPanel({
  facets,
  filters,
  activeFilterCount,
  onChange,
  onReset,
}: CatalogFilterPanelProps) {
  const { t, i18n } = useTranslation();
  const headingId = useId();
  const locale = i18n.language;

  return (
    <Paper
      component="section"
      variant="outlined"
      elevation={0}
      aria-labelledby={headingId}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: '#fffaf0',
        borderColor: 'rgba(103, 69, 51, 0.25)',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 1.5,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <TuneRoundedIcon fontSize="small" color="primary" />
          <Typography
            id={headingId}
            variant="h6"
            sx={{ fontSize: '1.05rem', fontWeight: 700 }}
          >
            {t('filters')}
          </Typography>
          {activeFilterCount > 0 && (
            <Chip
              size="small"
              color="primary"
              label={formatNumber(activeFilterCount)}
              sx={{ height: 20, fontSize: '0.72rem' }}
            />
          )}
        </Stack>
        <Button
          size="small"
          startIcon={<RestartAltRoundedIcon fontSize="small" />}
          onClick={onReset}
          disabled={activeFilterCount === 0}
        >
          {t('clearFilters')}
        </Button>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={2.5}>
        {facets.categories.length > 0 && (
          <FilterSection title={t('categoriesTitle')}>
            <FacetCheckboxList
              options={facets.categories}
              selected={filters.categories}
              searchable
              searchLabel={t('searchCategories')}
              onToggle={(value) =>
                onChange({ categories: toggleValue(filters.categories, value) })
              }
            />
          </FilterSection>
        )}

        {facets.authors.length > 0 && (
          <FilterSection title={t('authorsTitle')}>
            <FacetCheckboxList
              options={facets.authors}
              selected={filters.authors}
              searchable
              searchLabel={t('searchAuthors')}
              onToggle={(value) =>
                onChange({ authors: toggleValue(filters.authors, value) })
              }
            />
          </FilterSection>
        )}

        {facets.languages.length > 1 && (
          <FilterSection title={t('language')}>
            <FacetCheckboxList
              options={facets.languages}
              selected={filters.languages}
              onToggle={(value) =>
                onChange({ languages: toggleValue(filters.languages, value) })
              }
            />
          </FilterSection>
        )}

        {facets.publishers.length > 1 && (
          <FilterSection title={t('publisher')}>
            <FacetCheckboxList
              options={facets.publishers}
              selected={filters.publishers}
              searchable
              searchLabel={t('searchPublishers')}
              onToggle={(value) =>
                onChange({ publishers: toggleValue(filters.publishers, value) })
              }
            />
          </FilterSection>
        )}

        {facets.priceBounds.max > facets.priceBounds.min && (
          <FilterSection title={t('priceRange')}>
            <PriceRangeFilter
              bounds={facets.priceBounds}
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onChange={onChange}
            />
          </FilterSection>
        )}

        <FilterSection title={t('minimumRating')}>
          <RadioGroup
            value={filters.minRating === null ? '' : String(filters.minRating)}
            onChange={(event) =>
              onChange({
                minRating:
                  event.target.value === '' ? null : Number(event.target.value),
              })
            }
          >
            <FormControlLabel
              value=""
              control={<Radio size="small" />}
              label={<Typography variant="body2">{t('anyRating')}</Typography>}
            />
            {CATALOG_RATING_FILTERS.map((rating) => (
              <FormControlLabel
                key={rating}
                value={String(rating)}
                control={<Radio size="small" />}
                label={
                  <Typography variant="body2">
                    {t('ratingAndUp', { rating: formatNumber(rating, locale) })}
                  </Typography>
                }
              />
            ))}
          </RadioGroup>
        </FilterSection>
      </Stack>
    </Paper>
  );
}
