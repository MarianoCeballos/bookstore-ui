import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BookCard from '@/components/BookCard';
import type { Book } from '@/interfaces/models';

const book: Book = {
  ID: 7,
  title: 'A Story to Keep',
  description: 'A test description',
  price: '12.50',
  image: 'https://example.test/cover.jpg',
  authors: ['Alex Reader'],
  categories: ['Fiction'],
  publisher: 'Book House',
  publishedDate: '2025-01-01',
  pageCount: 250,
  rating: 4.5,
  language: 'English',
  avgReadingTime: 200,
  soldCopies: 3,
};

describe('BookCard', () => {
  it('renders the book details and links to its detail page', () => {
    render(
      <MemoryRouter>
        <BookCard book={book} />
      </MemoryRouter>,
    );

    expect(screen.getByText('A Story to Keep')).toHaveAttribute('href', '/books/7');
    expect(screen.getByText('$12.50')).toBeInTheDocument();
    expect(screen.getByAltText('Cover of A Story to Keep')).toBeInTheDocument();
  });
});
