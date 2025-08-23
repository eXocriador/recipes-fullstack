// Comprehensive test file for JWT functionality
import { testJWTToken, checkLocalStorageTokens, clearAllAuthData } from './testJWT';

// Test valid JWT token
const testValidToken = () => {
  console.log('🧪 Testing valid JWT token...');
  
  // This is a sample valid JWT token (expired, but valid format)
  const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
  
  const result = testJWTToken(validToken);
  console.log('✅ Valid token test result:', result);
  
  return result;
};

// Test invalid JWT token
const testInvalidToken = () => {
  console.log('🧪 Testing invalid JWT token...');
  
  const invalidToken = 'invalid.token.format';
  
  const result = testJWTToken(invalidToken);
  console.log('❌ Invalid token test result:', result);
  
  return result;
};

// Test corrupted JWT token
const testCorruptedToken = () => {
  console.log('🧪 Testing corrupted JWT token...');
  
  const corruptedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.invalid_signature';
  
  const result = testJWTToken(corruptedToken);
  console.log('❌ Corrupted token test result:', result);
  
  return result;
};

// Test empty token
const testEmptyToken = () => {
  console.log('🧪 Testing empty token...');
  
  const emptyToken = '';
  
  const result = testJWTToken(emptyToken);
  console.log('❌ Empty token test result:', result);
  
  return result;
};

// Test null token
const testNullToken = () => {
  console.log('🧪 Testing null token...');
  
  const nullToken = null;
  
  const result = testJWTToken(nullToken);
  console.log('❌ Null token test result:', result);
  
  return result;
};

// Test undefined token
const testUndefinedToken = () => {
  console.log('🧪 Testing undefined token...');
  
  const undefinedToken = undefined;
  
  const result = testJWTToken(undefinedToken);
  console.log('❌ Undefined token test result:', result);
  
  return result;
};

// Test non-string token
const testNonStringToken = () => {
  console.log('🧪 Testing non-string token...');
  
  const nonStringToken = 123;
  
  const result = testJWTToken(nonStringToken);
  console.log('❌ Non-string token test result:', result);
  
  return result;
};

// Test object token
const testObjectToken = () => {
  console.log('🧪 Testing object token...');
  
  const objectToken = { token: 'value' };
  
  const result = testJWTToken(objectToken);
  console.log('❌ Object token test result:', result);
  
  return objectToken;
};

// Test array token
const testArrayToken = () => {
  console.log('🧪 Testing array token...');
  
  const arrayToken = ['token', 'value'];
  
  const result = testJWTToken(arrayToken);
  console.log('❌ Array token test result:', result);
  
  return result;
};

// Test boolean token
const testBooleanToken = () => {
  console.log('🧪 Testing boolean token...');
  
  const booleanToken = true;
  
  const result = testJWTToken(booleanToken);
  console.log('❌ Boolean token test result:', result);
  
  return result;
};

// Test function token
const testFunctionToken = () => {
  console.log('🧪 Testing function token...');
  
  const functionToken = () => 'token';
  
  const result = testJWTToken(functionToken);
  console.log('❌ Function token test result:', result);
  
  return result;
};

// Test all token types
const testAllTokenTypes = () => {
  console.log('🧪 Testing all token types...');
  
  const results = {
    valid: testValidToken(),
    invalid: testInvalidToken(),
    corrupted: testCorruptedToken(),
    empty: testEmptyToken(),
    null: testNullToken(),
    undefined: testUndefinedToken(),
    nonString: testNonStringToken(),
    object: testObjectToken(),
    array: testArrayToken(),
    boolean: testBooleanToken(),
    function: testFunctionToken(),
  };
  
  console.log('📊 All token type test results:', results);
  
  return results;
};

// Test localStorage functions
const testLocalStorageFunctions = () => {
  console.log('🧪 Testing localStorage functions...');
  
  try {
    // Test checkLocalStorageTokens
    console.log('🔍 Testing checkLocalStorageTokens...');
    checkLocalStorageTokens();
    
    // Test clearAllAuthData
    console.log('🧹 Testing clearAllAuthData...');
    clearAllAuthData();
    
    console.log('✅ localStorage functions test completed');
    return true;
  } catch (error) {
    console.error('❌ Error testing localStorage functions:', error);
    return false;
  }
};

// Run all tests
const runAllTests = () => {
  console.log('🚀 Running all JWT tests...');
  
  try {
    // Test all token types
    const tokenResults = testAllTokenTypes();
    
    // Test localStorage functions
    const localStorageResults = testLocalStorageFunctions();
    
    // Summary
    console.log('📊 Test Summary:');
    console.log('Token tests:', tokenResults);
    console.log('LocalStorage tests:', localStorageResults);
    
    console.log('✅ All tests completed');
    return { tokenResults, localStorageResults };
  } catch (error) {
    console.error('❌ Error running tests:', error);
    return { error: error.message };
  }
};

// Export functions for use in other files
export {
  testValidToken,
  testInvalidToken,
  testCorruptedToken,
  testEmptyToken,
  testNullToken,
  testUndefinedToken,
  testNonStringToken,
  testObjectToken,
  testArrayToken,
  testBooleanToken,
  testFunctionToken,
  testAllTokenTypes,
  testLocalStorageFunctions,
  runAllTests,
};

// Make functions available globally for debugging
if (typeof window !== 'undefined') {
  window.testValidToken = testValidToken;
  window.testInvalidToken = testInvalidToken;
  window.testCorruptedToken = testCorruptedToken;
  window.testEmptyToken = testEmptyToken;
  window.testNullToken = testNullToken;
  window.testUndefinedToken = testUndefinedToken;
  window.testNonStringToken = testNonStringToken;
  window.testObjectToken = testObjectToken;
  window.testArrayToken = testArrayToken;
  window.testBooleanToken = testBooleanToken;
  window.testFunctionToken = testFunctionToken;
  window.testAllTokenTypes = testAllTokenTypes;
  window.testLocalStorageFunctions = testLocalStorageFunctions;
  window.runAllTests = runAllTests;
  
  console.log('🧪 Comprehensive JWT testing utilities available globally:');
  console.log('  - window.runAllTests() - Run all tests');
  console.log('  - window.testAllTokenTypes() - Test all token types');
  console.log('  - Individual test functions available');
}
