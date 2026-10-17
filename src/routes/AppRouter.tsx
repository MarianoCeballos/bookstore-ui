import { CircularProgress, Stack } from '@mui/material';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppShell from '@/components/AppShell';
import RequireAuth from '@/components/RequireAuth';

const CatalogPage = lazy(() => import('@/modules/catalog/screens/CatalogPage'));
const BookDetailPage = lazy(
  () => import('@/modules/catalog/screens/BookDetailPage'),
);
const AuthPage = lazy(() => import('@/modules/auth/screens/AuthPage'));
const ConfirmPage = lazy(() => import('@/modules/auth/screens/ConfirmPage'));
const PasswordResetPage = lazy(
  () => import('@/modules/auth/screens/PasswordResetPage'),
);
const ContactPage = lazy(() => import('@/modules/contact/screens/ContactPage'));
const AccountPage = lazy(() => import('@/modules/account/screens/AccountPage'));
const CartPage = lazy(() => import('@/modules/account/screens/CartPage'));
const FavoritesPage = lazy(
  () => import('@/modules/account/screens/FavoritesPage'),
);
const HistoryPage = lazy(() => import('@/modules/account/screens/HistoryPage'));
const PaymentResultPage = lazy(
  () => import('@/modules/payments/screens/PaymentResultPage'),
);
const AdminDashboardPage = lazy(
  () => import('@/modules/admin/screens/AdminDashboardPage'),
);
const AdminManagePage = lazy(
  () => import('@/modules/admin/screens/AdminManagePage'),
);
const NotFoundPage = lazy(() => import('@/modules/ui/screens/NotFoundPage'));

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <CatalogPage featured /> },
      { path: '/books', element: <CatalogPage /> },
      { path: '/books/:id', element: <BookDetailPage /> },
      { path: '/login', element: <AuthPage /> },
      { path: '/register', element: <AuthPage register /> },
      { path: '/confirm', element: <ConfirmPage /> },
      { path: '/password-reset', element: <PasswordResetPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/payment/result', element: <PaymentResultPage /> },
      { path: '/checkout/validate', element: <PaymentResultPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: '/account', element: <AccountPage /> },
          { path: '/cart', element: <CartPage /> },
          { path: '/favorites', element: <FavoritesPage /> },
          { path: '/history', element: <HistoryPage /> },
        ],
      },
      {
        path: '/admin',
        element: <RequireAuth admin />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: ':section', element: <AdminManagePage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function AppRouter() {
  return (
    <Suspense
      fallback={
        <Stack role="status" sx={{ py: 12, alignItems: 'center' }}>
          <CircularProgress />
        </Stack>
      }
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}
