import { Box, Stack, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

/** Rotates the comet (gradient arc plus its head) around the track. */
const spin = keyframes`
  from {
    transform: rotate(0turn);
  }
  to {
    transform: rotate(1turn);
  }
`;

export interface LoadingSpinnerProps {
  /** Diameter of the ring in pixels. */
  size?: number;
  /** Stroke width of the ring in pixels. */
  thickness?: number;
  /** Caption rendered under the ring and used as the accessible name. */
  label?: string;
  /** Arc color; defaults to the theme's primary color. */
  color?: string;
  /** Extra styles for the wrapping stack. */
  sx?: SxProps<Theme>;
}

/**
 * Themed indeterminate spinner: a faint track ring with a rotating gradient
 * comet in the storefront's brown palette.
 *
 * Uses a plain box with `role="progressbar"` rather than MUI's
 * `CircularProgress` so track, comet and caption stay in one visual unit while
 * keeping the accessible progressbar semantics.
 */
export function LoadingSpinner({
  size = 48,
  thickness = 5,
  label,
  color,
  sx,
}: LoadingSpinnerProps) {
  const { t } = useTranslation();
  const accessibleLabel = label ?? t('loading');
  // Punches a ring-shaped hole out of the filled conic gradient.
  const ringMask = `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness}px))`;

  return (
    <Stack
      spacing={1.75}
      sx={{ alignItems: 'center', justifyContent: 'center', ...sx }}
    >
      <Box
        role="progressbar"
        aria-label={accessibleLabel}
        sx={{ position: 'relative', width: size, height: size }}
      >
        <Box
          aria-hidden="true"
          sx={(theme) => ({
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: theme.palette.divider,
            mask: ringMask,
            WebkitMask: ringMask,
          })}
        />
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            inset: 0,
            animation: `${spin} 900ms cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite`,
          }}
        >
          <Box
            sx={(theme) => {
              const arc = color ?? theme.palette.primary.main;
              return {
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                // Opaque at the top of the ring (where the head dot sits) and
                // fading out counter-clockwise, so it reads as a sweeping arc.
                background: `conic-gradient(from 0turn, transparent 0turn, transparent 0.58turn, ${arc} 1turn)`,
                mask: ringMask,
                WebkitMask: ringMask,
              };
            }}
          />
          <Box
            sx={(theme) => ({
              position: 'absolute',
              top: thickness / 2,
              left: '50%',
              width: thickness * 1.05,
              height: thickness * 1.05,
              borderRadius: '50%',
              bgcolor: color ?? theme.palette.primary.main,
              transform: 'translate(-50%, -50%)',
            })}
          />
        </Box>
      </Box>
      {label ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 600 }}
        >
          {label}
        </Typography>
      ) : null}
    </Stack>
  );
}

export default LoadingSpinner;
