import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

import { ROUTES } from './config';
import { Fallback } from './fallback';

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
export const ProfilePage = lazy(() => import('src/pages/profile'));

export const routesSection: RouteObject[] = [
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={<Fallback />}>
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
      { path: ROUTES.PROFILE, element: <ProfilePage /> },
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
