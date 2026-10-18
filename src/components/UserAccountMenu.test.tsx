import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { UserAccountMenu } from '@/components/UserAccountMenu';
import type { User } from '@/interfaces/models';

const reader: User = {
  ID: 7,
  username: 'reader',
  name: 'Jane',
  surname: 'Doe',
  email: 'reader@example.com',
  profilePic: '',
  role: 'user',
  admin: false,
  enabled: true,
  banned: false,
  suspendedTimes: 0,
  createdAt: '2026-01-01T00:00:00Z',
};

function Location() {
  return <output>{useLocation().pathname}</output>;
}

function renderMenu(overrides: Partial<User> = {}) {
  const onLogout = jest.fn();
  render(
    <MemoryRouter>
      <UserAccountMenu user={{ ...reader, ...overrides }} onLogout={onLogout} />
      <Location />
    </MemoryRouter>,
  );
  return { user: userEvent.setup(), onLogout };
}

describe('UserAccountMenu', () => {
  it('starts collapsed and exposes reader account links without admin access', async () => {
    const { user } = renderMenu();
    const trigger = screen.getByRole('button', { name: 'My account' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(screen.getByText('JD')).toBeInTheDocument();

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', 'user-account-menu');
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText(reader.email)).toBeInTheDocument();
    expect(
      screen.getByRole('menuitem', { name: 'My account' }),
    ).toHaveAttribute('href', '/account');
    expect(
      screen.getByRole('menuitem', { name: 'Purchase history' }),
    ).toHaveAttribute('href', '/history');
    expect(
      screen.queryByRole('menuitem', { name: 'Admin dashboard' }),
    ).not.toBeInTheDocument();
  });

  it('offers the admin route only for an admin user', async () => {
    const { user } = renderMenu({ admin: true });
    await user.click(screen.getByRole('button', { name: 'My account' }));
    expect(
      screen.getByRole('menuitem', { name: 'Admin dashboard' }),
    ).toHaveAttribute('href', '/admin');
  });

  it.each([
    ['My account', '/account'],
    ['Purchase history', '/history'],
  ])('navigates to %s and closes the menu', async (label, path) => {
    const { user, onLogout } = renderMenu();
    await user.click(screen.getByRole('button', { name: 'My account' }));
    await user.click(screen.getByRole('menuitem', { name: label }));
    expect(screen.getByRole('status')).toHaveTextContent(path);
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
    expect(onLogout).not.toHaveBeenCalled();
  });

  it('closes on Escape without logging out and restores focus', async () => {
    const { user, onLogout } = renderMenu();
    const trigger = screen.getByRole('button', { name: 'My account' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(onLogout).not.toHaveBeenCalled();
  });

  it('signs out once and closes the menu', async () => {
    const { user, onLogout } = renderMenu();
    await user.click(screen.getByRole('button', { name: 'My account' }));
    await user.click(screen.getByRole('menuitem', { name: 'Sign out' }));
    expect(onLogout).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
  });

  it('uses username initials and username when the full name is absent', async () => {
    const { user } = renderMenu({ name: '', surname: '' });
    expect(screen.getByText('RE')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'My account' }));
    expect(screen.getByText('reader')).toBeInTheDocument();
  });

  it('uses the profile picture with the full name as alternative text', () => {
    renderMenu({ profilePic: '/avatar.png' });
    expect(screen.getByRole('img', { name: 'Jane Doe' })).toHaveAttribute(
      'src',
      '/avatar.png',
    );
  });
});
