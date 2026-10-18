import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LanguageIcon from '@mui/icons-material/Language';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import bookLogo from '@/assets/Book_Logo.png';
import PageLoader from '@/components/PageLoader';
import SearchBox from '@/components/SearchBox';
import { Toaster } from '@/components/Toaster';
import { UserAccountMenu } from '@/components/UserAccountMenu';
import { ROUTES } from '@/constants';
import { useCart } from '@/modules/account/context/CartContext';
import { useFavorites } from '@/modules/account/context/FavoritesContext';
import { useAuth } from '@/modules/auth/context/AuthContext';
import { useUi } from '@/modules/ui/context/UiContext';
import { Footer } from '@/components/Footer';

export default function AppShell() {
  const { user, logout } = useAuth();
  const { items: cart } = useCart();
  const { items: favorites } = useFavorites();
  const { language, setLanguage } = useUi();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [navMenuAnchor, setNavMenuAnchor] = useState<HTMLElement | null>(null);

  type NavLink = {
    label: string;
    to: string;
  };

  const navLinks: NavLink[] = [
    { label: t('home'), to: ROUTES.HOME },
    { label: t('browse'), to: ROUTES.BOOKS },
  ];

  const isActiveLink = (to: string) =>
    to === ROUTES.HOME
      ? location.pathname === ROUTES.HOME
      : location.pathname === to || location.pathname.startsWith(`${to}/`);

  const changeLanguage = () => {
    const next = language === 'en' ? 'es' : 'en';
    setLanguage(next);
  };

  const handleLogout = () => {
    logout();
    toast.info(t('toastSignedOut'), {
      description: t('toastSignedOutDescription'),
    });
    navigate(ROUTES.HOME);
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
              aria-label={t('openNavigation')}
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
              to={ROUTES.HOME}
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

            {!isSmallScreen && (
              <Box
                sx={{
                  flex: 1,
                  maxWidth: 340,
                  ml: 'auto',
                }}
              >
                <SearchBox />
              </Box>
            )}

            <Stack
              direction="row"
              spacing={{ xs: 0.5, sm: 1 }}
              sx={{ alignItems: 'center', ml: { xs: 'auto', sm: 0 } }}
            >
              <Button
                onClick={changeLanguage}
                aria-label={t('languageSelector')}
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
                      to={ROUTES.FAVORITES}
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
                      to={ROUTES.CART}
                      color="inherit"
                    >
                      <Badge badgeContent={cart.length} color="primary">
                        <ShoppingCartOutlinedIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>

                  <UserAccountMenu user={user} onLogout={handleLogout} />
                </>
              ) : (
                <Button
                  component={Link}
                  to={ROUTES.LOGIN}
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

          {isSmallScreen && (
            <Box sx={{ pb: 1.25 }}>
              <SearchBox />
            </Box>
          )}
        </Container>
      </AppBar>
      <Box component="main" sx={{ flex: 1, py: { xs: 2, md: 3 } }}>
        {/* Route chunks are lazy-loaded, so keep the header and footer in place
            and only swap the page content while a screen's code arrives. */}
        <Suspense fallback={<PageLoader minHeight="60vh" />}>
          <Outlet />
        </Suspense>
      </Box>
      <Footer />
      <Toaster />
    </Box>
  );
}
