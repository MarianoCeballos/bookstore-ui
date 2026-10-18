import {
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface PasswordResetPasswordStepProps {
  password: string;
  confirmPassword: string;
  isSaving: boolean;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSave: () => void;
}

export function PasswordResetPasswordStep({
  password,
  confirmPassword,
  isSaving,
  onPasswordChange,
  onConfirmPasswordChange,
  onSave,
}: PasswordResetPasswordStepProps) {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 700 }}>
        {t('resetStep3Title')}
      </Typography>
      <Stack spacing={1.5}>
        <TextField
          label={t('newPassword')}
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          disabled={isSaving}
          fullWidth
        />
        <TextField
          label={t('confirmPassword')}
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => onConfirmPasswordChange(event.target.value)}
          disabled={isSaving}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={onSave}
          disabled={isSaving}
          startIcon={
            isSaving ? (
              <CircularProgress size={16} color="inherit" />
            ) : undefined
          }
        >
          {isSaving ? t('savingPassword') : t('savePassword')}
        </Button>
      </Stack>
    </>
  );
}
