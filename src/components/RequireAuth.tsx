import { Navigate, Outlet, useLocation } from 'react-router-dom';
import PageLoader from '@/components/PageLoader';
import { AuthenticatedUserProvider } from '@/modules/auth/context/AuthenticatedUserContext';
import { useAuth } from '@/modules/auth/context/AuthContext';

export default function RequireAuth({ admin = false }: { admin?: boolean }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <PageLoader minHeight="60vh" />;
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (admin && !user.admin) return <Navigate to="/" replace />;
  return (
    <AuthenticatedUserProvider user={user}>
      <Outlet />
    </AuthenticatedUserProvider>
  );
}
