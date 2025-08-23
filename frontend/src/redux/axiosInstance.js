import axios from 'axios';
import { retryWithBackoff, isNetworkError } from './utils/networkUtils';
import { AUTH_CONSTANTS } from './constants/auth';

// Create centralized axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: AUTH_CONSTANTS.REQUEST_TIMEOUT,
});

axiosInstance.defaults.withCredentials = true;

// Create separate axios instance for refresh requests to avoid circular dependency
const refreshAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: AUTH_CONSTANTS.REFRESH_TIMEOUT,
});

refreshAxiosInstance.defaults.withCredentials = true;

// State variables for managing refresh process
let isRefreshing = false;
let failedQueue = [];
let refreshPromise = null;

// Process queue of failed requests with timeout protection
const processQueue = (error, token = null) => {
  const timeout = setTimeout(() => {
    console.warn('⚠️ Queue timeout - clearing failed requests');
    failedQueue.forEach(prom =>
      prom.reject(new Error('Queue timeout - request took too long'))
    );
    failedQueue = [];
  }, AUTH_CONSTANTS.QUEUE_TIMEOUT);

  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
  clearTimeout(timeout);
};

// Token validation utility
const isTokenValid = token => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    // Consider token valid if it expires in more than 30 seconds
    return payload.exp > currentTime + 30;
  } catch {
    return false;
  }
};

// Request interceptor - automatically adds Authorization header
axiosInstance.interceptors.request.use(
  config => {
    // Token will be set by the component or operation that uses this instance
    // The interceptor will be configured after store is available
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor - handles 401 errors and manages token refresh
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Check if error is 401 and request hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      // Mark request as retried to prevent infinite loops
      originalRequest._retry = true;
      isRefreshing = true;

      // Return a promise that will be resolved by the refresh process
      return new Promise(function (resolve, reject) {
        // Store the resolve/reject functions to be called later
        failedQueue.push({ resolve, reject });
      });
    }

    return Promise.reject(error);
  }
);

// Function to configure interceptors after store is available
export const configureInterceptors = (
  store,
  refreshUser,
  logOut,
  updateToken
) => {
  // Configure request interceptor
  axiosInstance.interceptors.request.clear();
  axiosInstance.interceptors.request.use(
    config => {
      const state = store.getState();
      const token = state.auth.token;

      if (token && isTokenValid(token)) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log(
          '📤 Request with valid token:',
          token.substring(0, 10) + '...'
        );
      } else if (token && !isTokenValid(token)) {
        console.warn('⚠️ Token expired, will trigger refresh');
        // Don't set header for expired token - let response interceptor handle it
      } else {
        console.log('⚠️ Request without token');
      }
      return config;
    },
    error => Promise.reject(error)
  );

  // Configure response interceptor
  axiosInstance.interceptors.response.clear();
  axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;

      // Check if error is 401 and request hasn't been retried yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        console.log('🚨 401 error detected for:', originalRequest.url);

        // If refresh is already in progress, queue this request
        if (isRefreshing) {
          console.log(
            '⏳ Refresh in progress, queuing request for:',
            originalRequest.url
          );
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
              return axiosInstance(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        // Mark request as retried to prevent infinite loops
        originalRequest._retry = true;
        isRefreshing = true;

        // Create a single refresh promise to avoid multiple refresh calls
        if (!refreshPromise) {
          refreshPromise = new Promise((resolve, reject) => {
            // Get current state to access refresh token
            const state = store.getState();
            const currentToken = state.auth.token;
            console.log(
              '🔑 Current token for refresh:',
              currentToken ? currentToken.substring(0, 10) + '...' : 'null'
            );

            // Use retry logic for refresh
            retryWithBackoff(
              () => refreshAxiosInstance.post('/auth/refresh'),
              AUTH_CONSTANTS.REFRESH_MAX_RETRIES,
              AUTH_CONSTANTS.REFRESH_RETRY_DELAY
            )
              .then(response => {
                console.log('📡 Refresh response:', response.data);
                const newAccessToken = response.data.data.accessToken;
                console.log(
                  '✅ Token refresh successful, new token:',
                  newAccessToken.substring(0, 10) + '...'
                );

                // Update default headers for future requests
                axiosInstance.defaults.headers.common['Authorization'] =
                  `Bearer ${newAccessToken}`;

                // Update Redux store with new token
                console.log('🔄 Updating Redux store with new token...');
                store.dispatch(
                  updateToken({
                    accessToken: newAccessToken,
                    user: response.data.data.user,
                  })
                );
                console.log('✅ Redux store updated with new token');

                // Process all queued requests with new token
                processQueue(null, newAccessToken);

                resolve(newAccessToken);
              })
              .catch(err => {
                console.log('❌ Token refresh failed:', err.message);
                console.log('❌ Error details:', err.response?.data || err);

                // Process all queued requests with error
                processQueue(err, null);

                // Logout user on refresh failure
                store.dispatch(logOut());

                reject(err);
              })
              .finally(() => {
                isRefreshing = false;
                refreshPromise = null;
              });
          });
        }

        // Wait for refresh to complete and retry original request
        try {
          const newToken = await refreshPromise;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          return Promise.reject(refreshError);
        }
      }

      // Handle network errors specifically
      if (isNetworkError(error)) {
        console.error('🌐 Network error detected:', error.message);
        // For network errors, we might want to retry automatically
        if (!originalRequest._retry && originalRequest.method !== 'get') {
          originalRequest._retry = true;
          return retryWithBackoff(
            () => axiosInstance(originalRequest),
            2,
            2000
          );
        }
      }

      return Promise.reject(error);
    }
  );
};

// Helper functions for backward compatibility
export const setAuthHeader = token => {
  if (token && isTokenValid(token)) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
};

export const clearAuthHeader = () => {
  axiosInstance.defaults.headers.common.Authorization = '';
};

export default axiosInstance;
