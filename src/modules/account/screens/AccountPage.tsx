import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import * as yup from 'yup';
import { ROUTES } from '@/constants';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { getLocalizedErrorMessage } from '@/utils/error';
import { getUserInitials } from '@/utils/format';

interface ProfileFormValues {
  name: string;
  surname: string;
  email: string;
}

export default function AccountPage() {
  const { user, updateProfile } = useAuth();
  const { t } = useTranslation();
  const [error, setError] = useState('');

  const schema = useMemo(
    () =>
      yup.object({
        name: yup.string().trim().required(t('validationRequired')).max(100),
        surname: yup.string().trim().required(t('validationRequired')).max(100),
        email: yup
          .string()
          .trim()
          .required(t('validationRequired'))
          .email(t('validationEmail'))
          .max(255),
      }),
    [t],
  );

  const form = useForm<ProfileFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name ?? '',
      surname: user?.surname ?? '',
      email: user?.email ?? '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name ?? '',
        surname: user.surname ?? '',
        email: user.email ?? '',
      });
    }
  }, [user, form]);

  if (!user) return null;

  const onSubmit = form.handleSubmit(async (values) => {
    setError('');
    try {
      await updateProfile(values);
      toast.success(t('toastProfileSaved'));
    } catch (err) {
      setError(getLocalizedErrorMessage(err, t));
    }
  });

  const fullName =
    [user.name, user.surname].filter(Boolean).join(' ').trim() || user.username;

  return (
    <Container maxWidth="md">
      <Typography variant="h3" sx={{ mb: 3 }}>
        {t('accountTitle')}
      </Typography>
      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 }, borderRadius: 2 }}>
        <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
          <Avatar
            src={user.profilePic || undefined}
            alt={fullName}
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontWeight: 700,
              fontSize: '1.15rem',
            }}
          >
            {getUserInitials(user)}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }} noWrap>
              {fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              @{user.username} · {t('accountId')}: #{user.ID}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('profileDetails')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack
          component="form"
          onSubmit={(event) => void onSubmit(event)}
          spacing={2}
          noValidate
        >
          <TextField label={t('username')} value={user.username} disabled />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label={t('firstName')}
              {...form.register('name')}
              error={Boolean(form.formState.errors.name)}
              helperText={form.formState.errors.name?.message}
              disabled={form.formState.isSubmitting}
            />
            <TextField
              fullWidth
              label={t('lastName')}
              {...form.register('surname')}
              error={Boolean(form.formState.errors.surname)}
              helperText={form.formState.errors.surname?.message}
              disabled={form.formState.isSubmitting}
            />
          </Stack>
          <TextField
            label={t('email')}
            type="email"
            {...form.register('email')}
            error={Boolean(form.formState.errors.email)}
            helperText={form.formState.errors.email?.message}
            disabled={form.formState.isSubmitting}
          />
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{ pt: 1 }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={form.formState.isSubmitting}
              startIcon={
                form.formState.isSubmitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : undefined
              }
            >
              {form.formState.isSubmitting
                ? t('savingChanges')
                : t('saveChanges')}
            </Button>
            <Button component={Link} to={ROUTES.HISTORY} variant="outlined">
              {t('viewHistory')}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
