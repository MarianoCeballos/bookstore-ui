import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  Alert,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import type { Book, BookInput } from '@/interfaces/models';
import { DataTable } from '@/modules/admin/components/DataTable';
import { adminService } from '@/modules/admin/services/admin.service';
import { booksService } from '@/modules/catalog/services/books.service';
import { useUi } from '@/modules/ui/context/UiContext';
import { getLocalizedErrorMessage } from '@/utils/error';
import { formatCurrency } from '@/utils/format';

const initialBook: BookInput = {
  title: '',
  description: '',
  price: '0.00',
  image: '',
  authors: [],
  categories: [],
  publisher: '',
  publishedDate: new Date().toISOString().slice(0, 10),
  pageCount: 1,
  language: 'English',
};

const PRICE_PATTERN = /^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/;

export function AdminBooksSection() {
  const { t } = useTranslation();
  const { language } = useUi();
  const queryClient = useQueryClient();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [book, setBook] = useState<BookInput>(initialBook);
  const [authorText, setAuthorText] = useState('');
  const [categoryText, setCategoryText] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const booksQuery = useQuery({
    queryKey: ['admin', 'books'],
    queryFn: adminService.books,
  });

  const resetForm = () => {
    setEditingId(null);
    setBook(initialBook);
    setAuthorText('');
    setCategoryText('');
    setError('');
  };

  const handleStartEdit = (target: Book) => {
    setEditingId(target.ID);
    setBook({
      title: target.title,
      description: target.description,
      price: String(target.price),
      image: target.image ?? '',
      authors: target.authors.map((value) => ({ value })),
      categories: target.categories.map((value) => ({ value })),
      publisher: target.publisher ?? '',
      publishedDate:
        target.publishedDate?.slice(0, 10) ||
        new Date().toISOString().slice(0, 10),
      pageCount: target.pageCount ?? 1,
      language: target.language ?? 'English',
    });
    setAuthorText(target.authors.join(', '));
    setCategoryText(target.categories.join(', '));
    setError('');
  };

  const invalidateCatalog = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin', 'books'] }),
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] }),
      queryClient.invalidateQueries({ queryKey: ['books'] }),
      queryClient.invalidateQueries({ queryKey: ['authors'] }),
      queryClient.invalidateQueries({ queryKey: ['categories'] }),
    ]);
  };

  const handleSubmitBook = async () => {
    setError('');
    const parsedAuthors = authorText
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => ({ value }));
    const parsedCategories = categoryText
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
      .map((value) => ({ value }));

    if (
      !book.title.trim() ||
      !book.description.trim() ||
      parsedAuthors.length === 0 ||
      parsedCategories.length === 0
    ) {
      setError(t('validationRequired'));
      return;
    }

    const trimmedPrice = book.price.trim();
    if (!PRICE_PATTERN.test(trimmedPrice)) {
      setError(t('validationPricePositive'));
      return;
    }

    const payload: BookInput = {
      ...book,
      title: book.title.trim(),
      description: book.description.trim(),
      price: trimmedPrice,
      image: book.image?.trim() || undefined,
      publisher: book.publisher?.trim() || undefined,
      publishedDate: book.publishedDate?.trim() || undefined,
      language: book.language?.trim() || undefined,
      authors: parsedAuthors,
      categories: parsedCategories,
    };

    setIsSubmitting(true);
    try {
      if (editingId != null) {
        await booksService.update(editingId, payload);
        toast.success(t('toastBookUpdated'));
      } else {
        await booksService.create(payload);
        toast.success(t('toastBookCreated'));
      }
      resetForm();
      await invalidateCatalog();
    } catch (err) {
      setError(getLocalizedErrorMessage(err, t));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    setIsDeleting(true);
    try {
      await booksService.remove(bookToDelete.ID);
      toast.success(t('toastBookDeleted'));
      if (editingId === bookToDelete.ID) {
        resetForm();
      }
      setBookToDelete(null);
      await invalidateCatalog();
    } catch (err) {
      toast.error(getLocalizedErrorMessage(err, t));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {editingId != null ? t('editBook') : t('addBook')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField
            label={t('bookTitleLabel')}
            value={book.title}
            onChange={(event) =>
              setBook({ ...book, title: event.target.value })
            }
            disabled={isSubmitting}
          />
          <TextField
            label={t('bookDescriptionLabel')}
            multiline
            minRows={3}
            value={book.description}
            onChange={(event) =>
              setBook({ ...book, description: event.target.value })
            }
            disabled={isSubmitting}
          />
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label={t('price')}
              type="number"
              slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
              value={book.price}
              onChange={(event) =>
                setBook({ ...book, price: event.target.value })
              }
              disabled={isSubmitting}
            />
            <TextField
              fullWidth
              label={t('bookImageLabel')}
              value={book.image ?? ''}
              onChange={(event) =>
                setBook({ ...book, image: event.target.value })
              }
              disabled={isSubmitting}
            />
            <TextField
              fullWidth
              label={t('bookPublisherLabel')}
              value={book.publisher ?? ''}
              onChange={(event) =>
                setBook({ ...book, publisher: event.target.value })
              }
              disabled={isSubmitting}
            />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label={t('bookAuthorsLabel')}
              value={authorText}
              onChange={(event) => setAuthorText(event.target.value)}
              disabled={isSubmitting}
            />
            <TextField
              fullWidth
              label={t('bookCategoriesLabel')}
              value={categoryText}
              onChange={(event) => setCategoryText(event.target.value)}
              disabled={isSubmitting}
            />
            <TextField
              fullWidth
              label={t('bookLanguageLabel')}
              value={book.language ?? ''}
              onChange={(event) =>
                setBook({ ...book, language: event.target.value })
              }
              disabled={isSubmitting}
            />
          </Stack>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label={t('bookPublishedDateLabel')}
              type="date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={book.publishedDate ?? ''}
              onChange={(event) =>
                setBook({ ...book, publishedDate: event.target.value })
              }
              disabled={isSubmitting}
            />
            <TextField
              fullWidth
              label={t('bookPageCountLabel')}
              type="number"
              slotProps={{ htmlInput: { min: 1 } }}
              value={book.pageCount ?? 1}
              onChange={(event) =>
                setBook({
                  ...book,
                  pageCount: Math.max(1, Number(event.target.value) || 1),
                })
              }
              disabled={isSubmitting}
            />
          </Stack>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : undefined
              }
              onClick={() => void handleSubmitBook()}
            >
              {editingId != null ? t('saveBook') : t('createBook')}
            </Button>
            {editingId != null && (
              <Button
                variant="outlined"
                disabled={isSubmitting}
                onClick={resetForm}
              >
                {t('cancel')}
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      <DataTable
        loading={booksQuery.isPending}
        headers={[
          t('idColumn'),
          t('bookTitleLabel'),
          t('price'),
          t('soldCopies'),
          t('actions'),
        ]}
        rows={
          booksQuery.data?.map((item) => [
            item.ID,
            item.title,
            formatCurrency(item.price, language),
            item.soldCopies,
            <Stack direction="row" spacing={1} key={item.ID}>
              <Button
                size="small"
                startIcon={<EditOutlinedIcon fontSize="small" />}
                onClick={() => handleStartEdit(item)}
              >
                {t('edit')}
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteOutlineRoundedIcon fontSize="small" />}
                onClick={() => setBookToDelete(item)}
              >
                {t('remove')}
              </Button>
            </Stack>,
          ]) ?? []
        }
      />

      <ConfirmDialog
        open={bookToDelete != null}
        title={t('confirmDeleteBookTitle')}
        description={t('confirmDeleteBookMessage', {
          title: bookToDelete?.title ?? '',
        })}
        confirmLabel={t('remove')}
        isLoading={isDeleting}
        onConfirm={() => void handleConfirmDelete()}
        onClose={() => setBookToDelete(null)}
      />
    </Stack>
  );
}
