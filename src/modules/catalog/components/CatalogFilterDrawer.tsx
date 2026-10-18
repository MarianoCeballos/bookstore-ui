import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface CatalogFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  onShowResults: () => void;
  children: ReactNode;
}

export function CatalogFilterDrawer({
  open,
  onClose,
  onShowResults,
  children,
}: CatalogFilterDrawerProps) {
  const { t } = useTranslation();

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '92vw', sm: 400 },
            maxWidth: '100vw',
            bgcolor: 'background.default',
          },
        },
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          pb: 0,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {t('filters')}
        </Typography>
        <IconButton onClick={onClose} aria-label={t('closeFilters')}>
          <CloseRoundedIcon />
        </IconButton>
      </Stack>

      <Box sx={{ p: 2, flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {children}
      </Box>

      <Box sx={{ p: 2, pt: 1 }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={onShowResults}
        >
          {t('showResults')}
        </Button>
      </Box>
    </Drawer>
  );
}
