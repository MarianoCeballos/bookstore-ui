import { ROUTES } from '@/constants';
import { Box, Container, Typography } from '@mui/material';
import { t } from 'i18next';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        zIndex: (theme) => theme.zIndex.appBar - 1,
        py: 2,
        bgcolor: '#4a2f22',
        color: '#fffaf0',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Bookstore · {t('footerTagline')}
        </Typography>
        <Link to={ROUTES.CONTACT} style={{ color: '#fffaf0' }}>
          {t('contact')}
        </Link>
      </Container>
    </Box>
  );
};
