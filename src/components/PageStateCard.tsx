import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface EmptyOrErrorStateProps {
  title: string;
  description?: string;
  variant?: 'empty' | 'error';
  icon?: ReactNode;
  actionLabel?: string;
  actionTo?: string;
  onAction?: () => void;
}

export function PageStateCard({
  title,
  description,
  variant = 'empty',
  icon,
  actionLabel,
  actionTo,
  onAction,
}: EmptyOrErrorStateProps) {
  const isError = variant === 'error';

  return (
    <Paper
      variant="outlined"
      role={isError ? 'alert' : undefined}
      sx={{
        p: { xs: 3, sm: 4 },
        textAlign: 'center',
        bgcolor: 'background.paper',
        borderRadius: 2,
        borderColor: isError ? 'error.main' : 'divider',
      }}
    >
      <Stack
        spacing={1.5}
        sx={{ alignItems: 'center', maxWidth: 460, mx: 'auto' }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            bgcolor: isError
              ? 'rgba(166, 38, 38, 0.1)'
              : 'rgba(103, 69, 51, 0.1)',
            color: isError ? 'error.main' : 'primary.main',
          }}
        >
          {icon ??
            (isError ? (
              <ErrorOutlineRoundedIcon fontSize="medium" />
            ) : (
              <MenuBookRoundedIcon fontSize="medium" />
            ))}
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
        {actionLabel && actionTo && (
          <Button
            component={RouterLink}
            to={actionTo}
            variant="contained"
            sx={{ mt: 1 }}
          >
            {actionLabel}
          </Button>
        )}
        {actionLabel && !actionTo && onAction && (
          <Button onClick={onAction} variant="contained" sx={{ mt: 1 }}>
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
