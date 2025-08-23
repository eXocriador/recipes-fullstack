// Debug utilities for authentication system

export const debugAuthState = () => {
  // Access store directly from window for debugging
  const store =
    window.__REDUX_DEVTOOLS_EXTENSION__?.connect()?.store ||
    (window.store && window.store.getState && window.store);

  if (!store) {
    console.log('❌ Store not accessible for debugging');
    return;
  }

  try {
    const state = store.getState();
    const auth = state.auth;

    console.log('🔍 Current Auth State:', {
      token: auth.token ? `${auth.token.substring(0, 20)}...` : 'null',
      isLoggedIn: auth.isLoggedIn,
      user: auth.user,
      isLoading: auth.isLoading,
      error: auth.error,
    });

    // Check token validity
    if (auth.token) {
      try {
        const payload = JSON.parse(atob(auth.token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        const timeUntilExpiry = payload.exp - currentTime;

        console.log('🔑 Token Details:', {
          expiresIn: `${Math.round(timeUntilExpiry)} seconds`,
          issuedAt: new Date(payload.iat * 1000).toISOString(),
          expiresAt: new Date(payload.exp * 1000).toISOString(),
          isValid: timeUntilExpiry > 5,
          userId: payload.userId,
          email: payload.email,
          name: payload.name,
        });
      } catch (error) {
        console.error('❌ Error parsing JWT token:', error);
      }
    }

    return auth;
  } catch (error) {
    console.error('❌ Error accessing store state:', error);
  }
};

export const debugAxiosHeaders = () => {
  const axios = window.axiosInstance;
  if (axios && axios.defaults && axios.defaults.headers) {
    console.log('📤 Axios Default Headers:', axios.defaults.headers);
    console.log(
      '🔑 Authorization Header:',
      axios.defaults.headers.common?.Authorization
    );
  } else {
    console.log('❌ Axios instance not accessible');
  }
};

export const testAuthFlow = async () => {
  console.log('🧪 Testing authentication flow...');

  // Debug current state
  debugAuthState();
  debugAxiosHeaders();

  // Test token validation
  const store =
    window.store || window.__REDUX_DEVTOOLS_EXTENSION__?.connect()?.store;
  if (store) {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      console.log('✅ Token found in store');
      // Test making a request
      try {
        const response = await fetch('/api/users/current', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(
          '📡 Test request response:',
          response.status,
          response.statusText
        );
      } catch (error) {
        console.error('❌ Test request failed:', error);
      }
    } else {
      console.log('⚠️ No token found in store');
    }
  }
};

// Export for console access
window.debugAuth = {
  debugAuthState,
  debugAxiosHeaders,
  testAuthFlow,
};

export default {
  debugAuthState,
  debugAxiosHeaders,
  testAuthFlow,
};
