import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import { Box, Typography, type SxProps, type Theme } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface BookCoverProps {
  src?: string | null;
  title: string;
  author?: string;
  variant?: 'card' | 'hero' | 'compact';
  className?: string;
  sx?: SxProps<Theme>;
}

export function BookCover({
  src,
  title,
  author,
  variant = 'card',
  className,
  sx,
}: BookCoverProps) {
  const { t } = useTranslation();
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const trimmedSrc = src?.trim() ?? '';
  const hasValidImage = Boolean(trimmedSrc) && failedSrc !== trimmedSrc;

  if (hasValidImage) {
    return (
      <Box
        component="img"
        src={trimmedSrc}
        alt={t('bookCover', { title })}
        loading="lazy"
        onError={() => setFailedSrc(trimmedSrc)}
        className={className}
        sx={{
          display: 'block',
          objectFit: 'contain',
          bgcolor: '#efe3ca',
          ...sx,
        }}
      />
    );
  }

  const isHero = variant === 'hero';
  const isCompact = variant === 'compact';

  return (
    <Box
      role="img"
      aria-label={t('bookCover', { title })}
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: isCompact ? 1 : isHero ? 3 : 1.5,
        bgcolor: '#efe3ca',
        backgroundImage:
          'linear-gradient(145deg, rgba(255,250,240,0.65) 0%, rgba(223,201,154,0.85) 100%)',
        border: '1px solid rgba(103, 69, 51, 0.22)',
        color: 'text.primary',
        userSelect: 'none',
        boxSizing: 'border-box',
        ...sx,
      }}
    >
      <MenuBookRoundedIcon
        sx={{
          fontSize: isCompact ? 22 : isHero ? 48 : 28,
          color: 'primary.main',
          mb: isCompact ? 0.25 : 1,
          opacity: 0.85,
        }}
      />
      {!isCompact && (
        <>
          <Typography
            component="span"
            variant={isHero ? 'subtitle1' : 'caption'}
            sx={{
              fontWeight: 700,
              display: '-webkit-box',
              WebkitLineClamp: isHero ? 3 : 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.25,
              px: 0.5,
            }}
          >
            {title}
          </Typography>
          {author && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                mt: 0.5,
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {author}
            </Typography>
          )}
          {isHero && (
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ mt: 1.5, letterSpacing: '0.08em', fontSize: '0.68rem' }}
            >
              {t('noCoverAvailable')}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
