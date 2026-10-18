import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface TableSearchFieldProps {
  value: string;
  /** Called on every keystroke; debounce upstream if the value drives a request. */
  onChange: (value: string) => void;
  /** Placeholder and accessible label for the field. */
  placeholder: string;
  disabled?: boolean;
}

/**
 * Filter input used above data tables. Mirrors the catalog `SearchBox`
 * (warm surface, rounded corners, trailing search icon) so search feels
 * consistent across the app.
 */
export function TableSearchField({
  value,
  onChange,
  placeholder,
  disabled = false,
}: TableSearchFieldProps) {
  const { t } = useTranslation();

  return (
    <TextField
      size="small"
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{
        htmlInput: { 'aria-label': placeholder },
        input: {
          endAdornment: (
            <InputAdornment position="end">
              {value && (
                <IconButton
                  edge="end"
                  size="small"
                  disabled={disabled}
                  aria-label={t('clearSearch')}
                  onClick={() => onChange('')}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              )}
              <SearchIcon
                fontSize="small"
                aria-hidden
                sx={{ color: 'text.secondary' }}
              />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        maxWidth: 400,
        '& .MuiOutlinedInput-root': {
          height: 38,
          bgcolor: '#fffaf0',
          borderRadius: 1,
          py: 0,
        },
      }}
    />
  );
}
