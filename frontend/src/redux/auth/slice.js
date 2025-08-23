import { createSlice } from '@reduxjs/toolkit';
import {
  login,
  logOut,
  refreshUser,
  register,
  getUserInfo,
} from './operations';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      name: null,
      email: null,
    },
    token: null,
    isLoggedIn: false,
    isLoading: false,
    error: null,
  },
  reducers: {
    updateToken: (state, action) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      state.isLoggedIn = true;
      state.error = null;
      state.isLoading = false;

      console.log(
        '🔄 updateToken reducer called with token:',
        action.payload.accessToken.substring(0, 10) + '...'
      );

      // Update axios headers with new token
      import('../axiosInstance').then(({ setAuthHeader }) => {
        setAuthHeader(action.payload.accessToken);
      });
    },
    clearError: state => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearCorruptedToken: state => {
      state.token = null;
      state.user = { name: null, email: null };
      state.isLoggedIn = false;
      state.error = 'Token corrupted, please login again';
      state.isLoading = false;

      console.log('🧹 clearCorruptedToken reducer called');

      // Clear axios headers
      import('../axiosInstance').then(({ clearAuthHeader }) => {
        clearAuthHeader();
      });
    },
  },
  extraReducers: builder =>
    builder
      .addCase(register.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(login.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.data.accessToken;
        state.isLoggedIn = true;
        state.isLoading = false;
        state.error = null;

        console.log(
          '🔄 login.fulfilled called with token:',
          action.payload.data.accessToken.substring(0, 10) + '...'
        );

        // Update axios headers with new token
        import('../axiosInstance').then(({ setAuthHeader }) => {
          setAuthHeader(action.payload.data.accessToken);
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })
      .addCase(logOut.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logOut.fulfilled, state => {
        state.user = { name: null, email: null };
        state.token = null;
        state.isLoggedIn = false;
        state.isLoading = false;
        state.error = null;

        console.log('🚪 logOut.fulfilled called');

        // Clear axios headers
        import('../axiosInstance').then(({ clearAuthHeader }) => {
          clearAuthHeader();
        });
      })
      .addCase(logOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
      })

      .addCase(refreshUser.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload.data.user;
        state.token = action.payload.data.accessToken;
        state.isLoggedIn = true;
        state.isLoading = false;
        state.error = null;

        console.log(
          '🔄 refreshUser.fulfilled called with token:',
          action.payload.data.accessToken.substring(0, 10) + '...'
        );

        // Update axios headers with new token
        import('../axiosInstance').then(({ setAuthHeader }) => {
          setAuthHeader(action.payload.data.accessToken);
        });
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
        // Don't clear token on refresh failure - let axios interceptor handle logout
      })
      .addCase(getUserInfo.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload.message;
        state.isLoggedIn = false;
        state.user = { name: null, email: null };
        state.token = null;

        console.log('❌ getUserInfo.rejected called');

        // Clear axios headers
        import('../axiosInstance').then(({ clearAuthHeader }) => {
          clearAuthHeader();
        });
      }),
});

export const { updateToken, clearError, setLoading, clearCorruptedToken } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
