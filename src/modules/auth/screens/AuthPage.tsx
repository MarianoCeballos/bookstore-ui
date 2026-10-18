import {
  Alert,
  Button,
  Container,
  Link as MuiLink,
  Paper,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ROUTES } from '@/constants';
import { LoginForm } from '@/modules/auth/components/LoginForm';
import { RegisterForm } from '@/modules/auth/components/RegisterForm';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { authService } from '@/modules/auth/services/auth.service';
import type { LoginInput, RegisterInput } from '@/modules/auth/types';
import { getErrorMessageKey, getLocalizedErrorMessage } from '@/utils/error';

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

  const finishLogin = () => {
    const destination =
      (location.state as { from?: { pathname?: string } } | null)?.from
        ?.pathname ?? ROUTES.HOME;
    navigate(destination, { replace: true });
  };

  const submitLogin = async (input: LoginInput) => {
    setError('');
    setUnconfirmedUsername('');
    try {
      await login(input);
      toast.success(t('toastWelcomeBack'), {
        description: `@${input.username}`,
      });
      finishLogin();
    } catch (err) {
      const msg = getLocalizedErrorMessage(err, t, 'errorInvalidCredentials');
      setError(msg);
      // Decide from the error itself (mapped server message) rather than from
      // the localized text, which changes with the active language.
      if (getErrorMessageKey(err) === 'errorConfirmEmailFirst') {
        setUnconfirmedUsername(input.username);
        toast.warning(msg, {
          description: `@${input.username}`,
        });
      } else {
        toast.error(msg);
      }
    }
  };

  const submitRegister = async (input: RegisterInput) => {
    setError('');
    try {
      await createAccount(input);
      toast.success(t('toastAccountCreated'), {
        description: t('toastAccountCreatedDescription', {
          email: input.email,
        }),
      });
      navigate(ROUTES.LOGIN);
    } catch (err) {
      const msg = getLocalizedErrorMessage(err, t);
      setError(msg);
      toast.error(msg);
    }
  };

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
          <RegisterForm onSubmit={submitRegister} />
        ) : (
          <LoginForm onSubmit={submitLogin} />
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
