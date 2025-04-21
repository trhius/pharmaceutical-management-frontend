import { jwtDecode } from 'jwt-decode';

import { useAppDispatch } from 'src/app/hooks';
import { setUser, setCredentials } from 'src/app/api/auth/authSlice';

export default function useLogin() {
  const dispatch = useAppDispatch();

  const handleLogin = (response: any) => {
    const { accessToken, refreshToken } = response;
    const { id, email, role, fullName } = jwtDecode(accessToken) as any;
    dispatch(setCredentials({ accessToken, refreshToken }));
    dispatch(setUser({ id, fullName, email, role }));
  };

  return handleLogin;
}
