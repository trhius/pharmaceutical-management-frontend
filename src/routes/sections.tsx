import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import { ROUTES } from './config';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ResetPasswordPage = lazy(() => import('src/pages/reset-password'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

export const EmployeePage = lazy(() => import('src/pages/employee'));
export const EmployeeSettingPage = lazy(() => import('src/pages/employee-setting'));
export const EmployeeWorkshiftPage = lazy(() => import('src/pages/employee-workshift'));
export const CustomerPage = lazy(() => import('src/pages/customer'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: ROUTES.USER, element: <UserPage /> },
      { path: ROUTES.EMPLOYEE, element: <EmployeePage /> },
      { path: ROUTES.EMPLOYEE_SETTING, element: <EmployeeSettingPage /> },
      { path: ROUTES.EMPLOYEE_WORKSHIFT, element: <EmployeeWorkshiftPage /> },
      { path: ROUTES.CUSTOMER, element: <CustomerPage /> },
      { path: ROUTES.MEDICINE_LIST, element: <ProductsPage /> },
    ],
  },
  {
    path: ROUTES.LOGIN,
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  {
    path: ROUTES.RESET_PASSWORD,
    element: (
      <AuthLayout>
        <ResetPasswordPage />
      </AuthLayout>
    ),
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];
