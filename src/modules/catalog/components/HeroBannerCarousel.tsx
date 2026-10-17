import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, Button, IconButton, Stack, useMediaQuery } from '@mui/material';
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

  return (
    <Box
      className="home-banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <Box
        component="img"
        src={banners[bannerIndex]}
        alt={t('featuredBanner', { number: bannerIndex + 1 })}
      />
      <Box className="home-banner__controls">
        <IconButton
          aria-label={t('previousBanner')}
          onClick={() =>
            setBannerIndex(
              (index) => (index - 1 + banners.length) % banners.length,
            )
          }
          sx={{
            color: 'white',
            bgcolor: 'rgb(30 17 11 / 62%)',
            '&:hover': { bgcolor: 'rgb(30 17 11 / 85%)' },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          aria-label={t('nextBanner')}
          onClick={() =>
            setBannerIndex((index) => (index + 1) % banners.length)
          }
          sx={{
            color: 'white',
            bgcolor: 'rgb(30 17 11 / 62%)',
            '&:hover': { bgcolor: 'rgb(30 17 11 / 85%)' },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
      <Stack
        direction="row"
        spacing={0.5}
        sx={{ py: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        {banners.map((bannerItem, index) => {
          const isSelected = index === bannerIndex;
          return (
            <IconButton
              key={bannerItem}
              aria-label={t('showBanner', { number: index + 1 })}
              aria-current={isSelected ? 'true' : undefined}
              onClick={() => setBannerIndex(index)}
              size="small"
              sx={{ p: 0.75 }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: isSelected ? '#ddb577' : '#fffaf0',
                  border: '1.5px solid #674533',
                  transition: 'transform 140ms ease',
                  transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            </IconButton>
          );
        })}
      </Stack>
      <Stack sx={{ alignItems: 'center', pb: 2 }}>
        <Button component={Link} to={ROUTES.BOOKS} variant="contained">
          {t('explore')}
        </Button>
      </Stack>
    </Box>
  );
}
