import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import * as yup from 'yup';
import { contactService } from '@/modules/contact/services/contact.service';
import { getLocalizedErrorMessage } from '@/utils/error';

interface ContactInput {
  sender: string;
  title: string;
  message: string;
}

export default function ContactPage() {
  const { t } = useTranslation();
  const [error, setError] = useState('');

  const schema = useMemo(
    () =>
      yup.object({
        sender: yup
          .string()
          .trim()
          .required(t('validationRequired'))
          .email(t('validationEmail')),
        title: yup.string().trim().required(t('validationRequired')).max(120),
        message: yup
          .string()
          .trim()
          .required(t('validationRequired'))
          .min(10, t('validationMessageMin'))
          .max(4000),
      }),
    [t],
  );

  const form = useForm<ContactInput>({
    resolver: yupResolver(schema),
    defaultValues: { sender: '', title: '', message: '' },
  });

  const submit = form.handleSubmit(async (input) => {
    setError('');
    const senderEmail = input.sender.trim();
    try {
      await contactService.send({
        sender: senderEmail,
        title: input.title.trim(),
        message: input.message.trim(),
      });
      toast.success(t('toastMessageSent'), {
        description: t('toastMessageSentDescription', { email: senderEmail }),
      });
      form.reset();
    } catch (err) {
      const message = getLocalizedErrorMessage(err, t);
      setError(message);
      toast.error(message);
    }
  });

  return (
    <Container maxWidth="sm">
      <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, borderRadius: 2 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {t('contactTitle')}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {t('contactDescription')}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Stack
          component="form"
          onSubmit={(event) => void submit(event)}
          className="form-stack"
          noValidate
        >
          <TextField
            label={t('sender')}
            type="email"
            autoComplete="email"
            {...form.register('sender')}
            error={Boolean(form.formState.errors.sender)}
            helperText={form.formState.errors.sender?.message}
            disabled={form.formState.isSubmitting}
          />
          <TextField
            label={t('subject')}
            {...form.register('title')}
            error={Boolean(form.formState.errors.title)}
            helperText={form.formState.errors.title?.message}
            disabled={form.formState.isSubmitting}
          />
          <TextField
            label={t('message')}
            multiline
            minRows={5}
            {...form.register('message')}
            error={Boolean(form.formState.errors.message)}
            helperText={form.formState.errors.message?.message}
            disabled={form.formState.isSubmitting}
          />
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
              ? t('sendingMessage')
              : t('sendMessage')}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
