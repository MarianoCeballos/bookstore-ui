import { useState } from 'react';
import { Alert, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';
import { contactService } from '@/modules/contact/services/contact.service';
import { useTranslation } from 'react-i18next';

interface ContactInput {
  sender: string;
  title: string;
  message: string;
}

const schema = yup.object({
  sender: yup.string().required().email(),
  title: yup.string().required().max(120),
  message: yup.string().required().max(4000),
});

export default function ContactPage() {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const form = useForm<ContactInput>({
    resolver: yupResolver(schema),
    defaultValues: { sender: '', title: '', message: '' },
  });
  const submit = form.handleSubmit(async (input) => {
    setError('');
    try {
      const result = await contactService.send(input);
      toast.success(result.message);
      form.reset();
    } catch {
      setError('Your message could not be sent. Please try again.');
    }
  });
  return (
    <Container maxWidth="sm">
      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 } }}>
        <Typography variant="h4" sx={{ mb: 1 }}>{t('contactTitle')}</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {t('contactDescription')}
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Stack component="form" onSubmit={submit} className="form-stack">
          <TextField label={t('sender')} type="email" {...form.register('sender')} error={Boolean(form.formState.errors.sender)} helperText={form.formState.errors.sender?.message} />
          <TextField label={t('subject')} {...form.register('title')} error={Boolean(form.formState.errors.title)} helperText={form.formState.errors.title?.message} />
          <TextField label={t('message')} multiline minRows={5} {...form.register('message')} error={Boolean(form.formState.errors.message)} helperText={form.formState.errors.message?.message} />
          <Button type="submit" variant="contained" disabled={form.formState.isSubmitting}>{t('sendMessage')}</Button>
        </Stack>
      </Paper>
    </Container>
  );
}
