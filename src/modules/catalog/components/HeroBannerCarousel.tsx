import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Box,
  Button,
  IconButton,
  useMediaQuery,
  type SxProps,
  type Theme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import banner from '@/assets/banner.jpg';
import bannerB from '@/assets/bannerB.jpg';
import bannerC from '@/assets/bannerC.jpg';
import bannerD from '@/assets/bannerD.jpg';
import bannerE from '@/assets/bannerE.jpg';
import { HERO_AUTOPLAY_INTERVAL_MS, ROUTES } from '@/constants';

const banners = [banner, bannerB, bannerC, bannerD, bannerE];

const arrowSx: SxProps<Theme> = {
  color: '#fffaf0',
  bgcolor: 'rgb(30 17 11 / 52%)',
  backdropFilter: 'blur(6px)',
  border: '1px solid rgb(255 250 240 / 26%)',
  transition:
    'background-color 180ms ease, transform 180ms ease, border-color 180ms ease',
  '&:hover': {
    bgcolor: 'rgb(30 17 11 / 82%)',
    borderColor: 'rgb(255 250 240 / 45%)',
    transform: 'scale(1.06)',
  },
};

export function HeroBannerCarousel() {
  const { t } = useTranslation();
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = useMediaQuery(
    '(prefers-reduced-motion: reduce)',
  );

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return;
    const timer = window.setInterval(() => {
      setBannerIndex((index) => (index + 1) % banners.length);
    }, HERO_AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isPaused, prefersReducedMotion]);

  const goToBanner = (next: number) => {
    setBannerIndex(((next % banners.length) + banners.length) % banners.length);
  };

  return (
    <Box
      className="home-banner"
      role="region"
      aria-roledescription={t('carousel')}
      aria-label={t('heroCarousel')}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {banners.map((bannerItem, index) => {
        const isActive = index === bannerIndex;
        return (
          <Box
            key={bannerItem}
            component="img"
            className={`home-banner__slide${isActive ? ' is-active' : ''}`}
            src={bannerItem}
            alt={isActive ? t('featuredBanner', { number: index + 1 }) : ''}
            aria-hidden={!isActive}
            draggable={false}
            loading={index === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        );
      })}

      <Box className="home-banner__scrim" aria-hidden />

      <Box className="home-banner__counter" aria-hidden>
        {bannerIndex + 1}
        <Box component="span" sx={{ opacity: 0.5 }}>
          {' '}
          / {banners.length}
        </Box>
      </Box>

      <Box className="home-banner__controls">
        <IconButton
          aria-label={t('previousBanner')}
          onClick={() => goToBanner(bannerIndex - 1)}
          sx={arrowSx}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          aria-label={t('nextBanner')}
          onClick={() => goToBanner(bannerIndex + 1)}
          sx={arrowSx}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>

      <Box className="home-banner__footer">
        <Box className="home-banner__dots">
          {banners.map((bannerItem, index) => {
            const isSelected = index === bannerIndex;
            return (
              <IconButton
                key={bannerItem}
                aria-label={t('showBanner', { number: index + 1 })}
                aria-current={isSelected ? 'true' : undefined}
                onClick={() => goToBanner(index)}
                size="small"
                sx={{ p: 0.5 }}
              >
                <Box
                  sx={{
                    width: isSelected ? 26 : 10,
                    height: 10,
                    borderRadius: 999,
                    bgcolor: isSelected ? '#ddb577' : 'rgb(255 250 240 / 60%)',
                    border: '1.5px solid rgb(103 69 51 / 65%)',
                    transition:
                      'width 320ms cubic-bezier(0.4, 0, 0.2, 1), background-color 320ms ease',
                  }}
                />
              </IconButton>
            );
          })}
        </Box>
        <Button
          component={Link}
          to={ROUTES.BOOKS}
          variant="contained"
          size="large"
          sx={{ boxShadow: '0 8px 20px rgb(30 17 11 / 30%)' }}
        >
          {t('explore')}
        </Button>
      </Box>
    </Box>
  );
}
