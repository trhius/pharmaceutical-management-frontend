import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role === 'PHARMACIST' && location.pathname === '/orders/create') {
    return <Navigate to="/orders/create" />;
  }

  return <>{children}</>;
}
