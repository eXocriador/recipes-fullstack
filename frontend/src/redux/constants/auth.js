// Authentication constants

export const AUTH_CONSTANTS = {
  // Token validation
  TOKEN_EXPIRY_BUFFER: 30, // seconds before expiry to consider token invalid
  REFRESH_THRESHOLD: 120, // seconds before expiry to trigger refresh

  // Timeouts
  REQUEST_TIMEOUT: 30000, // 30 seconds
  REFRESH_TIMEOUT: 15000, // 15 seconds
  QUEUE_TIMEOUT: 15000, // 15 seconds

  // Retry settings
  MAX_RETRIES: 3,
  BASE_RETRY_DELAY: 1000, // 1 second
  REFRESH_MAX_RETRIES: 2,
  REFRESH_RETRY_DELAY: 2000, // 2 seconds

  // Monitoring intervals
  TOKEN_CHECK_INTERVAL: 30000, // 30 seconds
  ACTIVITY_CHECK_INTERVAL: 60000, // 1 minute
  ACTIVITY_TIMEOUT: 5 * 60 * 1000, // 5 minutes

  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: 'Network error - please check your connection',
    TOKEN_EXPIRED: 'Session expired - please login again',
    REFRESH_FAILED: 'Failed to refresh session - please login again',
    NO_TOKEN: 'No authentication token available',
    UNAUTHORIZED: 'Unauthorized access - please login again',
  },
};

export default AUTH_CONSTANTS;
