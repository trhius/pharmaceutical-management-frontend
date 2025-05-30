import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { AppLayout } from '@/components/layout/app-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';

// Auth Pages
import LoginPage from '@/pages/auth/login';
import ForgotPasswordPage from '@/pages/auth/forgot-password';
import ResetPasswordPage from '@/pages/auth/reset-password';

// Dashboard Pages
import DashboardPage from '@/pages/dashboard';

// Employee Pages
import EmployeesListPage from '@/pages/employees/list';

// Customer Pages
import CustomersListPage from '@/pages/customers/list';

// Product Pages
import ProductsListPage from '@/pages/products/list';
import UpdatePricesPage from '@/pages/products/update-prices';

// Provider Pages
import ProvidersListPage from '@/pages/providers/list';

// Order Pages
import OrdersListPage from '@/pages/orders/list';
import CreateOrderPage from '@/pages/orders/create';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to login if not authenticated and not on auth pages
  useEffect(() => {
    const isAuthPage = location.pathname === '/login' || location.pathname === '/forgot-password' || location.pathname.startsWith('/reset-password');

    if (!isAuthenticated && !isAuthPage) {
      navigate('/login');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />

        {/* Employee Routes */}
        <Route path="/employees" element={<EmployeesListPage />} />

        {/* Customer Routes */}
        <Route path="/customers" element={<CustomersListPage />} />

        {/* Product Routes */}
        <Route path="/products" element={<ProductsListPage />} />
        <Route path="/products/update-prices" element={<UpdatePricesPage />} />

        {/* Provider Routes */}
        <Route path="/providers" element={<ProvidersListPage />} />

        {/* Order Routes */}
        <Route path="/orders" element={<OrdersListPage />} />
      </Route>
      <Route
        path="/orders/create"
        element={
          <ProtectedRoute>
            <CreateOrderPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
