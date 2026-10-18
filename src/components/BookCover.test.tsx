import { fireEvent, render, screen } from '@testing-library/react';
import { BookCover } from '@/components/BookCover';

describe('BookCover', () => {
  it('trims the image URL and supplies a lazy, accessible cover', () => {
    render(<BookCover src="  /cover.jpg  " title="Dune" />);
    const cover = screen.getByRole('img', { name: /Dune/ });
    expect(cover).toHaveAttribute('src', '/cover.jpg');
    expect(cover).toHaveAttribute('loading', 'lazy');
  });

  it.each([undefined, null, '', '   '])(
    'renders a readable fallback for source %p',
    (src) => {
      render(<BookCover src={src} title="Dune" author="Frank Herbert" />);
      expect(screen.getByRole('img', { name: /Dune/ })).not.toHaveAttribute(
        'src',
      );
      expect(screen.getByText('Dune')).toBeInTheDocument();
      expect(screen.getByText('Frank Herbert')).toBeInTheDocument();
    },
  );

  it('falls back after an image error and retries a different source', () => {
    const { rerender } = render(<BookCover src="/broken.jpg" title="Dune" />);
    fireEvent.error(screen.getByRole('img', { name: /Dune/ }));
    expect(screen.getByText('Dune')).toBeInTheDocument();
    rerender(<BookCover src="/replacement.jpg" title="Dune" />);
    expect(screen.getByRole('img', { name: /Dune/ })).toHaveAttribute(
      'src',
      '/replacement.jpg',
    );
  });

  it('keeps a failed source in fallback mode on rerender', () => {
    const { rerender } = render(<BookCover src="/broken.jpg" title="Dune" />);
    fireEvent.error(screen.getByRole('img', { name: /Dune/ }));
    rerender(<BookCover src=" /broken.jpg " title="Emma" />);
    expect(screen.getByRole('img', { name: /Emma/ })).not.toHaveAttribute(
      'src',
    );
    expect(screen.getByText('Emma')).toBeInTheDocument();
  });

  it('retains the accessible name in the compact fallback', () => {
    render(<BookCover title="Dune" author="Frank Herbert" variant="compact" />);
    expect(screen.getByRole('img', { name: /Dune/ })).toBeInTheDocument();
    expect(screen.queryByText('Dune')).not.toBeInTheDocument();
    expect(screen.queryByText('Frank Herbert')).not.toBeInTheDocument();
  });
});
