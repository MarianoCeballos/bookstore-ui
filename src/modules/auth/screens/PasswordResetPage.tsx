import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { PasswordResetPasswordStep } from '@/modules/auth/components/PasswordResetPasswordStep';
import { PasswordResetRequestStep } from '@/modules/auth/components/PasswordResetRequestStep';
import { PasswordResetVerifyStep } from '@/modules/auth/components/PasswordResetVerifyStep';
import { usePasswordReset } from '@/modules/auth/hooks/usePasswordReset';

export default function PasswordResetPage() {
  const { t } = useTranslation();
  const {
    user,
    setUser,
    accountId,
    setAccountId,
    resetCode,
    setResetCode,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    resetToken,
    notice,
    error,
    isSendingCode,
    isVerifyingCode,
    isSavingPassword,
    requestCode,
    verifyCode,
    savePassword,
  } = usePasswordReset();

  return (
    <Container maxWidth="sm">
      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {t('resetPassword')}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {t('resetInstructions')}
        </Typography>

        {notice && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {notice}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          <Box>
            <PasswordResetRequestStep
              user={user}
              isSending={isSendingCode}
              onUserChange={setUser}
              onRequest={() => void requestCode()}
            />
          </Box>

          <Divider />

          <Box>
            <PasswordResetVerifyStep
              accountId={accountId}
              resetCode={resetCode}
              isVerifying={isVerifyingCode}
              onAccountIdChange={setAccountId}
              onResetCodeChange={setResetCode}
              onVerify={() => void verifyCode()}
            />
          </Box>

          {resetToken && (
            <>
              <Divider />
              <Box>
                <PasswordResetPasswordStep
                  password={password}
                  confirmPassword={confirmPassword}
                  isSaving={isSavingPassword}
                  onPasswordChange={setPassword}
                  onConfirmPasswordChange={setConfirmPassword}
                  onSave={() => void savePassword()}
                />
              </Box>
            </>
          )}

          <Divider />
          <Button
            component={Link}
            to={ROUTES.LOGIN}
            color="inherit"
            size="small"
          >
            {t('continueSignIn')}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
