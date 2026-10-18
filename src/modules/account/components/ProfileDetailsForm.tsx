import { yupResolver } from '@hookform/resolvers/yup';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import {
  Alert,
  Button,
  CircularProgress,
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
import { ROUTES } from '@/constants';
import type { User } from '@/interfaces/models';
import { createProfileSchema } from '@/modules/account/schemas/account.schema';
import type { ProfileFormValues } from '@/modules/account/types';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { getLocalizedErrorMessage } from '@/utils/error';

interface ProfileDetailsFormProps {
  user: User;
}

export function ProfileDetailsForm({ user }: ProfileDetailsFormProps) {
  const { t } = useTranslation();
  const { updateProfile } = useAuth();
  const [profileError, setProfileError] = useState('');

  const profileSchema = useMemo(() => createProfileSchema(t), [t]);

  const profileForm = useForm<ProfileFormValues>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      username: user.username ?? '',
      name: user.name ?? '',
      surname: user.surname ?? '',
      email: user.email ?? '',
    },
  });

  const { ID, username, name, surname, email } = user;

  useEffect(() => {
    profileForm.reset({
      username: username ?? '',
      name: name ?? '',
      surname: surname ?? '',
      email: email ?? '',
    });
  }, [ID, username, name, surname, email, profileForm]);

  const onSubmit = profileForm.handleSubmit(async (values) => {
    setProfileError('');
    try {
      await updateProfile(values);
      toast.success(t('toastProfileSaved'), {
        description: `${values.name.trim()} ${values.surname.trim()}`.trim(),
      });
    } catch (err) {
      const message = getLocalizedErrorMessage(err, t);
      setProfileError(message);
      toast.error(message);
    }
  });

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3.5 }, borderRadius: 2 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
        <PersonOutlineRoundedIcon color="primary" />
        <Typography variant="h6">{t('profileDetails')}</Typography>
      </Stack>

      <Divider sx={{ mb: 2.5 }} />

      {profileError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {profileError}
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
          label={t('username')}
          {...profileForm.register('username')}
          error={Boolean(profileForm.formState.errors.username)}
          helperText={profileForm.formState.errors.username?.message}
          disabled={profileForm.formState.isSubmitting}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label={t('firstName')}
            {...profileForm.register('name')}
            error={Boolean(profileForm.formState.errors.name)}
            helperText={profileForm.formState.errors.name?.message}
            disabled={profileForm.formState.isSubmitting}
          />
          <TextField
            fullWidth
            label={t('lastName')}
            {...profileForm.register('surname')}
            error={Boolean(profileForm.formState.errors.surname)}
            helperText={profileForm.formState.errors.surname?.message}
            disabled={profileForm.formState.isSubmitting}
          />
        </Stack>

        <TextField
          fullWidth
          label={t('email')}
          type="email"
          {...profileForm.register('email')}
          error={Boolean(profileForm.formState.errors.email)}
          helperText={profileForm.formState.errors.email?.message}
          disabled={profileForm.formState.isSubmitting}
        />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{ pt: 1 }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={profileForm.formState.isSubmitting}
            startIcon={
              profileForm.formState.isSubmitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : undefined
            }
          >
            {profileForm.formState.isSubmitting
              ? t('savingChanges')
              : t('saveChanges')}
          </Button>

          {profileForm.formState.isDirty && (
            <Button
              type="button"
              variant="outlined"
              disabled={profileForm.formState.isSubmitting}
              onClick={() => {
                setProfileError('');
                profileForm.reset({
                  username: user.username ?? '',
                  name: user.name ?? '',
                  surname: user.surname ?? '',
                  email: user.email ?? '',
                });
              }}
            >
              {t('resetChanges')}
            </Button>
          )}

          <Button
            component={Link}
            to={ROUTES.HISTORY}
            variant="outlined"
            sx={{ ml: { sm: 'auto !important' } }}
          >
            {t('viewHistory')}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
