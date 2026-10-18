import { yupResolver } from '@hookform/resolvers/yup';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { createPasswordSchema } from '@/modules/account/schemas/account.schema';
import type { PasswordFormValues } from '@/modules/account/types';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { getLocalizedErrorMessage } from '@/utils/error';

export function SecurityPasswordForm() {
  const { t } = useTranslation();
  const { changePassword } = useAuth();
  const [passwordError, setPasswordError] = useState('');

  const passwordSchema = useMemo(() => createPasswordSchema(t), [t]);

  const passwordForm = useForm<PasswordFormValues>({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      password: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = passwordForm.handleSubmit(async (values) => {
    setPasswordError('');
    try {
      await changePassword({
        password: values.password,
        newPassword: values.newPassword,
      });
      passwordForm.reset({
        password: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success(t('toastPasswordUpdatedTitle'));
    } catch (err) {
      const message = getLocalizedErrorMessage(err, t);
      setPasswordError(message);
      toast.error(message);
    }
  });

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 2 }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', mb: 0.75 }}
      >
        <LockOutlinedIcon color="primary" />
        <Typography variant="h6">{t('securitySectionTitle')}</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t('securitySectionDescription')}
      </Typography>

      <Divider sx={{ mb: 2.5 }} />

      {passwordError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {passwordError}
        </Alert>
      )}

      <Stack
        component="form"
        onSubmit={(event) => void onSubmit(event)}
        spacing={2}
        noValidate
      >
        <TextField
          fullWidth
          type="password"
          label={t('currentPassword')}
          autoComplete="current-password"
          {...passwordForm.register('password')}
          error={Boolean(passwordForm.formState.errors.password)}
          helperText={passwordForm.formState.errors.password?.message}
          disabled={passwordForm.formState.isSubmitting}
        />

        <TextField
          fullWidth
          type="password"
          label={t('newPassword')}
          autoComplete="new-password"
          {...passwordForm.register('newPassword')}
          error={Boolean(passwordForm.formState.errors.newPassword)}
          helperText={passwordForm.formState.errors.newPassword?.message}
          disabled={passwordForm.formState.isSubmitting}
        />

        <TextField
          fullWidth
          type="password"
          label={t('confirmPassword')}
          autoComplete="new-password"
          {...passwordForm.register('confirmPassword')}
          error={Boolean(passwordForm.formState.errors.confirmPassword)}
          helperText={passwordForm.formState.errors.confirmPassword?.message}
          disabled={passwordForm.formState.isSubmitting}
        />

        <Box sx={{ pt: 0.5 }}>
          <Button
            type="submit"
            variant="outlined"
            fullWidth
            disabled={passwordForm.formState.isSubmitting}
            startIcon={
              passwordForm.formState.isSubmitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            {passwordForm.formState.isSubmitting
              ? t('updatingPassword')
              : t('updatePassword')}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
