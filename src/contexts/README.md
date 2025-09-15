# Authentication System Documentation

## Overview
This authentication system uses React Context API to manage authentication state throughout the application.

## Features
- ✅ Mock authentication with any username and fixed password (`test123`)
- ✅ JWT token generation and storage
- ✅ Persistent login (localStorage)
- ✅ Loading states and error handling
- ✅ Form validation
- ✅ Automatic dashboard navigation on successful login
- ✅ Logout functionality

## How to Use

### Login Credentials
- **Username/Email**: Any valid email address
- **Password**: `test123` (hardcoded for demo)
- **Terms**: Must be checked

### Testing the Authentication
1. Open the application
2. Enter any email address (e.g., `john@example.com`)
3. Enter password: `test123`
4. Check the "I agree to Terms & Policy" checkbox
5. Click "Log in"
6. You'll be redirected to the dashboard

### Wrong Password
If you enter any password other than `test123`, you'll see an error message.

## Components

### AuthContext (`src/contexts/AuthContext.tsx`)
- Manages authentication state
- Provides login/logout functions
- Handles token persistence
- Mock JWT generation

### LoginForm (`src/components/pages/auth/LoginForm.tsx`)
- Form validation
- Loading states
- Error/success messages
- Integration with AuthContext

### Dashboard (`src/components/pages/Dashboard.tsx`)
- Protected route (only shown when authenticated)
- Displays user information
- Shows authentication token
- Logout functionality

## State Management
The authentication state includes:
- `user`: User object with id, username, email
- `token`: Mock JWT token
- `isAuthenticated`: Boolean authentication status
- `isLoading`: Loading state during auth operations

## Persistence
- Authentication state is saved to `localStorage`
- User remains logged in across browser sessions
- Token and user data are restored on app reload

## Security Notes
⚠️ **This is a mock implementation for demo purposes:**
- Passwords are hardcoded
- JWT tokens are mock generated
- No real backend validation
- localStorage is used (not secure for production)

## Next Steps
- Replace mock auth with real API calls
- Implement proper JWT validation
- Add refresh token mechanism
- Add proper routing/navigation
- Implement role-based access control