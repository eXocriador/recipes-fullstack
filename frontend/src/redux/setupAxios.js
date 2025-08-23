import { configureInterceptors } from './axiosInstance';
import { store } from './store';
import { refreshUser, logOut } from './auth/operations';
import { updateToken, clearCorruptedToken } from './auth/slice';
import AuthMonitor from './utils/authMonitor';

let authMonitor = null;

// Function to clean up corrupted tokens on startup
const cleanupCorruptedTokensOnStartup = () => {
  try {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      // Simple check - if token doesn't look like JWT, clear it
      if (typeof token !== 'string' || token.split('.').length !== 3) {
        console.warn('🧹 Detected corrupted token on startup, cleaning up...');
        store.dispatch(clearCorruptedToken());

        // Clear from localStorage
        try {
          localStorage.removeItem('persist:auth');
          console.log(
            '✅ Cleared corrupted token from localStorage on startup'
          );
        } catch (error) {
          console.error('❌ Error clearing localStorage on startup:', error);
        }

        // Force page reload to ensure clean state
        console.log('🔄 Reloading page to ensure clean state...');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.log('✅ Token looks valid on startup');
      }
    } else {
      console.log('🔍 No token found on startup');
    }
  } catch (error) {
    console.error('❌ Error during startup token cleanup:', error);

    // If there's an error during cleanup, also clear everything and reload
    try {
      store.dispatch(clearCorruptedToken());
      localStorage.removeItem('persist:auth');
      console.log('🔄 Error during cleanup, reloading page...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (cleanupError) {
      console.error('❌ Error during emergency cleanup:', cleanupError);
    }
  }
};

// Configure axios interceptors after store is available
export const setupAxios = () => {
  // Ensure store is ready
  if (!store || !store.getState) {
    console.error('❌ Store not ready, retrying in 50ms...');
    setTimeout(setupAxios, 50);
    return;
  }

  console.log('🚀 Setting up axios interceptors...');

  // Clean up corrupted tokens first
  cleanupCorruptedTokensOnStartup();

  configureInterceptors(
    store,
    refreshUser,
    logOut,
    updateToken,
    clearCorruptedToken
  );

  // Start authentication monitor
  authMonitor = new AuthMonitor(store, refreshUser);
  authMonitor.start();

  // Make axios instance available globally for debugging
  import('./axiosInstance').then(({ default: axiosInstance }) => {
    window.axiosInstance = axiosInstance;
  });

  console.log('🚀 Axios interceptors and auth monitor configured');
};

// Export auth monitor for external control
export const getAuthMonitor = () => authMonitor;
