import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LanguageIcon from '@mui/icons-material/Language';
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { useCart } from '@/modules/account/context/CartContext';
import { useFavorites } from '@/modules/account/context/FavoritesContext';
import { useUi } from '@/modules/ui/context/UiContext';
import i18n from '@/i18n';
import bookLogo from '@/assets/Book_Logo.png';
import SearchBox from '@/components/SearchBox';

function getUserInitials(user: {
  name?: string;
  surname?: string;
  username?: string;
}): string {
  const firstName = user.name?.trim() ?? '';
  const lastName = user.surname?.trim() ?? '';
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
  if (firstName) {
    const parts = firstName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return firstName.slice(0, 2).toUpperCase();
  }
  if (lastName) {
    return lastName.slice(0, 2).toUpperCase();
  }
  return (user.username?.trim().slice(0, 2) || 'U').toUpperCase();
}

export default function AppShell() {
  const { user, logout } = useAuth();
  const { items: cart } = useCart();
  const { items: favorites } = useFavorites();
  const { language, setLanguage } = useUi();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [navMenuAnchor, setNavMenuAnchor] = useState<HTMLElement | null>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(
    null,
  );

  const navLinks = [
    { label: t('home'), to: '/' },
    { label: t('browse'), to: '/books' },
    { label: t('contact'), to: '/contact' },
  ];

  const isActiveLink = (to: string) =>
    to === '/'
      ? location.pathname === '/'
      : location.pathname === to || location.pathname.startsWith(`${to}/`);

  const changeLanguage = async () => {
    const next = language === 'en' ? 'es' : 'en';
    setLanguage(next);
    await i18n.changeLanguage(next);
  };

  const fullName = user
    ? [user.name, user.surname].filter(Boolean).join(' ').trim() ||
      user.username
    : '';
  const initials = user ? getUserInitials(user) : '';

  const handleLogout = () => {
    setUserMenuAnchor(null);
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(221, 181, 119, 0.96)',
          backdropFilter: 'blur(8px)',
          color: '#1e110b',
          borderBottom: '1px solid rgba(103, 69, 51, 0.25)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{ gap: { xs: 1, md: 2 }, minHeight: '64px !important' }}
          >
            <IconButton
              aria-label="Open navigation"
              onClick={(event) => setNavMenuAnchor(event.currentTarget)}
              sx={{
                display: { xs: 'inline-flex', md: 'none' },
                color: 'inherit',
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: 'inherit',
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={bookLogo}
                alt=""
                sx={{ width: 38, height: 38 }}
              />
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 19,
                  letterSpacing: '-0.02em',
                }}
              >
                Bookstore
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={0.5}
              sx={{ ml: 2, display: { xs: 'none', md: 'flex' } }}
            >
              {navLinks.map((link) => {
                const active = isActiveLink(link.to);
                return (
                  <Button
                    component={Link}
                    to={link.to}
                    key={link.to}
                    color="inherit"
                    sx={{
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 1.5,
                      fontWeight: active ? 700 : 600,
                      bgcolor: active ? 'rgba(30, 17, 11, 0.1)' : 'transparent',
                      '&:hover': {
                        bgcolor: 'rgba(30, 17, 11, 0.08)',
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                );
              })}
            </Stack>

            <Box
              sx={{
                flex: 1,
                maxWidth: 340,
                ml: 'auto',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              <SearchBox />
            </Box>

            <Stack
              direction="row"
              spacing={{ xs: 0.5, sm: 1 }}
              sx={{ alignItems: 'center', ml: { xs: 'auto', sm: 0 } }}
            >
              <Button
                onClick={changeLanguage}
                color="inherit"
                size="small"
                startIcon={<LanguageIcon fontSize="small" />}
                sx={{
                  minWidth: 'auto',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1.5,
                  fontWeight: 700,
                  '&:hover': { bgcolor: 'rgba(30, 17, 11, 0.08)' },
                }}
              >
                {language.toUpperCase()}
              </Button>

              {user ? (
                <>
                  <Tooltip title={t('favorites')}>
                    <IconButton
                      aria-label={t('favorites')}
                      component={Link}
                      to="/favorites"
                      color="inherit"
                    >
                      <Badge badgeContent={favorites.length} color="primary">
                        <FavoriteBorderIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title={t('cart')}>
                    <IconButton
                      aria-label={t('cart')}
                      component={Link}
                      to="/cart"
                      color="inherit"
                    >
                      <Badge badgeContent={cart.length} color="primary">
                        <ShoppingCartOutlinedIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  <Button
                    aria-label={t('account')}
                    aria-controls={
                      userMenuAnchor ? 'user-account-menu' : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={Boolean(userMenuAnchor)}
                    onClick={(event) => setUserMenuAnchor(event.currentTarget)}
                    color="inherit"
                    sx={{
                      p: 0.5,
                      pl: 0.75,
                      pr: 1,
                      minWidth: 'auto',
                      borderRadius: 999,
                      gap: 0.75,
                      border: '1px solid rgba(30, 17, 11, 0.2)',
                      bgcolor: 'rgba(255, 250, 240, 0.45)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 250, 240, 0.75)',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: '#674533',
                        color: '#fffaf0',
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {initials}
                    </Avatar>
                    <KeyboardArrowDownIcon
                      fontSize="small"
                      sx={{
                        transition: 'transform 0.2s',
                        transform: userMenuAnchor ? 'rotate(180deg)' : 'none',
                      }}
                    />
                  </Button>

                  <Menu
                    id="user-account-menu"
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={() => setUserMenuAnchor(null)}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    slotProps={{
                      paper: {
                        elevation: 4,
                        sx: {
                          mt: 1,
                          minWidth: 230,
                          borderRadius: 2,
                          bgcolor: '#fffaf0',
                          border: '1px solid rgba(103, 69, 51, 0.2)',
                        },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        px: 2,
                        py: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          bgcolor: '#674533',
                          color: '#fffaf0',
                          fontSize: 15,
                          fontWeight: 700,
                        }}
                      >
                        {initials}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 700 }}
                          noWrap
                        >
                          {fullName}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: 'block' }}
                          noWrap
                        >
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider />

                    <MenuItem
                      component={Link}
                      to="/account"
                      onClick={() => setUserMenuAnchor(null)}
                    >
                      <ListItemIcon>
                        <PersonOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                      {t('account')}
                    </MenuItem>

                    <MenuItem
                      component={Link}
                      to="/history"
                      onClick={() => setUserMenuAnchor(null)}
                    >
                      <ListItemIcon>
                        <ReceiptLongOutlinedIcon fontSize="small" />
                      </ListItemIcon>
                      {t('purchaseHistory')}
                    </MenuItem>

                    {user.admin && (
                      <MenuItem
                        component={Link}
                        to="/admin"
                        onClick={() => setUserMenuAnchor(null)}
                      >
                        <ListItemIcon>
                          <AdminPanelSettingsOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        {t('adminDashboard')}
                      </MenuItem>
                    )}

                    <Divider />

                    <MenuItem
                      onClick={handleLogout}
                      sx={{ color: 'error.main' }}
                    >
                      <ListItemIcon sx={{ color: 'error.main' }}>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      {t('signOut')}
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  sx={{ borderRadius: 1.5, px: 2 }}
                >
                  {t('signIn')}
                </Button>
              )}
            </Stack>

            <Menu
              anchorEl={navMenuAnchor}
              open={Boolean(navMenuAnchor)}
              onClose={() => setNavMenuAnchor(null)}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1,
                    minWidth: 180,
                    bgcolor: '#fffaf0',
                  },
                },
              }}
            >
              {navLinks.map((link) => (
                <MenuItem
                  component={Link}
                  to={link.to}
                  key={link.to}
                  selected={isActiveLink(link.to)}
                  onClick={() => setNavMenuAnchor(null)}
                >
                  {link.label}
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="main" sx={{ flex: 1, py: { xs: 2, md: 3 } }}>
        <Outlet />
      </Box>
      <Box
        component="footer"
        sx={{ py: 2, bgcolor: '#674533e6', color: '#fffaf0' }}
      >
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
