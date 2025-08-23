# Authentication Race Condition Fix

## Problem Description

The application was suffering from a critical authentication issue: when the accessToken expires and multiple API requests are sent simultaneously, it caused a "race condition". Each request that received a 401 error independently triggered a token refresh process. The first refresh request succeeded, but the subsequent ones failed because they used the now-invalidated refreshToken, leading to incorrect user logout.

## Solution Implementation

### 1. Centralized Axios Instance

Created `frontend/src/redux/axiosInstance.js` with a centralized axios instance that includes:

- Request interceptor for automatic token injection
- Response interceptor for handling 401 errors and token refresh
- Queue management for failed requests during refresh

### 2. Race Condition Prevention

The solution implements a robust token refresh mechanism:

- **Single Refresh Process**: Only one refresh request can be active at any time
- **Request Queuing**: Failed requests during refresh are queued and retried after successful token refresh
- **Automatic Retry**: All queued requests are automatically retried with the new token
- **Error Handling**: Proper error handling for failed refresh attempts

### 3. Key Components

#### `axiosInstance.js`

- Main axios instance with interceptors
- State management for refresh process (`isRefreshing`, `failedQueue`)
- `configureInterceptors()` function for setup after store creation

#### `setupAxios.js`

- Configures interceptors after Redux store is available
- Prevents circular dependency issues

#### Updated Operations Files

- All Redux operations now use the centralized `axiosInstance`
- Removed manual token handling from individual operations
- Automatic token injection via request interceptor

### 4. How It Works

1. **Request Interceptor**: Automatically adds `Authorization` header to all requests
2. **Response Interceptor**: Catches 401 errors and manages token refresh
3. **Queue Management**: Failed requests are queued during refresh
4. **Token Refresh**: Single refresh request updates all queued requests
5. **Automatic Retry**: All failed requests are retried with new token

### 5. Benefits

- ✅ **No More Race Conditions**: Single refresh process prevents multiple refresh attempts
- ✅ **Automatic Token Management**: No manual token handling required in operations
- ✅ **Improved User Experience**: Seamless token refresh without user interruption
- ✅ **Centralized Logic**: All authentication logic in one place
- ✅ **Backward Compatible**: Existing code continues to work

### 6. Usage

The solution is automatically configured when the app starts. All API calls through Redux operations will automatically:

- Include the current access token
- Handle expired tokens
- Queue failed requests during refresh
- Retry failed requests with new tokens

### 7. Error Handling

- Failed refresh attempts trigger automatic user logout
- All queued requests are properly rejected on refresh failure
- Infinite retry loops are prevented with `_retry` flag

## Files Modified

- `frontend/src/redux/axiosInstance.js` (new)
- `frontend/src/redux/setupAxios.js` (new)
- `frontend/src/redux/auth/operations.js`
- `frontend/src/redux/auth/slice.js`
- `frontend/src/redux/recipes/operations.js`
- `frontend/src/redux/categories/operations.js`
- `frontend/src/redux/ingredients/operations.js`
- `frontend/src/main.jsx`

## Implementation Status

✅ **COMPLETED** - All files have been updated and the solution is ready for testing.

## Testing

To test the solution:

1. Start the application
2. Login with valid credentials
3. Wait for access token to expire
4. Send multiple API requests simultaneously
5. Verify that only one refresh request is made
6. Confirm all failed requests are retried with new token
7. Verify no unnecessary logout occurs

## How to Test Race Condition Fix

1. **Login to the application**
2. **Open browser DevTools** and go to Network tab
3. **Wait for token to expire** (or manually expire it)
4. **Send multiple requests simultaneously** (e.g., refresh page multiple times, click different buttons)
5. **Check Network tab** - you should see:
   - Multiple 401 responses initially
   - Only ONE refresh token request
   - All failed requests retried with new token
   - No unnecessary logout

## Troubleshooting

If you encounter issues:

1. Check browser console for errors
2. Verify that `setupAxios()` is called in `main.jsx`
3. Ensure all operations use `axiosInstance` instead of direct axios calls
4. Check that interceptors are properly configured
