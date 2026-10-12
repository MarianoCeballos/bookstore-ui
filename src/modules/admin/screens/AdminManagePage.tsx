import { useState, type ReactNode } from 'react';
import {
  Alert,
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { BookInput } from '@/interfaces/models';
import { adminService } from '@/modules/admin/services/admin.service';
import { booksService } from '@/modules/catalog/services/books.service';
import { accountService } from '@/modules/account/services/account.service';
import { useTranslation } from 'react-i18next';

const sections = ['books', 'users', 'reviews', 'orders'] as const;
type Section = (typeof sections)[number];

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

export default function AdminManagePage() {
  const { t } = useTranslation();
  const section = useParams().section as Section;
  const client = useQueryClient();
  const [query, setQuery] = useState('');
  const [book, setBook] = useState(initialBook);
  const [authorText, setAuthorText] = useState('');
  const [categoryText, setCategoryText] = useState('');
  const [error, setError] = useState('');
  const books = useQuery({
    queryKey: ['admin', 'books'],
    queryFn: adminService.books,
    enabled: section === 'books',
  });
  const users = useQuery({
    queryKey: ['admin', 'users', query],
    queryFn: () => adminService.users(query || undefined),
    enabled: section === 'users',
  });
  const reviews = useQuery({
    queryKey: ['admin', 'reviews'],
    queryFn: adminService.reviews,
    enabled: section === 'reviews',
  });
  const orders = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: adminService.orders,
    enabled: section === 'orders',
  });

  if (!sections.includes(section)) {
    return (
      <Container>
        <Alert severity="warning">Choose a management section.</Alert>
      </Container>
    );
  }

  const run = async (
    action: () => Promise<unknown>,
    success: string,
    keys: string[],
  ) => {
    try {
      await action();
      toast.success(success);
      await Promise.all(
        keys.map((key) => client.invalidateQueries({ queryKey: [key] })),
      );
    } catch {
      toast.error('The requested change could not be completed.');
    }
  };

  const createBook = async () => {
    setError('');
    if (
      !book.title.trim() ||
      !book.description.trim() ||
      !book.image?.trim() ||
      !book.price.trim()
    ) {
      setError('Title, description, price, and cover image are required.');
      return;
    }
    try {
      await booksService.create({
        ...book,
        authors: authorText
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean)
          .map((value) => ({ value })),
        categories: categoryText
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean)
          .map((value) => ({ value })),
      });
      toast.success('Book added to the catalog.');
      setBook(initialBook);
      setAuthorText('');
      setCategoryText('');
      await client.invalidateQueries({ queryKey: ['admin', 'books'] });
    } catch {
      setError(
        'The book could not be created. Check the values and try again.',
      );
    }
  };

  return (
    <Container maxWidth="xl">
      <Button component={Link} to="/admin" sx={{ mb: 1 }}>
        {t('backDashboard')}
      </Button>
      <Typography variant="h3" sx={{ mb: 3 }}>
        {t('manage')} {section}
      </Typography>
      {section === 'books' && (
        <Stack spacing={3}>
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {t('addBook')}
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Stack spacing={2}>
              <TextField
                label="Title"
                value={book.title}
                onChange={(event) =>
                  setBook({ ...book, title: event.target.value })
                }
              />
              <TextField
                label="Description"
                multiline
                minRows={3}
                value={book.description}
                onChange={(event) =>
                  setBook({ ...book, description: event.target.value })
                }
              />
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
                  value={book.price}
                  onChange={(event) =>
                    setBook({ ...book, price: event.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label="Cover image URL"
                  value={book.image}
                  onChange={(event) =>
                    setBook({ ...book, image: event.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label="Publisher"
                  value={book.publisher}
                  onChange={(event) =>
                    setBook({ ...book, publisher: event.target.value })
                  }
                />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Authors (comma separated)"
                  value={authorText}
                  onChange={(event) => setAuthorText(event.target.value)}
                />
                <TextField
                  fullWidth
                  label="Categories (comma separated)"
                  value={categoryText}
                  onChange={(event) => setCategoryText(event.target.value)}
                />
                <TextField
                  fullWidth
                  label="Language"
                  value={book.language}
                  onChange={(event) =>
                    setBook({ ...book, language: event.target.value })
                  }
                />
              </Stack>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label="Published date"
                  type="date"
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={book.publishedDate}
                  onChange={(event) =>
                    setBook({ ...book, publishedDate: event.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label="Page count"
                  type="number"
                  slotProps={{ htmlInput: { min: 1 } }}
                  value={book.pageCount}
                  onChange={(event) =>
                    setBook({ ...book, pageCount: Number(event.target.value) })
                  }
                />
              </Stack>
              <Button variant="contained" onClick={createBook}>
                {t('createBook')}
              </Button>
            </Stack>
          </Paper>
          <DataTable
            headers={['ID', 'Title', 'Price', 'Sold', 'Actions']}
            rows={
              books.data?.map((item) => [
                item.ID,
                item.title,
                `$${Number(item.price).toFixed(2)}`,
                item.soldCopies,
                <Button
                  key="remove"
                  color="error"
                  onClick={() =>
                    run(() => booksService.remove(item.ID), 'Book removed.', [
                      'admin',
                      'books',
                    ])
                  }
                >
                  {t('remove')}
                </Button>,
              ]) ?? []
            }
          />
        </Stack>
      )}
      {section === 'users' && (
        <Stack spacing={2}>
          <TextField
            label={t('filterUsername')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            sx={{ maxWidth: 400 }}
          />
          <DataTable
            headers={['ID', 'Username', 'Email', 'Status', 'Actions']}
            rows={
              users.data?.map((item) => [
                item.ID,
                item.username,
                item.email,
                item.enabled ? t('enabled') : t('suspended'),
                <Stack direction="row" key="actions">
                  <TextField
                    select
                    size="small"
                    defaultValue="enabled"
                    label={t('accountStatus')}
                    onChange={(event) =>
                      run(
                        () =>
                          accountService.setUserStatus(
                            item.ID,
                            event.target.value as
                              | 'suspended'
                              | 'enabled'
                              | 'admin',
                          ),
                        'Account status updated.',
                        ['admin', 'users'],
                      )
                    }
                  >
                    <MenuItem value="enabled">{t('enable')}</MenuItem>
                    <MenuItem value="suspended">{t('suspend')}</MenuItem>
                    <MenuItem value="admin">{t('toggleAdmin')}</MenuItem>
                  </TextField>
                  <Button
                    color="error"
                    onClick={() =>
                      run(
                        () => accountService.removeUser(item.ID),
                        'User banned.',
                        ['admin', 'users'],
                      )
                    }
                  >
                    {t('ban')}
                  </Button>
                </Stack>,
              ]) ?? []
            }
          />
        </Stack>
      )}
      {section === 'reviews' && (
        <DataTable
          headers={[
            'ID',
            t('reviewTitle'),
            t('rating'),
            t('reports'),
            t('actions'),
          ]}
          rows={
            reviews.data?.map((item) => [
              item.ID,
              item.title,
              item.rating,
              item.reports.length,
              <Button
                key="remove"
                color="error"
                onClick={() =>
                  run(
                    () => accountService.deleteReview(item.ID),
                    'Review removed.',
                    ['admin', 'reviews'],
                  )
                }
              >
                {t('remove')}
              </Button>,
            ]) ?? []
          }
        />
      )}
      {section === 'orders' && (
        <DataTable
          headers={['ID', 'Date', t('status'), 'Items', t('total')]}
          rows={
            orders.data?.map((item) => [
              item.ID,
              new Date(item.createdAt).toLocaleString(),
              item.status,
              item.items.length,
              `$${Number(item.total).toFixed(2)}`,
            ]) ?? []
          }
        />
      )}
    </Container>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <Paper variant="outlined" sx={{ overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </TableRow>
          ))}
          {!rows.length && (
            <TableRow>
              <TableCell colSpan={headers.length}>No records found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
}
