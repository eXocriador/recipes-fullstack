import { configureInterceptors } from './axiosInstance';
import { store } from './store';
import { refreshUser, logOut } from './auth/operations';
import { updateToken } from './auth/slice';
import AuthMonitor from './utils/authMonitor';

let authMonitor = null;

// Configure axios interceptors after store is available
export const setupAxios = () => {
  // Ensure store is ready
  if (!store || !store.getState) {
    console.error('❌ Store not ready, retrying in 50ms...');
    setTimeout(setupAxios, 50);
    return;
  }

  console.log('🚀 Setting up axios interceptors...');
  configureInterceptors(store, refreshUser, logOut, updateToken);

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
