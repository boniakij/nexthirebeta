import apiClient from './client';
import { ApiResponse, User } from '@/types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  password_confirmation: string;
  role: 'student' | 'trainer' | 'company';
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/register', payload),

  login: (payload: LoginPayload) =>
    apiClient.post<ApiResponse<{ user: User; tokens: AuthTokens }>>('/auth/login', payload),

  logout: () =>
    apiClient.post('/auth/logout'),

  refresh: (refresh_token: string) =>
    apiClient.post<ApiResponse<AuthTokens>>('/auth/refresh', { refresh_token }),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string, password_confirmation: string) =>
    apiClient.post('/auth/reset-password', { token, password, password_confirmation }),

  verifyEmail: (token: string) =>
    apiClient.post('/auth/verify-email', { token }),
};
