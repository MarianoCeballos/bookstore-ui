import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { CircularProgress, Stack } from '@mui/material';
import { useAuth } from '@/modules/auth/context/AuthContext';

export default function RequireAuth({ admin = false }: { admin?: boolean }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <Stack sx={{ py: 12, alignItems: 'center' }}>
        <CircularProgress />
      </Stack>
    );
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (admin && !user.admin) return <Navigate to="/" replace />;
  return <Outlet />;
}
