import { useState } from 'react';
import {
  Alert,
  Button,
  Container,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import type { paths } from '@/interfaces/generated/api';
import { useAuth } from '@/modules/auth/context/AuthContext';

type LoginInput =
  paths['/login']['post']['requestBody']['content']['application/json'];
type RegisterInput =
  paths['/users']['post']['requestBody']['content']['application/json'];

const loginSchema = yup.object({
  username: yup.string().required('Enter your username or email'),
  password: yup.string().required('Enter your password'),
});
const registerSchema = yup.object({
  username: yup.string().required().min(3).max(40),
  email: yup.string().required().email(),
  name: yup.string().required().max(100),
  surname: yup.string().required().max(100),
  password: yup.string().required().min(12).max(128),
});

export default function AuthPage({ register = false }: { register?: boolean }) {
  const { t } = useTranslation();
  const { login, register: createAccount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const loginForm = useForm<LoginInput>({
    resolver: yupResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });
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

  const finishLogin = () => {
    const destination =
      (location.state as { from?: { pathname?: string } } | null)?.from
        ?.pathname ?? '/';
    navigate(destination, { replace: true });
  };

  const submitLogin = loginForm.handleSubmit(async (input) => {
    setError('');
    try {
      await login(input);
      finishLogin();
    } catch {
      setError('Sign in failed. Check your details and try again.');
    }
  });

  const submitRegister = registerForm.handleSubmit(async (input) => {
    setError('');
    try {
      await createAccount(input);
      toast.success('Check your email to confirm your account.');
      navigate('/login');
    } catch {
      setError(
        'We could not create the account. Check your details and try again.',
      );
    }
  });

  return (
    <Container maxWidth="sm">
      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 } }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {register ? t('registerTitle') : t('signInTitle')}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {register ? t('registerDescription') : t('signInDescription')}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {register ? (
          <Stack
            component="form"
            onSubmit={submitRegister}
            className="form-stack"
          >
            <TextField
              label={t('username')}
              {...registerForm.register('username')}
              error={Boolean(registerForm.formState.errors.username)}
              helperText={registerForm.formState.errors.username?.message}
            />
            <TextField
              label={t('email')}
              type="email"
              {...registerForm.register('email')}
              error={Boolean(registerForm.formState.errors.email)}
              helperText={registerForm.formState.errors.email?.message}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label={t('firstName')}
                {...registerForm.register('name')}
                error={Boolean(registerForm.formState.errors.name)}
                helperText={registerForm.formState.errors.name?.message}
              />
              <TextField
                fullWidth
                label={t('lastName')}
                {...registerForm.register('surname')}
                error={Boolean(registerForm.formState.errors.surname)}
                helperText={registerForm.formState.errors.surname?.message}
              />
            </Stack>
            <TextField
              label={t('password')}
              type="password"
              {...registerForm.register('password')}
              error={Boolean(registerForm.formState.errors.password)}
              helperText={
                registerForm.formState.errors.password?.message ??
                'Use at least 12 characters.'
              }
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={registerForm.formState.isSubmitting}
            >
              {t('createAccount')}
            </Button>
          </Stack>
        ) : (
          <Stack component="form" onSubmit={submitLogin} className="form-stack">
            <TextField
              label={t('usernameOrEmail')}
              autoComplete="username"
              {...loginForm.register('username')}
              error={Boolean(loginForm.formState.errors.username)}
              helperText={loginForm.formState.errors.username?.message}
            />
            <TextField
              label={t('password')}
              type="password"
              autoComplete="current-password"
              {...loginForm.register('password')}
              error={Boolean(loginForm.formState.errors.password)}
              helperText={loginForm.formState.errors.password?.message}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loginForm.formState.isSubmitting}
            >
              {t('signIn')}
            </Button>
            <MuiLink
              component={Link}
              to="/password-reset"
              underline="hover"
              sx={{ textAlign: 'right' }}
            >
              {t('forgotPassword')}
            </MuiLink>
          </Stack>
        )}
        <Typography sx={{ mt: 3, textAlign: 'center' }}>
          {register ? `${t('alreadyAccount')} ` : `${t('newToBookstore')} `}
          <MuiLink component={Link} to={register ? '/login' : '/register'}>
            {register ? 'Sign in' : 'Create an account'}
          </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
}
