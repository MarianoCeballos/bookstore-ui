import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { useCart } from '@/modules/account/context/CartContext';
import { useFavorites } from '@/modules/account/context/FavoritesContext';
import { useUi } from '@/modules/ui/context/UiContext';
import i18n from '@/i18n';
import bookLogo from '@/assets/Book_Logo.png';
import SearchBox from '@/components/SearchBox';

export default function AppShell() {
  const { user, logout } = useAuth();
  const { items: cart } = useCart();
  const { items: favorites } = useFavorites();
  const { language, setLanguage } = useUi();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const links = [
    { label: t('home'), to: '/' },
    { label: t('browse'), to: '/books' },
    ...(user
      ? [
          { label: t('favorites'), to: '/favorites', count: favorites.length },
          { label: t('cart'), to: '/cart', count: cart.length },
          { label: t('account'), to: '/account' },
        ]
      : []),
    { label: t('contact'), to: '/contact' },
    ...(user?.admin ? [{ label: 'Admin', to: '/admin' }] : []),
  ];

  const changeLanguage = async () => {
    const next = language === 'en' ? 'es' : 'en';
    setLanguage(next);
    await i18n.changeLanguage(next);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="sticky"
        elevation={2}
        sx={{
          bgcolor: '#ddb577',
          color: '#1e110b',
          borderBottom: '1px solid #a97452',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ gap: { xs: 1, md: 2 }, minHeight: '58px !important' }}>
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                color: 'inherit',
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              <Box component="img" src={bookLogo} alt="" sx={{ width: 39, height: 39 }} />
              <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontSize: 18, fontWeight: 700 }}>
                Bookstore
              </Typography>
            </Box>
            <Box
              sx={{ flex: 1, maxWidth: 330, ml: { xs: 0, md: 2 }, display: { xs: 'none', sm: 'block' } }}
            >
              <SearchBox />
            </Box>
            <Stack
              direction="row"
              spacing={0.5}
              sx={{ ml: 'auto', display: { xs: 'none', lg: 'flex' } }}
            >
              {links.map((link) => (
                <Button
                  component={Link}
                  to={link.to}
                  key={link.to}
                  color="inherit"
                  endIcon={link.count ? <Typography variant="caption">{link.count}</Typography> : undefined}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
            <Button onClick={changeLanguage} color="inherit" sx={{ minWidth: 42, px: 0.5 }}>
              {language.toUpperCase()}
            </Button>
            {user ? (
              <Button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                color="inherit"
              >
                {t('signOut')}
              </Button>
            ) : (
              <Button component={Link} to="/login" variant="contained">
                {t('signIn')}
              </Button>
            )}
            <IconButton
              aria-label="Open navigation"
              onClick={(event) => setMenuAnchor(event.currentTarget)}
              sx={{ display: { xs: 'inline-flex', lg: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
            >
              {links.map((link) => (
                <MenuItem
                  component={Link}
                  to={link.to}
                  key={link.to}
                  onClick={() => setMenuAnchor(null)}
                >
                  {link.label}
                </MenuItem>
              ))}
            </Menu>
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.25 }}>
              {user && (
                <>
                  <IconButton aria-label="Favorite" component={Link} to="/favorites">
                    <FavoriteBorderIcon />
                  </IconButton>
                  <IconButton aria-label="Cart" component={Link} to="/cart">
                    <ShoppingCartOutlinedIcon />
                  </IconButton>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="main" sx={{ flex: 1, py: { xs: 2, md: 3 } }}>
        <Outlet />
      </Box>
      <Box component="footer" sx={{ py: 2, bgcolor: '#674533e6', color: '#fffaf0' }}>
        <Container maxWidth="xl">
          <Typography variant="body2">
            © {new Date().getFullYear()} Bookstore · Stories worth keeping.
          </Typography>
        </Container>
      </Box>
      <Toaster richColors position="top-right" />
    </Box>
  );
}
