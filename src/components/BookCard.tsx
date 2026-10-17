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
import { BookCover } from '@/components/BookCover';
import type { Book } from '@/interfaces/models';

export default function BookCard({ book }: { book: Book }) {
  const { t } = useTranslation();
  const primaryAuthors =
    book.authors.length > 0 ? book.authors.join(', ') : t('unknownAuthor');

  return (
    <Card
      component="article"
      variant="outlined"
      className="book-card"
      sx={{ height: '100%', display: 'flex' }}
    >
      <BookCover
        src={book.image}
        title={book.title}
        author={book.authors[0]}
        variant="card"
        className="book-card__cover"
      />
      <Box
        sx={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <CardContent sx={{ flex: 1, p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Typography
            component={Link}
            to={`/books/${book.ID}`}
            variant="h6"
            color="inherit"
            sx={{
              textDecoration: 'none',
              fontSize: '1rem',
              lineHeight: 1.3,
              fontWeight: 700,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {book.title}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
            sx={{
              mt: 0.5,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {primaryAuthors}
          </Typography>
          <Stack
            direction="row"
            spacing={0.5}
            sx={{ mt: 1, alignItems: 'center' }}
          >
            <Rating value={book.rating} precision={0.1} readOnly size="small" />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {book.rating > 0 ? book.rating.toFixed(1) : t('noRatingsYet')}
            </Typography>
          </Stack>
        </CardContent>
        <CardActions
          sx={{ px: 1.5, pt: 0, pb: 1.25, justifyContent: 'space-between' }}
        >
          <Typography sx={{ fontWeight: 700 }}>
            ${Number(book.price).toFixed(2)}
          </Typography>
          <Button
            component={Link}
            to={`/books/${book.ID}`}
            size="small"
            variant="outlined"
          >
            {t('view')}
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
}
