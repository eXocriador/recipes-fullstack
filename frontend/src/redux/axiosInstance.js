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

  // Check if token is a string
  if (typeof token !== 'string') {
    console.error('❌ Token is not a string:', typeof token, token);
    return false;
  }

  // Check if token has the correct JWT format (3 parts separated by dots)
  const tokenParts = token.split('.');
  if (tokenParts.length !== 3) {
    console.error(
      '❌ Token does not have correct JWT format (3 parts):',
      tokenParts.length
    );
    return false;
  }

  // Check if all parts are non-empty
  if (tokenParts.some(part => !part)) {
    console.error('❌ Token has empty parts');
    return false;
  }

  try {
    // Validate that the payload part is valid base64
    const payload = tokenParts[1];

    // Check if payload contains only valid base64 characters
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(payload)) {
      console.error('❌ Token payload contains invalid base64 characters');
      return false;
    }

    // Try to decode the payload
    const decodedPayload = atob(payload);

    // Try to parse as JSON
    const parsedPayload = JSON.parse(decodedPayload);

    // Check if payload has required fields
    if (!parsedPayload.exp || typeof parsedPayload.exp !== 'number') {
      console.error('❌ Token payload missing or invalid exp field');
      return false;
    }

    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = parsedPayload.exp - currentTime;

    // Token is valid if it expires in more than 5 seconds
    const isValid = timeUntilExpiry > 5;

    if (!isValid) {
      console.log(`⚠️ Token expires in ${Math.round(timeUntilExpiry)} seconds`);
    }

    return isValid;
  } catch (error) {
    console.error('❌ Error parsing JWT token:', error);
    console.error('❌ Token value:', token);
    console.error('❌ Token parts:', tokenParts);

    // Log additional debugging info
    if (token && token.length > 100) {
      console.error(
        '❌ Token preview (first 50 chars):',
        token.substring(0, 50)
      );
      console.error(
        '❌ Token preview (last 50 chars):',
        token.substring(token.length - 50)
      );
    }

    return false;
  }
};

// Function to clean up corrupted tokens
const cleanupCorruptedToken = (store, logOut, clearCorruptedToken) => {
  console.warn('🧹 Cleaning up corrupted token...');

  // Clear from localStorage
  try {
    localStorage.removeItem('persist:auth');
    console.log('✅ Cleared corrupted token from localStorage');
  } catch (error) {
    console.error('❌ Error clearing localStorage:', error);
  }

  // Clear from Redux store
  try {
    store.dispatch(clearCorruptedToken());
    console.log('✅ Cleared corrupted token from Redux store');
  } catch (error) {
    console.error('❌ Error clearing Redux store:', error);
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
  updateToken,
  clearCorruptedToken
) => {
  // Validate parameters
  if (!store || !store.getState) {
    console.error('❌ Invalid store provided to configureInterceptors');
    return;
  }

  if (typeof refreshUser !== 'function') {
    console.error('❌ Invalid refreshUser function provided');
    return;
  }

  if (typeof logOut !== 'function') {
    console.error('❌ Invalid logOut function provided');
    return;
  }

  if (typeof updateToken !== 'function') {
    console.error('❌ Invalid updateToken function provided');
    return;
  }

  if (typeof clearCorruptedToken !== 'function') {
    console.error('❌ Invalid clearCorruptedToken function provided');
    return;
  }

  console.log('🔧 Configuring axios interceptors...');
  console.log('🔧 Store state during configuration:', {
    hasStore: !!store,
    hasGetState: !!store?.getState,
    authState: store?.getState?.()?.auth,
  });

  // Configure request interceptor
  axiosInstance.interceptors.request.clear();
  axiosInstance.interceptors.request.use(
    config => {
      const state = store.getState();
      const token = state.auth.token;

      console.log(`🔍 Request interceptor for: ${config.url}`);
      console.log(`🔑 Token available: ${!!token}`);
      console.log(`🔐 Is logged in: ${state.auth.isLoggedIn}`);
      console.log(
        `📤 Existing Authorization header: ${!!config.headers.Authorization}`
      );

      // Check if Authorization header is already set
      if (config.headers.Authorization) {
        console.log(
          '✅ Authorization header already set, skipping interceptor'
        );
        return config;
      }

      if (token && isTokenValid(token)) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log(
          '📤 Request with valid token:',
          token.substring(0, 10) + '...'
        );
      } else if (token && !isTokenValid(token)) {
        console.warn('⚠️ Token is invalid or corrupted, cleaning up...');
        // Clean up corrupted token
        cleanupCorruptedToken(store, logOut, clearCorruptedToken);

        // Force page reload to ensure clean state
        console.log('🔄 Reloading page to ensure clean state...');
        setTimeout(() => {
          window.location.reload();
        }, 1000);

        // Don't set header for invalid token
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

            // Check if current token is valid before attempting refresh
            if (!currentToken || !isTokenValid(currentToken)) {
              console.error('❌ Current token is invalid, cannot refresh');
              cleanupCorruptedToken(store, logOut, clearCorruptedToken);

              // Force page reload to ensure clean state
              console.log('🔄 Reloading page to ensure clean state...');
              setTimeout(() => {
                window.location.reload();
              }, 1000);

              processQueue(new Error('Invalid token'), null);
              reject(new Error('Invalid token'));
              return;
            }

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

      // Check if error is related to invalid token
      if (error.message && error.message.includes('InvalidCharacterError')) {
        console.error('🚨 Invalid token error detected, cleaning up...');
        // This will be handled by the request interceptor on next request
        // But we can also clean up here if needed
      }

      return Promise.reject(error);
    }
  );
};

// Helper functions for backward compatibility
export const setAuthHeader = token => {
  if (token && isTokenValid(token)) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    console.log(
      '🔑 Auth header set for axios instance:',
      token.substring(0, 10) + '...'
    );
    console.log(
      '🔑 Default headers after setAuthHeader:',
      axiosInstance.defaults.headers.common
    );
  } else if (token) {
    console.warn('⚠️ Attempting to set invalid token as auth header');
    // Don't set invalid token
  }
};

export const clearAuthHeader = () => {
  axiosInstance.defaults.headers.common.Authorization = '';
};

export default axiosInstance;
