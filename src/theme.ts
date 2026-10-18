import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#674533',
      dark: '#4a2f22',
      light: '#ddb577',
      contrastText: '#fffaf0',
    },
    secondary: {
      main: '#1e110b',
      contrastText: '#fffaf0',
    },
    error: {
      main: '#a62626',
    },
    success: {
      main: '#24663b',
    },
    warning: {
      main: '#9a5b13',
    },
    background: {
      default: '#dfc99a',
      paper: '#fffaf0',
    },
    text: {
      primary: '#1e110b',
      secondary: '#4e3325',
    },
    divider: 'rgba(103, 69, 51, 0.24)',
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    h1: { fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontWeight: 800, letterSpacing: '-0.02em' },
    h3: { fontWeight: 750, letterSpacing: '-0.015em' },
    h4: { fontWeight: 750, letterSpacing: '-0.01em' },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 650 },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&:focus-visible': {
            outline: '2px solid #4a2f22',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          paddingInline: 16,
          paddingBlock: 8,
        },
        outlined: {
          borderColor: 'rgba(103, 69, 51, 0.48)',
          '&:hover': {
            borderColor: '#4a2f22',
            backgroundColor: 'rgba(103, 69, 51, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          borderColor: 'rgba(103, 69, 51, 0.28)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
        outlined: {
          borderColor: 'rgba(103, 69, 51, 0.45)',
          color: '#3b2418',
        },
      },
    },
  },
});

export default theme;
