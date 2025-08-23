// Automatic cleanup utility for corrupted tokens
import { testJWTToken } from './testJWT';

class TokenAutoCleanup {
  constructor(store, clearCorruptedToken) {
    this.store = store;
    this.clearCorruptedToken = clearCorruptedToken;
    this.interval = null;
    this.isRunning = false;
    this.checkInterval = 30000; // Check every 30 seconds
  }

  // Start automatic cleanup
  start() {
    if (this.isRunning) {
      console.log('🔄 Auto cleanup already running');
      return;
    }

    console.log('🚀 Starting automatic token cleanup...');
    this.isRunning = true;

    // Run initial check
    this.checkTokens();

    // Set up periodic checks
    this.interval = setInterval(() => {
      this.checkTokens();
    }, this.checkInterval);

    console.log(`✅ Auto cleanup started, checking every ${this.checkInterval / 1000} seconds`);
  }

  // Stop automatic cleanup
  stop() {
    if (!this.isRunning) {
      console.log('🔄 Auto cleanup not running');
      return;
    }

    console.log('🛑 Stopping automatic token cleanup...');
    this.isRunning = false;

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    console.log('✅ Auto cleanup stopped');
  }

  // Check all tokens in the store
  checkTokens() {
    try {
      const state = this.store.getState();
      const token = state.auth.token;

      if (token) {
        console.log('🔍 Auto cleanup: Checking token validity...');
        
        const isValid = testJWTToken(token);
        
        if (!isValid) {
          console.warn('🧹 Auto cleanup: Detected corrupted token, cleaning up...');
          this.cleanupCorruptedToken();
        } else {
          console.log('✅ Auto cleanup: Token is valid');
        }
      } else {
        console.log('🔍 Auto cleanup: No token found');
      }
    } catch (error) {
      console.error('❌ Auto cleanup: Error checking tokens:', error);
      
      // If there's an error, also clean up
      this.cleanupCorruptedToken();
    }
  }

  // Clean up corrupted token
  cleanupCorruptedToken() {
    try {
      console.log('🧹 Auto cleanup: Cleaning up corrupted token...');
      
      // Clear from Redux store
      this.store.dispatch(this.clearCorruptedToken());
      console.log('✅ Auto cleanup: Cleared corrupted token from Redux store');
      
      // Clear from localStorage
      try {
        localStorage.removeItem('persist:auth');
        console.log('✅ Auto cleanup: Cleared corrupted token from localStorage');
      } catch (error) {
        console.error('❌ Auto cleanup: Error clearing localStorage:', error);
      }
      
      // Force page reload to ensure clean state
      console.log('🔄 Auto cleanup: Reloading page to ensure clean state...');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('❌ Auto cleanup: Error during cleanup:', error);
    }
  }

  // Get status
  getStatus() {
    return {
      isRunning: this.isRunning,
      checkInterval: this.checkInterval,
      lastCheck: this.lastCheck,
    };
  }

  // Update check interval
  setCheckInterval(interval) {
    if (this.isRunning) {
      this.stop();
      this.checkInterval = interval;
      this.start();
    } else {
      this.checkInterval = interval;
    }
    
    console.log(`⏰ Auto cleanup interval updated to ${interval / 1000} seconds`);
  }
}

// Create and export instance
let autoCleanupInstance = null;

export const createAutoCleanup = (store, clearCorruptedToken) => {
  if (!autoCleanupInstance) {
    autoCleanupInstance = new TokenAutoCleanup(store, clearCorruptedToken);
  }
  return autoCleanupInstance;
};

export const getAutoCleanup = () => autoCleanupInstance;

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  window.createAutoCleanup = createAutoCleanup;
  window.getAutoCleanup = getAutoCleanup;
  
  console.log('🧹 Auto cleanup utilities available globally:');
  console.log('  - window.createAutoCleanup(store, clearCorruptedToken)');
  console.log('  - window.getAutoCleanup()');
}
