// Utility to test JWT token validation
export const testJWTToken = (token) => {
  console.log('🧪 Testing JWT token...');
  console.log('🔑 Token type:', typeof token);
  console.log('🔑 Token length:', token ? token.length : 0);
  
  if (!token) {
    console.log('❌ No token provided');
    return false;
  }

  if (typeof token !== 'string') {
    console.log('❌ Token is not a string');
    return false;
  }

  // Check basic JWT format
  const parts = token.split('.');
  console.log('🔑 Token parts count:', parts.length);
  
  if (parts.length !== 3) {
    console.log('❌ Token does not have 3 parts (header.payload.signature)');
    return false;
  }

  // Check each part
  parts.forEach((part, index) => {
    const partName = ['header', 'payload', 'signature'][index];
    console.log(`🔑 ${partName} part length:`, part.length);
    console.log(`🔑 ${partName} part:`, part.substring(0, 20) + '...');
  });

  // Check if parts are non-empty
  if (parts.some(part => !part)) {
    console.log('❌ Token has empty parts');
    return false;
  }

  try {
    // Try to decode header
    const header = parts[0];
    const decodedHeader = atob(header);
    console.log('🔑 Decoded header:', decodedHeader);
    
    // Try to decode payload
    const payload = parts[1];
    const decodedPayload = atob(payload);
    console.log('🔑 Decoded payload:', decodedPayload);
    
    // Try to parse payload as JSON
    const parsedPayload = JSON.parse(decodedPayload);
    console.log('🔑 Parsed payload:', parsedPayload);
    
    // Check expiration
    if (parsedPayload.exp) {
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = parsedPayload.exp - currentTime;
      console.log('🔑 Token expires in:', Math.round(timeUntilExpiry), 'seconds');
      
      if (timeUntilExpiry <= 0) {
        console.log('❌ Token has expired');
        return false;
      }
    }
    
    console.log('✅ Token appears to be valid');
    return true;
    
  } catch (error) {
    console.log('❌ Error decoding token:', error.message);
    return false;
  }
};

// Function to check localStorage for corrupted tokens
export const checkLocalStorageTokens = () => {
  console.log('🔍 Checking localStorage for tokens...');
  
  try {
    const authData = localStorage.getItem('persist:auth');
    if (authData) {
      console.log('🔑 Found persist:auth in localStorage');
      const parsed = JSON.parse(authData);
      console.log('🔑 Parsed auth data:', parsed);
      
      if (parsed.token) {
        const token = JSON.parse(parsed.token);
        console.log('🔑 Token from localStorage:', token);
        if (token) {
          testJWTToken(token);
        }
      }
    } else {
      console.log('🔑 No persist:auth found in localStorage');
    }
  } catch (error) {
    console.log('❌ Error checking localStorage:', error.message);
  }
};

// Function to clear all auth data
export const clearAllAuthData = () => {
  console.log('🧹 Clearing all auth data...');
  
  try {
    // Clear localStorage
    localStorage.removeItem('persist:auth');
    console.log('✅ Cleared persist:auth from localStorage');
    
    // Clear sessionStorage
    sessionStorage.removeItem('persist:auth');
    console.log('✅ Cleared persist:auth from sessionStorage');
    
    // Clear any other auth-related items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('auth')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`✅ Cleared ${key} from localStorage`);
    });
    
    console.log('✅ All auth data cleared');
    
  } catch (error) {
    console.log('❌ Error clearing auth data:', error.message);
  }
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  window.testJWTToken = testJWTToken;
  window.checkLocalStorageTokens = checkLocalStorageTokens;
  window.clearAllAuthData = clearAllAuthData;
  
  console.log('🧪 JWT testing utilities available globally:');
  console.log('  - window.testJWTToken(token)');
  console.log('  - window.checkLocalStorageTokens()');
  console.log('  - window.clearAllAuthData()');
}
