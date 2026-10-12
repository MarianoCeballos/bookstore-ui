import {
  Button,
  Card,
  CardActions,
  CardContent,
  Rating,
  Stack,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Book } from '@/interfaces/models';

export default function BookCard({ book }: { book: Book }) {
  const { t } = useTranslation();
  return (
    <Card component="article" variant="outlined" className="book-card" sx={{ height: '100%', display: 'flex' }}>
      <Box
        component="img"
        src={book.image || ''}
        alt={t('bookCover', { title: book.title })}
        className="book-card__cover"
        width={118}
        height={176}
        loading="lazy"
        decoding="async"
      />
      <Box sx={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: 1, p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Typography
            component={Link}
            to={`/books/${book.ID}`}
            variant="h6"
            color="inherit"
            sx={{ textDecoration: 'none', fontSize: '1rem', lineHeight: 1.3, fontWeight: 700 }}
          >
            {book.title}
          </Typography>
          <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
            {book.authors.join(', ')}
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ mt: 1, alignItems: 'center' }}>
            <Rating value={book.rating} precision={0.1} readOnly size="small" />
            <Typography variant="caption">{book.rating.toFixed(1)}</Typography>
          </Stack>
        </CardContent>
        <CardActions sx={{ px: 1.5, pt: 0, pb: 1.25, justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 700 }}>${Number(book.price).toFixed(2)}</Typography>
          <Button component={Link} to={`/books/${book.ID}`} size="small">
            {t('view')}
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
}
