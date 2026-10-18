import { yupResolver } from '@hookform/resolvers/yup';
import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import { ROUTES } from '@/constants';
import { createLoginSchema } from '@/modules/auth/schemas/auth.schema';
import type { LoginInput } from '@/modules/auth/types';

interface LoginFormProps {
  onSubmit: (input: LoginInput) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const { t } = useTranslation();

  const loginSchema = useMemo(() => createLoginSchema(t), [t]);

  const loginForm = useForm<LoginInput>({
    resolver: yupResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const submit = loginForm.handleSubmit(async (values) => {
    await onSubmit({
      username: values.username.trim(),
      password: values.password,
    });
  });

  return (
    <Stack
      component="form"
      onSubmit={(event) => void submit(event)}
      className="form-stack"
      noValidate
    >
      <TextField
        label={t('usernameOrEmail')}
        autoComplete="username"
        {...loginForm.register('username')}
        error={Boolean(loginForm.formState.errors.username)}
        helperText={loginForm.formState.errors.username?.message}
        disabled={loginForm.formState.isSubmitting}
      />
      <TextField
        label={t('password')}
        type="password"
        autoComplete="current-password"
        {...loginForm.register('password')}
        error={Boolean(loginForm.formState.errors.password)}
        helperText={loginForm.formState.errors.password?.message}
        disabled={loginForm.formState.isSubmitting}
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={loginForm.formState.isSubmitting}
        startIcon={
          loginForm.formState.isSubmitting ? (
            <CircularProgress size={18} color="inherit" />
          ) : undefined
        }
      >
        {loginForm.formState.isSubmitting ? t('signingIn') : t('signIn')}
      </Button>
      <MuiLink
        component={Link}
        to={ROUTES.PASSWORD_RESET}
        underline="hover"
        sx={{ textAlign: 'right', fontWeight: 600 }}
      >
        {t('forgotPassword')}
      </MuiLink>
    </Stack>
  );
}
