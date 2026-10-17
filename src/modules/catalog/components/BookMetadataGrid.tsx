import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { Box, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { Book } from '@/interfaces/models';

interface MetadataItem {
  label: string;
  value: string;
  icon: ReactNode;
}

export function BookMetadataGrid({ book }: { book: Book }) {
  const { t } = useTranslation();

  const items: MetadataItem[] = [
    {
      label: t('publisher'),
      value: book.publisher?.trim() || t('notSpecified'),
      icon: <LocalLibraryOutlinedIcon fontSize="small" />,
    },
    {
      label: t('publishedDate'),
      value: book.publishedDate?.trim() || t('notSpecified'),
      icon: <CalendarTodayOutlinedIcon fontSize="small" />,
    },
    {
      label: t('pagesLabel'),
      value:
        book.pageCount != null && book.pageCount > 0
          ? `${book.pageCount} ${t('pageCount')}`
          : t('notSpecified'),
      icon: <AutoStoriesOutlinedIcon fontSize="small" />,
    },
    {
      label: t('language'),
      value: book.language?.trim() || t('notSpecified'),
      icon: <LanguageOutlinedIcon fontSize="small" />,
    },
    {
      label: t('readingTime'),
      value:
        book.avgReadingTime &&
        !book.avgReadingTime.toLowerCase().includes('cannot estimate')
          ? book.avgReadingTime
          : t('notSpecified'),
      icon: <ScheduleOutlinedIcon fontSize="small" />,
    },
    {
      label: t('soldCopies'),
      value: String(book.soldCopies ?? 0),
      icon: <TrendingUpOutlinedIcon fontSize="small" />,
    },
  ];

  return (
    <Box sx={{ mt: 3 }}>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{
          fontWeight: 700,
          letterSpacing: '0.08em',
          display: 'block',
          mb: 1,
        }}
      >
        {t('bookMetadata')}
      </Typography>
      <Box
        component="dl"
        sx={{
          m: 0,
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            sm: 'repeat(3, minmax(0, 1fr))',
          },
          gap: 1.5,
        }}
      >
        {items.map((item) => (
          <Paper
            key={item.label}
            variant="outlined"
            sx={{
              p: 1.5,
              bgcolor: 'rgba(239, 227, 202, 0.35)',
              borderRadius: 1.5,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', color: 'text.secondary' }}
            >
              {item.icon}
              <Typography
                component="dt"
                variant="caption"
                sx={{ fontWeight: 600 }}
              >
                {item.label}
              </Typography>
            </Stack>
            <Typography
              component="dd"
              variant="body2"
              sx={{ m: 0, mt: 0.5, fontWeight: 700, wordBreak: 'break-word' }}
            >
              {item.value}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
