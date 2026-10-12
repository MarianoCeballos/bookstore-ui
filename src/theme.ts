import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#805436', dark: '#674533', light: '#ddb577' },
    secondary: { main: '#1e110b' },
    background: { default: '#dfc99a', paper: '#fffaf0' },
    text: { primary: '#1e110b', secondary: '#674533' },
  },
  shape: { borderRadius: 5 },
  typography: {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 750 },
    h4: { fontWeight: 750 },
    button: { textTransform: 'none', fontWeight: 650 },
  },
});

export default theme;
