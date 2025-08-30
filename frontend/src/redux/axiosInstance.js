import axios from 'axios';

// Create centralized axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});

axiosInstance.defaults.withCredentials = true;

// Create separate axios instance for refresh requests to avoid circular dependency
const refreshAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});

refreshAxiosInstance.defaults.withCredentials = true;

// State variables for managing refresh process
let isRefreshing = false;
let failedQueue = [];

// Process queue of failed requests
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
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
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
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

        return new Promise(function (resolve, reject) {
          // Get current state to access refresh token
          const state = store.getState();
          const currentToken = state.auth.token;

          // Use separate axios instance for refresh to avoid circular dependency
          // Backend expects sessionId and refreshToken in cookies, not in Authorization header
          refreshAxiosInstance
            .post('/auth/refresh')
            .then(response => {
              const newAccessToken = response.data.data.accessToken;

              // Update default headers for future requests
              axiosInstance.defaults.headers.common['Authorization'] =
                `Bearer ${newAccessToken}`;

              // Update the original failed request headers
              originalRequest.headers['Authorization'] =
                `Bearer ${newAccessToken}`;

              // Update Redux store with new token
              store.dispatch(
                updateToken({
                  accessToken: newAccessToken,
                  user: response.data.data.user,
                })
              );

              // Process all queued requests with new token
              processQueue(null, newAccessToken);

              // Retry the original request
              resolve(axiosInstance(originalRequest));
            })
            .catch(err => {
              // Process all queued requests with error
              processQueue(err, null);

              // Logout user on refresh failure
              store.dispatch(logOut());

              reject(err);
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      }

      return Promise.reject(error);
    }
  );
};

// Helper functions for backward compatibility
export const setAuthHeader = token => {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearAuthHeader = () => {
  axiosInstance.defaults.headers.common.Authorization = '';
};

export default axiosInstance;
