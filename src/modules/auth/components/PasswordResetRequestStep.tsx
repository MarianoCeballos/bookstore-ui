import {
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface PasswordResetRequestStepProps {
  user: string;
  isSending: boolean;
  onUserChange: (value: string) => void;
  onRequest: () => void;
}

export function PasswordResetRequestStep({
  user,
  isSending,
  onUserChange,
  onRequest,
}: PasswordResetRequestStepProps) {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 700 }}>
        {t('resetStep1Title')}
      </Typography>
      <Stack spacing={1.5}>
        <TextField
          label={t('usernameOrEmail')}
          value={user}
          onChange={(event) => onUserChange(event.target.value)}
          disabled={isSending}
          fullWidth
        />
        <Button
          variant="outlined"
          onClick={onRequest}
          disabled={!user.trim() || isSending}
          startIcon={
            isSending ? (
              <CircularProgress size={16} color="inherit" />
            ) : undefined
          }
        >
          {isSending ? t('sendingReset') : t('sendReset')}
        </Button>
      </Stack>
    </>
  );
}
