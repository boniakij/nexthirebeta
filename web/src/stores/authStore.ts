import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { authApi } from '@/lib/api/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const { data } = await authApi.login({ email, password });
          set({
            user: data.data.user,
            accessToken: data.data.tokens.access_token,
            refreshToken: data.data.tokens.refresh_token,
            isAuthenticated: true,
          });
          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', data.data.tokens.access_token);
            localStorage.setItem('refresh_token', data.data.tokens.refresh_token);
          }
        } catch (error) {
          set({ isAuthenticated: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch {}
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      },

      setTokens: (access, refresh) => {
        set({ accessToken: access, refreshToken: refresh });
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);
        }
      },

      setUser: (user) => {
        set({ user });
      },
    }),
    { name: 'nexthire-auth' }
  )
);
