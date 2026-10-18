import {
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface PasswordResetVerifyStepProps {
  accountId: string;
  resetCode: string;
  isVerifying: boolean;
  onAccountIdChange: (value: string) => void;
  onResetCodeChange: (value: string) => void;
  onVerify: () => void;
}

export function PasswordResetVerifyStep({
  accountId,
  resetCode,
  isVerifying,
  onAccountIdChange,
  onResetCodeChange,
  onVerify,
}: PasswordResetVerifyStepProps) {
  const { t } = useTranslation();

  return (
    <>
      <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 700 }}>
        {t('resetStep2Title')}
      </Typography>
      <Stack spacing={1.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            label={t('accountId')}
            value={accountId}
            onChange={(event) => onAccountIdChange(event.target.value)}
            disabled={isVerifying}
            fullWidth
          />
          <TextField
            label={t('emailCode')}
            value={resetCode}
            onChange={(event) => onResetCodeChange(event.target.value)}
            disabled={isVerifying}
            fullWidth
          />
        </Stack>
        <Button
          variant="outlined"
          onClick={onVerify}
          disabled={!accountId.trim() || !resetCode.trim() || isVerifying}
          startIcon={
            isVerifying ? (
              <CircularProgress size={16} color="inherit" />
            ) : undefined
          }
        >
          {isVerifying ? t('verifyingCode') : t('verifyCode')}
        </Button>
      </Stack>
    </>
  );
}
