import { configureInterceptors } from './axiosInstance';
import { store } from './store';
import { refreshUser, logOut } from './auth/operations';
import { updateToken } from './auth/slice';

// Configure axios interceptors after store is available
export const setupAxios = () => {
  configureInterceptors(store, refreshUser, logOut, updateToken);
};
