import { useState } from 'react';
import {
  Alert,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export default function AccountPage() {
  const { user, updateProfile } = useAuth();
  const { t } = useTranslation();
  const [name, setName] = useState(user?.name ?? '');
  const [surname, setSurname] = useState(user?.surname ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [error, setError] = useState('');

  if (!user) return null;
  const save = async () => {
    setError('');
    try {
      await updateProfile({ name, surname, email });
      toast.success('Your profile has been updated.');
    } catch {
      setError('Your profile could not be updated.');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h3" sx={{ mb: 3 }}>{t('accountTitle')}</Typography>
      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
        <Typography variant="h6" sx={{ mb: 2 }}>{t('profileDetails')}</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack spacing={2}>
          <TextField label="Username" value={user.username} disabled />
          <TextField label={t('firstName')} value={name} onChange={(event) => setName(event.target.value)} />
          <TextField label={t('lastName')} value={surname} onChange={(event) => setSurname(event.target.value)} />
          <TextField label={t('email')} type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Button variant="contained" onClick={save}>{t('saveChanges')}</Button>
          <Button component={Link} to="/history" variant="outlined">{t('viewHistory')}</Button>
        </Stack>
      </Paper>
    </Container>
  );
}
