import axios, { AxiosInstance, AxiosError } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT on every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auto-refresh on 401
apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refresh_token');
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/auth/refresh`,
            { refresh_token: refreshToken }
          );
          localStorage.setItem('access_token', data.data.access_token);
          original.headers.Authorization = `Bearer ${data.data.access_token}`;
          return apiClient(original);
        }
      } catch {
        if (typeof window !== 'undefined') {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
