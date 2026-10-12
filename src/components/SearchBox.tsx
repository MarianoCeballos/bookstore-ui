import { useState } from 'react';
import {
  Autocomplete,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Book } from '@/interfaces/models';
import { useBooks } from '@/modules/catalog/hooks/useBooks';
import { useDebouncedValue } from '@/modules/catalog/hooks/useDebouncedValue';

const MAX_SUGGESTIONS = 3;

export default function SearchBox() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const urlSearch =
    location.pathname === '/books' ? (searchParams.get('search') ?? '') : '';
  const [input, setInput] = useState(urlSearch);
  const [syncedUrl, setSyncedUrl] = useState(urlSearch);
  if (syncedUrl !== urlSearch) {
    setSyncedUrl(urlSearch);
    setInput(urlSearch);
  }
  const debounced = useDebouncedValue(input.trim(), 350);

  const { data = [] } = useBooks(
    { title: debounced, page: 1, pageSize: MAX_SUGGESTIONS },
    debounced.length >= 2,
  );
  const options = debounced.length >= 2 ? data.slice(0, MAX_SUGGESTIONS) : [];

  const submit = (value: string) => {
    const term = value.trim();
    navigate(`/books${term ? `?search=${encodeURIComponent(term)}` : ''}`);
  };

  return (
    <Autocomplete<Book, false, false, true>
      freeSolo
      size="small"
      fullWidth
      options={options}
      filterOptions={(items) => items}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.title
      }
      inputValue={input}
      onInputChange={(_, value, reason) => {
        if (reason !== 'reset') setInput(value);
      }}
      onChange={(_, value) => {
        if (!value) return;
        if (typeof value === 'string') submit(value);
        else navigate(`/books/${value.ID}`);
      }}
      renderOption={({ key, ...props }, option) => (
        <Box
          component="li"
          key={key}
          {...props}
          sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}
        >
          <Box
            component="img"
            src={option.image}
            alt=""
            sx={{
              width: 40,
              height: 56,
              objectFit: 'cover',
              borderRadius: 0.5,
              flexShrink: 0,
            }}
          />
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap>{option.title}</Typography>
            {option.authors?.length > 0 && (
              <Typography variant="caption" color="text.secondary" noWrap>
                {option.authors.join(', ')}
              </Typography>
            )}
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t('search')}
          slotProps={{
            ...params.slotProps,
            htmlInput: {
              ...params.slotProps.htmlInput,
              'aria-label': t('search'),
            },
            input: {
              ...params.slotProps.input,
              endAdornment: (
                <>
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      aria-label={t('search')}
                      onClick={() => submit(input)}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      sx={{
        '& .MuiOutlinedInput-root': {
          height: 38,
          bgcolor: '#fffaf0',
          borderRadius: 1,
          py: 0,
        },
        '& .MuiAutocomplete-popupIndicator': { display: 'none' },
      }}
    />
  );
}
