import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useLogin from 'src/hooks/use-login';

import { showErrorMessage } from 'src/utils/notify';

import { useRefreshMutation } from 'src/app/api/auth/authApiSlice';
import {
  logout,
  selectCurrentAccessToken,
  selectCurrentRefreshToken,
} from 'src/app/api/auth/authSlice';

import Loading from './Loading';

const PersistedLogin = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [refresh] = useRefreshMutation();
  const handleLogin = useLogin();
  const accessToken = useSelector(selectCurrentAccessToken);
  const refreshToken = useSelector(selectCurrentRefreshToken);

  useEffect(() => {
    const doRefreshToken = async () => {
      try {
        const data = await refresh({ refreshToken }).unwrap();
        handleLogin(data);
      } catch (err) {
        showErrorMessage(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (refreshToken) {
      let isRefresh = !accessToken;
      if (!isRefresh) {
        const { exp } = jwtDecode(accessToken);
        if (exp < Date.now() / 1000) {
          isRefresh = true;
        }
      }

      if (isRefresh) {
        doRefreshToken();
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      dispatch(logout());
    }
  }, [handleLogin, refresh, dispatch, accessToken, refreshToken]);

  return isLoading ? <Loading fullScreen /> : children;
};

PersistedLogin.propTypes = {
  children: PropTypes.node,
};

export default PersistedLogin;
