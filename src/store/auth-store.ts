import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth, setAuthToken } from '../apis';
import { UserInfoResponse } from '@/apis/types/auth';

interface AuthState {
  user: UserInfoResponse | null;
  isAuthenticated: boolean;
  accessToken?: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: Partial<UserInfoResponse>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,

      login: async (email: string, password: string) => {
        // This would normally make an API call
        // For now, we'll mock the authentication

        // Mock credentials for demo: admin@pharmacy.com / password
        // if (email === 'admin@pharmacy.com' && password === 'password') {
        //   set({
        //     isAuthenticated: true,
        //     user: {
        //       id: '1',
        //       name: 'Admin User',
        //       email: 'admin@pharmacy.com',
        //       role: 'admin',
        //     },
        //     accessToken: 'mock-jwt-token',
        //   });
        //   return true;
        // }

        try {
          const response = await auth.login({ email, password });
          if (response) {
            set({
              isAuthenticated: true,
              user: response.userInfo,
              accessToken: response.accessToken,
            });
            setAuthToken(response.accessToken || null);
          }
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          accessToken: null,
        });
      },

      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
    }),
    {
      name: 'pharma-auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          setAuthToken(state.accessToken);
        }
      },
    }
  )
);
