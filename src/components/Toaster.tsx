import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { CircularProgress, useTheme } from '@mui/material';
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

export function Toaster({ position = 'bottom-right', ...props }: ToasterProps) {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Sonner
      theme={theme.palette.mode}
      position={position}
      closeButton
      visibleToasts={4}
      className="toaster group"
      icons={{
        success: (
          <CheckCircleOutlineRoundedIcon fontSize="small" color="success" />
        ),
        info: <InfoOutlinedIcon fontSize="small" color="primary" />,
        warning: <WarningAmberRoundedIcon fontSize="small" color="warning" />,
        error: <ErrorOutlineRoundedIcon fontSize="small" color="error" />,
        loading: <CircularProgress size={16} color="primary" />,
      }}
      style={
        {
          '--normal-bg': theme.palette.background.paper,
          '--normal-text': theme.palette.text.primary,
          '--normal-border': 'rgba(103, 69, 51, 0.28)',
          '--border-radius': `${Number(theme.shape.borderRadius) + 2}px`,
          fontFamily: theme.typography.fontFamily,
        } as CSSProperties
      }
      toastOptions={{
        closeButtonAriaLabel: t('closeNotification'),
        classNames: {
          toast: 'cn-toast bookstore-toast',
          title: 'bookstore-toast__title',
          description: 'bookstore-toast__description',
          actionButton: 'bookstore-toast__action',
          cancelButton: 'bookstore-toast__cancel',
          closeButton: 'bookstore-toast__close',
          icon: 'bookstore-toast__icon',
        },
      }}
      {...props}
    />
  );
}

export default Toaster;
