import { configureInterceptors } from './axiosInstance';
import { store } from './store';
import { refreshUser, logOut } from './auth/operations';
import { updateToken } from './auth/slice';
import AuthMonitor from './utils/authMonitor';

let authMonitor = null;

// Configure axios interceptors after store is available
export const setupAxios = () => {
  configureInterceptors(store, refreshUser, logOut, updateToken);

  // Start authentication monitor
  authMonitor = new AuthMonitor(store, refreshUser);
  authMonitor.start();

  console.log('🚀 Axios interceptors and auth monitor configured');
};

// Export auth monitor for external control
export const getAuthMonitor = () => authMonitor;
