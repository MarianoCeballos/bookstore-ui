import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export interface TableLoaderProps {
  /** Caption under the spinner; defaults to the table-specific copy. */
  label?: string;
  /** Extra styles for the overlay. */
  sx?: SxProps<Theme>;
}

/**
 * Translucent overlay spinner for a table that is fetching its rows. The parent
 * must establish a positioning context (`position: relative`).
 */
export function TableLoader({ label, sx }: TableLoaderProps) {
  const { t } = useTranslation();

  return (
    <Box
      aria-busy="true"
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 'inherit',
        bgcolor: 'rgba(255, 250, 240, 0.7)',
        backdropFilter: 'blur(1.5px)',
        ...sx,
      }}
    >
      <LoadingSpinner
        size={36}
        thickness={3.5}
        label={label ?? t('loadingData')}
      />
    </Box>
  );
}

export default TableLoader;
