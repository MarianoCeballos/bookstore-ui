import { yupResolver } from '@hookform/resolvers/yup';
import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { createRegisterSchema } from '@/modules/auth/schemas/auth.schema';
import type { RegisterInput } from '@/modules/auth/types';

interface RegisterFormProps {
  onSubmit: (input: RegisterInput) => Promise<void>;
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const { t } = useTranslation();

  const registerSchema = useMemo(() => createRegisterSchema(t), [t]);

  const registerForm = useForm<RegisterInput>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      name: '',
      surname: '',
      password: '',
      profilePic: '',
    },
  });

  const submit = registerForm.handleSubmit(async (values) => {
    await onSubmit({
      ...values,
      username: values.username.trim(),
      email: values.email.trim(),
      name: values.name.trim(),
      surname: values.surname.trim(),
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
        label={t('username')}
        autoComplete="username"
        {...registerForm.register('username')}
        error={Boolean(registerForm.formState.errors.username)}
        helperText={registerForm.formState.errors.username?.message}
        disabled={registerForm.formState.isSubmitting}
      />
      <TextField
        label={t('email')}
        type="email"
        autoComplete="email"
        {...registerForm.register('email')}
        error={Boolean(registerForm.formState.errors.email)}
        helperText={registerForm.formState.errors.email?.message}
        disabled={registerForm.formState.isSubmitting}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label={t('firstName')}
          autoComplete="given-name"
          {...registerForm.register('name')}
          error={Boolean(registerForm.formState.errors.name)}
          helperText={registerForm.formState.errors.name?.message}
          disabled={registerForm.formState.isSubmitting}
        />
        <TextField
          fullWidth
          label={t('lastName')}
          autoComplete="family-name"
          {...registerForm.register('surname')}
          error={Boolean(registerForm.formState.errors.surname)}
          helperText={registerForm.formState.errors.surname?.message}
          disabled={registerForm.formState.isSubmitting}
        />
      </Stack>
      <TextField
        label={t('password')}
        type="password"
        autoComplete="new-password"
        {...registerForm.register('password')}
        error={Boolean(registerForm.formState.errors.password)}
        helperText={
          registerForm.formState.errors.password?.message ??
          t('validationPasswordMin')
        }
        disabled={registerForm.formState.isSubmitting}
      />
      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={registerForm.formState.isSubmitting}
        startIcon={
          registerForm.formState.isSubmitting ? (
            <CircularProgress size={18} color="inherit" />
          ) : undefined
        }
      >
        {registerForm.formState.isSubmitting
          ? t('creatingAccount')
          : t('createAccount')}
      </Button>
    </Stack>
  );
}
