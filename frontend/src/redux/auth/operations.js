import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance, {
  setAuthHeader,
  clearAuthHeader,
} from '../axiosInstance';
import { retryWithBackoff, isNetworkError } from '../utils/networkUtils';
import { AUTH_CONSTANTS } from '../constants/auth';

export const register = createAsyncThunk(
  'auth/register',
  async (formData, thunkAPI) => {
    try {
      const { data } = await retryWithBackoff(() =>
        axiosInstance.post('/auth/register', formData)
      );
      return data;
    } catch (error) {
      if (isNetworkError(error)) {
        return thunkAPI.rejectWithValue(
          'Network error - please check your connection'
        );
      }
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (formData, thunkAPI) => {
    try {
      const { data } = await retryWithBackoff(() =>
        axiosInstance.post('/auth/login', formData)
      );
      return data;
    } catch (error) {
      if (isNetworkError(error)) {
        return thunkAPI.rejectWithValue(
          'Network error - please check your connection'
        );
      }
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const logOut = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    const { data } = await retryWithBackoff(() =>
      axiosInstance.post('/auth/logout')
    );
    clearAuthHeader();
    return data;
  } catch (error) {
    // Always clear auth header on logout attempt, even if it fails
    clearAuthHeader();
    if (isNetworkError(error)) {
      return thunkAPI.rejectWithValue('Network error during logout');
    }
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message
    );
  }
});

export const refreshUser = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;

    if (persistedToken === null) {
      return thunkAPI.rejectWithValue(
        'Unable to fetch user - no token available'
      );
    }

    try {
      setAuthHeader(persistedToken);
      const { data } = await retryWithBackoff(
        () => axiosInstance.post('/auth/refresh'),
        AUTH_CONSTANTS.REFRESH_MAX_RETRIES,
        AUTH_CONSTANTS.REFRESH_RETRY_DELAY
      );
      return data;
    } catch (error) {
      if (isNetworkError(error)) {
        return thunkAPI.rejectWithValue('Network error during token refresh');
      }
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

export const getUserInfo = createAsyncThunk(
  'auth/getUserInfo',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;

    if (persistedToken === null) {
      return thunkAPI.rejectWithValue(
        'Unable to fetch user - no token available'
      );
    }

    try {
      setAuthHeader(persistedToken);
      const { data } = await retryWithBackoff(() =>
        axiosInstance.get('/users/current')
      );
      return data;
    } catch (error) {
      if (isNetworkError(error)) {
        return thunkAPI.rejectWithValue(
          'Network error - please check your connection'
        );
      }
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Export helper functions for backward compatibility
export { setAuthHeader, clearAuthHeader };
