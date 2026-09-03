import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import apiClient from './axios';

export function setupInterceptors(onUnauthorized?: () => void) {
  // Request Interceptor: Attach JWT Bearer token (except on auth endpoints)
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('offgo_auth_token');
      const isAuthRoute = config.url?.includes('/auth/');
      if (token && config.headers && !isAuthRoute) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // Response Interceptor: Catch 401 Unauthorized globally
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('offgo_auth_token');
        localStorage.removeItem('offgo_auth_user');
        if (onUnauthorized) {
          onUnauthorized();
        }
      }
      return Promise.reject(error);
    }
  );
}
