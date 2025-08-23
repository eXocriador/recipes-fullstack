// Network utilities for better error handling and retry logic

// Check if error is network-related
export const isNetworkError = error => {
  return (
    !error.response &&
    (error.code === 'NETWORK_ERROR' ||
      error.code === 'ECONNABORTED' ||
      error.message.includes('Network Error') ||
      error.message.includes('timeout'))
  );
};

// Check if error is retryable
export const isRetryableError = error => {
  if (isNetworkError(error)) return true;

  const status = error.response?.status;
  return status >= 500 || status === 429; // Server errors or rate limiting
};

// Exponential backoff retry with jitter
export const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  baseDelay = 1000
) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1 || !isRetryableError(error)) {
        throw error;
      }

      // Add jitter to prevent thundering herd
      const jitter = Math.random() * 0.1;
      const delay = baseDelay * Math.pow(2, i) * (1 + jitter);

      console.log(
        `🔄 Retry attempt ${i + 1}/${maxRetries} in ${Math.round(delay)}ms`
      );
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Debounce function for API calls
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for API calls
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
