import apiClient from './client';
import type { ApiResponse, AuthTokens, User } from '@/types';

export const authApi = {
  login: async (data: { email: string; password: string }) => {
    return apiClient.post<ApiResponse<{ user: User; access_token: string; refresh_token: string; expires_in: number }>>(
      '/auth/login',
      data
    );
  },

  register: async (data: {
    full_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'student' | 'trainer' | 'company';
  }) => {
    return apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/register',
      data
    );
  },

  verifyEmail: async (data: { token: string }) => {
    return apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/verify-email',
      data
    );
  },

  forgotPassword: async (data: { email: string }) => {
    return apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/forgot-password',
      data
    );
  },

  resetPassword: async (data: { token: string; password: string; password_confirmation: string }) => {
    return apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/reset-password',
      data
    );
  },

  logout: async () => {
    return apiClient.post<ApiResponse<{ message: string }>>(
      '/auth/logout'
    );
  },

  refresh: async (refreshToken: string) => {
    return apiClient.post<ApiResponse<AuthTokens>>(
      '/auth/refresh',
      { refresh_token: refreshToken }
    );
  },

  googleAuth: async (code: string) => {
    return apiClient.post<ApiResponse<{ user: User; access_token: string; refresh_token: string }>>(
      '/auth/google',
      { code }
    );
  },
};
