import { useAppDispatch } from "src/app/hooks";
import { logout } from "src/app/api/auth/authSlice";

export default function useLogout() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  }

  return handleLogout;
}