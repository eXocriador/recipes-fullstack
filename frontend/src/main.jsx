import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { setupAxios } from './redux/setupAxios';
import App from './components/App';
import './index.css';
import 'modern-normalize/modern-normalize.css';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

// Import debug utilities for development
import './utils/debugAuth';
import './utils/testLogin';
import './utils/testJWT';
import './utils/testAll';
import './utils/testAutoCleanup';

// Make store available globally for debugging
window.store = store;
window.axiosInstance = null; // Will be set by setupAxios

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

// Setup axios interceptors AFTER store is mounted and available
setTimeout(() => setupAxios(), 100);
