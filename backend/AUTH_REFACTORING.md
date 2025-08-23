# Authentication System Refactoring Documentation

## Overview

This document describes the comprehensive refactoring of the authentication system to fix logical errors, unify token lifetimes, eliminate hardcoded values, and improve reliability.

## Changes Made

### 1. Constants File (`src/constants/index.js`)

- Added unified time constants for testing and production environments
- **Testing constants:**
  - `TEN_SECONDS = 10 * 1000` (10 seconds)
  - `THIRTY_MINUTES_FOR_TEST = 30 * 60 * 1000` (30 minutes)
- **Production constants:**
  - `THIRTY_MINUTES = 30 * 60 * 1000` (30 minutes)
  - `SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000` (7 days)

### 2. Login Service (`src/services/auth/login.js`)

- Synchronized access token lifetime between JWT and database
- Synchronized refresh token lifetime between JWT and database
- **Current (testing):**
  - Access token: 10 seconds
  - Refresh token: 30 minutes
- **Production (uncomment):**
  - Access token: 30 minutes
  - Refresh token: 7 days

### 3. Session Refresh Service (`src/services/auth/sessions.js`)

- **FIXED:** Eliminated hardcoded user data (`email: 'user@example.com', name: 'User'`)
- Now loads actual user data from database for token creation
- Synchronized token lifetimes with database records
- Improved error handling for missing users

### 4. Controllers

- **Login Controller:** Updated cookie expiration times to match refresh token lifetime
- **Refresh Controller:** Updated cookie expiration times and improved error handling

## Switching to Production Mode

### Step 1: Update Constants Import

In `src/services/auth/login.js`:

```javascript
// Comment out testing constants
// import { TEN_SECONDS, THIRTY_MINUTES_FOR_TEST } from '../../constants/index.js';

// Uncomment production constants
import { THIRTY_MINUTES, SEVEN_DAYS } from '../../constants/index.js';
```

### Step 2: Update JWT Expiration Times

In `src/services/auth/login.js`:

```javascript
// Change from testing to production
{ expiresIn: '30m' }, // Instead of '10s'
{ expiresIn: '7d' },  // Instead of '30m'
```

### Step 3: Update Database Timestamps

In `src/services/auth/login.js`:

```javascript
// Comment out testing timestamps
// accessTokenValidUntil: new Date(Date.now() + TEN_SECONDS),
// refreshTokenValidUntil: new Date(Date.now() + THIRTY_MINUTES_FOR_TEST),

// Uncomment production timestamps
accessTokenValidUntil: new Date(Date.now() + THIRTY_MINUTES),
refreshTokenValidUntil: new Date(Date.now() + SEVEN_DAYS),
```

### Step 4: Update Session Refresh Service

Apply the same changes to `src/services/auth/sessions.js`:

```javascript
// Comment out testing constants
// import { TEN_SECONDS, THIRTY_MINUTES_FOR_TEST } from '../../constants/index.js';

// Uncomment production constants
import { THIRTY_MINUTES, SEVEN_DAYS } from '../../constants/index.js';
```

### Step 5: Update Controllers

In both `src/controllers/auth/login.js` and `src/controllers/auth/refresh.js`:

```javascript
// Comment out testing constant
// import { THIRTY_MINUTES_FOR_TEST } from '../../constants/index.js';

// Uncomment production constant
import { SEVEN_DAYS } from '../../constants/index.js';

// Update cookie expiration
expires: new Date(Date.now() + SEVEN_DAYS),
```

## Benefits of Refactoring

1. **Eliminated Hardcoded Values:** User data is now loaded from database
2. **Synchronized Token Lifetimes:** JWT, database, and cookies now use consistent timing
3. **Improved Error Handling:** Better error messages and validation
4. **Easy Environment Switching:** Simple constant changes to switch between testing and production
5. **Maintainable Code:** Centralized constants make configuration changes easier

## Testing the Refactoring

1. **Login Flow:** Verify tokens are created with correct lifetimes
2. **Session Refresh:** Verify new tokens contain actual user data
3. **Cookie Expiration:** Verify cookies expire at the same time as refresh tokens
4. **Error Handling:** Test with invalid tokens and expired sessions

## Security Considerations

- Access tokens have short lifetimes (10s testing, 30m production)
- Refresh tokens have longer lifetimes (30m testing, 7d production)
- All tokens are stored securely in httpOnly cookies
- Session validation occurs on every request
- Automatic cleanup of expired sessions
