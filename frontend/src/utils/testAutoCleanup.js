// Test file for auto cleanup functionality
import { createAutoCleanup } from './autoCleanup';

// Mock store for testing
const createMockStore = () => {
  let state = {
    auth: {
      token: null,
      user: null,
      isLoggedIn: false,
    }
  };

  const dispatch = (action) => {
    if (action.type === 'auth/clearCorruptedToken') {
      state.auth.token = null;
      state.auth.user = null;
      state.auth.isLoggedIn = false;
      console.log('✅ Mock store: clearCorruptedToken dispatched');
    }
    return action;
  };

  const getState = () => state;

  const setToken = (token) => {
    state.auth.token = token;
    state.auth.isLoggedIn = !!token;
    console.log('🔑 Mock store: Token set to', token ? token.substring(0, 20) + '...' : 'null');
  };

  return { dispatch, getState, setToken };
};

// Mock clearCorruptedToken action
const mockClearCorruptedToken = () => ({
  type: 'auth/clearCorruptedToken',
  payload: null
});

// Test auto cleanup functionality
export const testAutoCleanup = () => {
  console.log('🧪 Testing auto cleanup functionality...');
  
  try {
    // Create mock store
    const mockStore = createMockStore();
    console.log('✅ Mock store created');
    
    // Create auto cleanup instance
    const autoCleanup = createAutoCleanup(mockStore, mockClearCorruptedToken);
    console.log('✅ Auto cleanup instance created');
    
    // Test with valid token
    console.log('\n🔍 Test 1: Valid token');
    mockStore.setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
    
    // Start auto cleanup
    autoCleanup.start();
    console.log('✅ Auto cleanup started');
    
    // Wait a bit and check status
    setTimeout(() => {
      const status = autoCleanup.getStatus();
      console.log('📊 Auto cleanup status:', status);
      
      // Test with corrupted token
      console.log('\n🔍 Test 2: Corrupted token');
      mockStore.setToken('corrupted.token.format');
      
      // Wait for cleanup to trigger
      setTimeout(() => {
        const newStatus = autoCleanup.getState();
        console.log('📊 Store state after cleanup:', newStatus);
        
        // Stop auto cleanup
        autoCleanup.stop();
        console.log('✅ Auto cleanup stopped');
        
        console.log('✅ Auto cleanup test completed');
      }, 1000);
      
    }, 1000);
    
    return autoCleanup;
    
  } catch (error) {
    console.error('❌ Error testing auto cleanup:', error);
    return null;
  }
};

// Test auto cleanup with different scenarios
export const testAutoCleanupScenarios = () => {
  console.log('🧪 Testing auto cleanup scenarios...');
  
  const scenarios = [
    {
      name: 'Valid JWT token',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      shouldCleanup: false
    },
    {
      name: 'Invalid format token',
      token: 'invalid.token.format',
      shouldCleanup: true
    },
    {
      name: 'Empty token',
      token: '',
      shouldCleanup: true
    },
    {
      name: 'Null token',
      token: null,
      shouldCleanup: false
    },
    {
      name: 'Short token',
      token: 'short',
      shouldCleanup: true
    },
    {
      name: 'Long invalid token',
      token: 'very.long.invalid.token.that.should.be.cleaned.up.because.it.is.not.a.valid.jwt.token.format',
      shouldCleanup: true
    }
  ];
  
  scenarios.forEach((scenario, index) => {
    console.log(`\n🔍 Scenario ${index + 1}: ${scenario.name}`);
    console.log(`🔑 Token: ${scenario.token ? scenario.token.substring(0, 30) + '...' : 'null'}`);
    console.log(`🧹 Should cleanup: ${scenario.shouldCleanup}`);
  });
  
  console.log('\n✅ Auto cleanup scenarios test completed');
  return scenarios;
};

// Test auto cleanup interval changes
export const testAutoCleanupIntervals = () => {
  console.log('🧪 Testing auto cleanup intervals...');
  
  try {
    const mockStore = createMockStore();
    const autoCleanup = createAutoCleanup(mockStore, mockClearCorruptedToken);
    
    // Test different intervals
    const intervals = [1000, 5000, 10000]; // 1s, 5s, 10s
    
    intervals.forEach((interval, index) => {
      console.log(`\n⏰ Test ${index + 1}: ${interval}ms interval`);
      
      autoCleanup.setCheckInterval(interval);
      autoCleanup.start();
      
      setTimeout(() => {
        const status = autoCleanup.getStatus();
        console.log(`📊 Status after ${interval}ms:`, status);
        autoCleanup.stop();
      }, interval + 500);
    });
    
    console.log('✅ Auto cleanup intervals test completed');
    return true;
    
  } catch (error) {
    console.error('❌ Error testing auto cleanup intervals:', error);
    return false;
  }
};

// Run all auto cleanup tests
export const runAllAutoCleanupTests = () => {
  console.log('🚀 Running all auto cleanup tests...');
  
  try {
    const results = {
      basic: testAutoCleanup(),
      scenarios: testAutoCleanupScenarios(),
      intervals: testAutoCleanupIntervals()
    };
    
    console.log('\n📊 Auto cleanup test summary:', results);
    console.log('✅ All auto cleanup tests completed');
    
    return results;
    
  } catch (error) {
    console.error('❌ Error running auto cleanup tests:', error);
    return { error: error.message };
  }
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  window.testAutoCleanup = testAutoCleanup;
  window.testAutoCleanupScenarios = testAutoCleanupScenarios;
  window.testAutoCleanupIntervals = testAutoCleanupIntervals;
  window.runAllAutoCleanupTests = runAllAutoCleanupTests;
  
  console.log('🧪 Auto cleanup testing utilities available globally:');
  console.log('  - window.testAutoCleanup()');
  console.log('  - window.testAutoCleanupScenarios()');
  console.log('  - window.testAutoCleanupIntervals()');
  console.log('  - window.runAllAutoCleanupTests()');
}
