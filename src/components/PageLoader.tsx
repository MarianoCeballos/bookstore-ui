import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export interface PageLoaderProps {
  /** Caption under the spinner; defaults to the generic "Loading…" copy. */
  label?: string;
  /** Diameter of the spinner ring in pixels. */
  size?: number;
  /** Minimum height of the loading area, so the layout does not jump. */
  minHeight?: number | string;
  /** Extra styles for the centering wrapper. */
  sx?: SxProps<Theme>;
}

/**
 * Full-page / full-section loading state: the themed spinner centered in a
 * reserved block of vertical space, with a caption explaining what is loading.
 */
export function PageLoader({
  label,
  size = 52,
  minHeight = 280,
  sx,
}: PageLoaderProps) {
  const { t } = useTranslation();

  return (
    <Box
      aria-busy="true"
      sx={{
        display: 'grid',
        placeItems: 'center',
        minHeight,
        px: 2,
        py: 4,
        ...sx,
      }}
    >
      <LoadingSpinner size={size} label={label ?? t('loading')} />
    </Box>
  );
}

export default PageLoader;
