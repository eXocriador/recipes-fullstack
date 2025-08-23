# 🔐 JWT Token Migration

## What Changed

### Backend

- **Replaced** `randomBytes()` token generation with **JWT tokens**
- **Access Token**: 30 minutes expiration
- **Refresh Token**: 7 days expiration
- **Added** `jsonwebtoken` package

### Frontend

- **Restored** JWT token parsing and validation
- **Updated** constants for JWT tokens:
  - `TOKEN_EXPIRY_BUFFER`: 60 seconds (1 minute)
  - `REFRESH_THRESHOLD`: 300 seconds (5 minutes)

## Testing

### 1. **Start Backend**

```bash
cd backend
npm run dev
```

### 2. **Start Frontend**

```bash
cd frontend
npm run dev
```

### 3. **Test Login**

- Try to login with valid credentials
- Check console for JWT token logs
- Verify no more "InvalidCharacterError" errors

### 4. **Check Token Info**

In browser console:

```javascript
// Check current auth state
debugAuth.debugAuthState();

// Check axios headers
debugAuth.debugAxiosHeaders();

// Test token validation
testLogin.testTokenValidation();
```

## Expected Results

- ✅ **No more parsing errors**
- ✅ **JWT tokens with proper expiration**
- ✅ **Automatic token refresh before expiry**
- ✅ **Proper token validation**

## Token Structure

JWT tokens now contain:

```json
{
  "userId": "user_id_here",
  "email": "user@example.com",
  "name": "User Name",
  "iat": 1234567890,
  "exp": 1234567890,
  "iss": "recipes-api",
  "aud": "recipes-app"
}
```

## Troubleshooting

If you still get errors:

1. **Check backend logs** for JWT generation errors
2. **Verify** `jsonwebtoken` package is installed
3. **Check** JWT_SECRET environment variable
4. **Restart** both backend and frontend

## Files Modified

### Backend

- `src/services/auth/login.js` - JWT token generation
- `src/services/auth/sessions.js` - JWT refresh logic

### Frontend

- `src/redux/axiosInstance.js` - JWT validation
- `src/redux/utils/authMonitor.js` - JWT parsing
- `src/redux/constants/auth.js` - Updated constants
- `src/utils/debugAuth.js` - JWT debugging
- `src/utils/testAuth.js` - JWT testing
- `src/utils/testLogin.js` - JWT validation
