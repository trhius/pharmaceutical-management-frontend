import { Outlet, Navigate, useLocation } from 'react-router-dom';

import { ROUTES } from 'src/routes/config';

import { useAppSelector } from 'src/app/hooks';
import { selectCurrentUserRole, selectCurrentAccessToken } from 'src/app/api/auth/authSlice';

const RequireAuth = ({ allowedRole }: any) => {
  const token = useAppSelector(selectCurrentAccessToken);
  const role = useAppSelector(selectCurrentUserRole);
  const location = useLocation();

  if (role && (!allowedRole || role === allowedRole)) {
    return <Outlet />;
  }

  if (token) {
    return <Navigate to={ROUTES.NOT_FOUND} state={{ from: location }} replace />;
  }
  return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
};

export default RequireAuth;
