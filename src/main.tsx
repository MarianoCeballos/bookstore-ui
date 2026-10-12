import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/modules/auth/context/AuthContext';
import { CartProvider } from '@/modules/account/context/CartContext';
import { FavoritesProvider } from '@/modules/account/context/FavoritesContext';
import { UiProvider } from '@/modules/ui/context/UiContext';
import AppRouter from '@/routes/AppRouter';
import theme from '@/theme';
import '@/i18n';
import '@/styles/global.scss';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <UiProvider>
          <AuthProvider>
            <CartProvider>
              <FavoritesProvider>
                <AppRouter />
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </UiProvider>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
