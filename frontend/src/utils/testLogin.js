// Test script for login functionality

export const testLoginFlow = async (email, password) => {
  console.log('🧪 Testing login flow...');

  try {
    // Test 1: Check if store is accessible
    if (!window.store) {
      console.error('❌ Store not accessible');
      return false;
    }

    console.log('✅ Store accessible');

    // Test 2: Check initial state
    const initialState = window.store.getState();
    console.log('🔍 Initial auth state:', {
      token: !!initialState.auth.token,
      isLoggedIn: initialState.auth.isLoggedIn,
      user: initialState.auth.user,
    });

    // Test 3: Check if axios is configured
    if (!window.axiosInstance) {
      console.warn('⚠️ Axios not yet configured, waiting...');
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    if (window.axiosInstance) {
      console.log('✅ Axios configured');
      console.log('📤 Axios headers:', window.axiosInstance.defaults.headers);
    }

    // Test 4: Simulate login (if credentials provided)
    if (email && password) {
      console.log('🔐 Simulating login with provided credentials...');

      // This would normally be done through Redux
      // For testing, we'll just log the attempt
      console.log('📝 Login attempt logged (actual login handled by Redux)');
    }

    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
};

export const monitorAuthChanges = () => {
  console.log('👀 Monitoring auth state changes...');

  let previousState = null;

  const checkState = () => {
    if (!window.store) return;

    const currentState = window.store.getState().auth;

    if (previousState === null) {
      previousState = currentState;
      console.log('📊 Initial auth state captured');
      return;
    }

    // Check for changes
    if (previousState.token !== currentState.token) {
      console.log('🔄 Token changed:', {
        from: previousState.token ? 'present' : 'null',
        to: currentState.token ? 'present' : 'null',
      });
    }

    if (previousState.isLoggedIn !== currentState.isLoggedIn) {
      console.log('🔄 Login status changed:', {
        from: previousState.isLoggedIn,
        to: currentState.isLoggedIn,
      });
    }

    if (previousState.user !== currentState.user) {
      console.log('🔄 User data changed:', {
        from: previousState.user,
        to: currentState.user,
      });
    }

    previousState = currentState;
  };

  // Check every 500ms
  const interval = setInterval(checkState, 500);

  // Return cleanup function
  return () => {
    clearInterval(interval);
    console.log('👀 Auth monitoring stopped');
  };
};

export const testTokenValidation = () => {
  console.log('🔍 Testing token validation...');

  if (!window.store) {
    console.error('❌ Store not accessible');
    return;
  }

  const state = window.store.getState();
  const token = state.auth.token;

  if (!token) {
    console.log('⚠️ No token to validate');
    return;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = payload.exp - currentTime;

    console.log('🔑 Token validation results:', {
      token: `${token.substring(0, 20)}...`,
      expiresIn: `${Math.round(timeUntilExpiry)} seconds`,
      isValid: timeUntilExpiry > 5,
      payload: {
        exp: payload.exp,
        iat: payload.iat,
        userId: payload.userId || 'unknown',
      },
    });
  } catch (error) {
    console.error('❌ Token validation failed:', error);
  }
};

// Export for console access
window.testLogin = {
  testLoginFlow,
  monitorAuthChanges,
  testTokenValidation,
};

export default {
  testLoginFlow,
  monitorAuthChanges,
  testTokenValidation,
};
