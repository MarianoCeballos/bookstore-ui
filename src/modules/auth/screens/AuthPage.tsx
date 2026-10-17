import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import * as yup from 'yup';
import { ROUTES } from '@/constants';
import type { paths } from '@/interfaces/generated/api';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { authService } from '@/modules/auth/services/auth.service';
import { getLocalizedErrorMessage } from '@/utils/error';

type LoginInput =
  paths['/login']['post']['requestBody']['content']['application/json'];
type RegisterInput =
  paths['/users']['post']['requestBody']['content']['application/json'];

export default function AuthPage({ register = false }: { register?: boolean }) {
  const { t } = useTranslation();
  const { login, register: createAccount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [unconfirmedUsername, setUnconfirmedUsername] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [prevRegister, setPrevRegister] = useState(register);

  if (prevRegister !== register) {
    setPrevRegister(register);
    setError('');
    setUnconfirmedUsername('');
  }

  const loginSchema = useMemo(
    () =>
      yup.object({
        username: yup.string().trim().required(t('validationRequired')),
        password: yup.string().required(t('validationRequired')),
      }),
    [t],
  );

  const registerSchema = useMemo(
    () =>
      yup.object({
        username: yup
          .string()
          .trim()
          .required(t('validationRequired'))
          .min(3, t('validationUsernameMin'))
          .max(40),
        email: yup
          .string()
          .trim()
          .required(t('validationRequired'))
          .email(t('validationEmail')),
        name: yup.string().trim().required(t('validationRequired')).max(100),
        surname: yup.string().trim().required(t('validationRequired')).max(100),
        password: yup
          .string()
          .required(t('validationRequired'))
          .min(12, t('validationPasswordMin'))
          .max(128),
      }),
    [t],
  );

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
        ?.pathname ?? ROUTES.HOME;
    navigate(destination, { replace: true });
  };

  const submitLogin = loginForm.handleSubmit(async (input) => {
    setError('');
    setUnconfirmedUsername('');
    const trimmedUsername = input.username.trim();
    try {
      await login({
        username: trimmedUsername,
        password: input.password,
      });
      toast.success(t('toastWelcomeBack'), {
        description: `@${trimmedUsername}`,
      });
      finishLogin();
    } catch (err) {
      const msg = getLocalizedErrorMessage(err, t, 'errorInvalidCredentials');
      setError(msg);
      if (msg === t('errorConfirmEmailFirst')) {
        setUnconfirmedUsername(trimmedUsername);
        toast.warning(msg, {
          description: `@${trimmedUsername}`,
        });
      } else {
        toast.error(msg);
      }
    }
  });

  const submitRegister = registerForm.handleSubmit(async (input) => {
    setError('');
    const trimmedEmail = input.email.trim();
    try {
      await createAccount({
        ...input,
        username: input.username.trim(),
        email: trimmedEmail,
        name: input.name.trim(),
        surname: input.surname.trim(),
      });
      toast.success(t('toastAccountCreated'), {
        description: t('toastAccountCreatedDescription', {
          email: trimmedEmail,
        }),
      });
      navigate(ROUTES.LOGIN);
    } catch (err) {
      const msg = getLocalizedErrorMessage(err, t);
      setError(msg);
      toast.error(msg);
    }
  });

  const handleResendConfirmation = async () => {
    if (!unconfirmedUsername) return;
    setIsResending(true);
    try {
      await authService.resend(unconfirmedUsername);
      toast.success(t('toastConfirmationSentTitle'), {
        description: t('confirmationSent'),
      });
      setUnconfirmedUsername('');
    } catch (err) {
      toast.error(getLocalizedErrorMessage(err, t));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {register ? t('registerTitle') : t('signInTitle')}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {register ? t('registerDescription') : t('signInDescription')}
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              unconfirmedUsername ? (
                <Button
                  color="inherit"
                  size="small"
                  disabled={isResending}
                  onClick={() => void handleResendConfirmation()}
                >
                  {isResending
                    ? t('resendingConfirmation')
                    : t('resendConfirmation')}
                </Button>
              ) : undefined
            }
          >
            {error}
          </Alert>
        )}

        {register ? (
          <Stack
            component="form"
            onSubmit={(event) => void submitRegister(event)}
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
        ) : (
          <Stack
            component="form"
            onSubmit={(event) => void submitLogin(event)}
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
        )}

        <Typography sx={{ mt: 3, textAlign: 'center' }}>
          {register ? `${t('alreadyAccount')} ` : `${t('newToBookstore')} `}
          <MuiLink
            component={Link}
            to={register ? ROUTES.LOGIN : ROUTES.REGISTER}
            sx={{ fontWeight: 700 }}
          >
            {register ? t('signIn') : t('createAccount')}
          </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
}
