import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Outlet, Navigate, useLocation } from 'react-router-dom';

import { selectCurrentUserRole, selectCurrentAccessToken } from 'src/app/api/auth/authSlice';

const RequireAuth = ({ allowedRole }) => {
  const token = useSelector(selectCurrentAccessToken);
  const role = useSelector(selectCurrentUserRole);
  const location = useLocation();

  if (role && (!allowedRole || role === allowedRole)) {
    return <Outlet />;
  }

  if (token) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  return <Navigate to="/login" state={{ from: location }} replace />;
};

RequireAuth.propTypes = {
  allowedRole: PropTypes.string,
};

export default RequireAuth;
