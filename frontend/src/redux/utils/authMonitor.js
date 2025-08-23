import { AUTH_CONSTANTS } from '../constants/auth';

// Authentication monitor for proactive token management

class AuthMonitor {
  constructor(store, refreshUser) {
    this.store = store;
    this.refreshUser = refreshUser;
    this.monitoringInterval = null;
    this.lastActivity = Date.now();
    this.activityTimeout = AUTH_CONSTANTS.ACTIVITY_TIMEOUT;
  }

  start() {
    // Monitor token validity every 30 seconds
    this.monitoringInterval = setInterval(() => {
      this.checkTokenValidity();
    }, AUTH_CONSTANTS.TOKEN_CHECK_INTERVAL);

    // Track user activity
    this.setupActivityTracking();

    console.log('🔍 Auth monitor started');
  }

  stop() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    this.removeActivityTracking();
    console.log('🔍 Auth monitor stopped');
  }

  checkTokenValidity() {
    const state = this.store.getState();
    const token = state.auth.token;
    const isLoggedIn = state.auth.isLoggedIn;

    if (!token || !isLoggedIn) {
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = payload.exp - currentTime;

      // If token expires in less than threshold, refresh it
      if (timeUntilExpiry < AUTH_CONSTANTS.REFRESH_THRESHOLD) {
        console.log('⏰ Token expires soon, refreshing...');
        this.store.dispatch(this.refreshUser());
      }
    } catch (error) {
      console.error('❌ Error parsing token:', error);
    }
  }

  setupActivityTracking() {
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    const updateActivity = () => {
      this.lastActivity = Date.now();
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Check for inactivity every minute
    setInterval(() => {
      const timeSinceLastActivity = Date.now() - this.lastActivity;
      if (timeSinceLastActivity > this.activityTimeout) {
        console.log('😴 User inactive, checking session...');
        this.checkSessionValidity();
      }
    }, AUTH_CONSTANTS.ACTIVITY_CHECK_INTERVAL);
  }

  removeActivityTracking() {
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];
    events.forEach(event => {
      document.removeEventListener(event, this.updateActivity, true);
    });
  }

  checkSessionValidity() {
    const state = this.store.getState();
    if (state.auth.isLoggedIn) {
      // Verify session is still valid by making a lightweight request
      this.store.dispatch(this.refreshUser());
    }
  }

  // Force refresh token (useful for manual refresh)
  forceRefresh() {
    console.log('🔄 Forcing token refresh...');
    this.store.dispatch(this.refreshUser());
  }
}

export default AuthMonitor;
