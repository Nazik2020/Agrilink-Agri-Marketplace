# Ban System Implementation Guide

## Overview

This implementation provides a comprehensive user ban system that prevents banned users from logging into the AgriLink marketplace. The system follows Object-Oriented Programming (OOP) principles and includes both backend and frontend components.

## Architecture

### Backend Components

#### 1. UserAuthenticationService (`backend/services/UserAuthenticationService.php`)
**Purpose**: Handles user authentication with status validation

**Key Features**:
- Authenticates users (admin, seller, customer)
- Checks user status before allowing login
- Updates last login timestamps
- Returns appropriate error messages for banned users

**Methods**:
- `authenticateUser($email, $password)` - Main authentication method
- `authenticateAdmin($email, $password)` - Admin authentication
- `authenticateSeller($email, $password)` - Seller authentication with status check
- `authenticateCustomer($email, $password)` - Customer authentication with status check
- `isUserBanned($email, $userType)` - Check if user is banned
- `getUserStatus($email, $userType)` - Get user status

#### 2. UserStatusMiddleware (`backend/services/UserStatusMiddleware.php`)
**Purpose**: Middleware for checking user status on protected routes

**Key Features**:
- Validates user sessions
- Checks user access permissions
- Prevents banned users from accessing protected routes
- Provides detailed error messages

**Methods**:
- `checkUserAccess($email, $userType)` - Check if user can access system
- `validateUserSession($userData)` - Validate session data
- `getUserStatus($email, $userType)` - Get detailed user status

#### 3. Updated Login.php
**Purpose**: Main login endpoint using the new authentication service

**Changes**:
- Replaced procedural code with OOP service
- Integrated status checking
- Better error handling for banned users

#### 4. Session Validation API (`backend/validate_session.php`)
**Purpose**: API endpoint for validating user sessions

**Features**:
- Validates current user session
- Checks if user is banned
- Returns appropriate error responses

### Frontend Components

#### 1. useSessionValidation Hook (`src/hooks/useSessionValidation.js`)
**Purpose**: React hook for session validation

**Features**:
- Validates user sessions
- Handles banned user scenarios
- Provides logout functionality
- Manages session state

**Methods**:
- `validateSession()` - Validate current session
- `isLoggedIn()` - Check if user is logged in
- `getCurrentUser()` - Get current user data
- `logout()` - Logout user

#### 2. ProtectedRoute Component (`src/components/common/ProtectedRoute.jsx`)
**Purpose**: React component for protecting routes

**Features**:
- Role-based access control
- Session validation
- Loading states
- Error handling for banned users

#### 3. Updated Login Component
**Purpose**: Enhanced login form with better error handling

**Changes**:
- Better error messages for banned users
- Visual indicators for account suspension
- Contact information for support

## Database Schema

### Required Columns

Both `customers` and `sellers` tables need these columns:

```sql
ALTER TABLE customers ADD COLUMN status ENUM('active', 'banned', 'pending') DEFAULT 'active';
ALTER TABLE customers ADD COLUMN banned_reason TEXT NULL;
ALTER TABLE customers ADD COLUMN banned_at DATETIME NULL;
ALTER TABLE customers ADD COLUMN user_type VARCHAR(20) DEFAULT 'customer';

ALTER TABLE sellers ADD COLUMN status ENUM('active', 'banned', 'pending') DEFAULT 'active';
ALTER TABLE sellers ADD COLUMN banned_reason TEXT NULL;
ALTER TABLE sellers ADD COLUMN banned_at DATETIME NULL;
ALTER TABLE sellers ADD COLUMN user_type VARCHAR(20) DEFAULT 'seller';
```

## How It Works

### 1. Login Process
1. User enters credentials
2. `UserAuthenticationService` validates credentials
3. If credentials are valid, check user status
4. If status is 'banned', return error with specific message
5. If status is 'active', allow login and update last login

### 2. Session Validation
1. On protected routes, `ProtectedRoute` component validates session
2. Calls `validate_session.php` API
3. If user is banned, clears session and redirects to login
4. If session is valid, allows access

### 3. Admin Dashboard
1. Admin can view all users with their status
2. Admin can suspend/activate users
3. Status changes are immediately reflected in database
4. Banned users cannot log in on next attempt

## Usage Examples

### Backend Usage

```php
// Create authentication service
$authService = new UserAuthenticationService();

// Authenticate user
$result = $authService->authenticateUser('user@example.com', 'password');

if ($result['success']) {
    // User logged in successfully
    echo "Welcome, " . $result['user']['name'];
} else {
    // Handle error
    if ($result['error_type'] === 'account_banned') {
        echo "Account suspended: " . $result['message'];
    }
}
```

### Frontend Usage

```jsx
// In a React component
import { useSessionValidation } from '../hooks/useSessionValidation';

const MyComponent = () => {
  const { validateSession, sessionValid, error } = useSessionValidation();

  useEffect(() => {
    validateSession();
  }, []);

  if (!sessionValid) {
    return <div>Account suspended: {error}</div>;
  }

  return <div>Welcome to the dashboard!</div>;
};
```

## Testing

### Run the Test Script
```bash
php backend/test_ban_system.php
```

This script will:
1. Check database structure
2. Test authentication service
3. Test middleware
4. Create a test banned user
5. Verify ban functionality

### Manual Testing
1. Create a user account
2. Login to admin dashboard
3. Suspend the user
4. Try to login with suspended account
5. Verify error message appears
6. Reactivate user in admin dashboard
7. Verify user can login again

## Error Handling

### Backend Error Types
- `account_banned` - User account is suspended
- `user_not_found` - User doesn't exist
- `invalid_session` - Session data is invalid
- `system_error` - Database or system error

### Frontend Error Handling
- Displays user-friendly error messages
- Provides contact information for support
- Automatically logs out banned users
- Redirects to login page when needed

## Security Features

1. **Status Validation**: Every login attempt checks user status
2. **Session Validation**: Protected routes validate session on each access
3. **Role-Based Access**: Different user types have different permissions
4. **Error Logging**: All errors are logged for debugging
5. **SQL Injection Protection**: All database queries use prepared statements

## Maintenance

### Adding New User Types
1. Update `UserAuthenticationService` with new authentication method
2. Update `UserStatusMiddleware` to handle new user type
3. Update frontend `ProtectedRoute` component
4. Update database schema if needed

### Modifying Ban Logic
1. Update status checking in authentication service
2. Update middleware validation
3. Update frontend error handling
4. Test thoroughly with different scenarios

## Troubleshooting

### Common Issues

1. **Status column missing**: Run database setup script
2. **Login not working**: Check database connection and user credentials
3. **Session validation failing**: Check API endpoint and network connectivity
4. **Frontend not updating**: Clear browser cache and session storage

### Debug Steps
1. Check browser console for JavaScript errors
2. Check server logs for PHP errors
3. Verify database connection
4. Test API endpoints directly
5. Check user status in database

## Future Enhancements

1. **Email Notifications**: Send emails when users are banned/unbanned
2. **Ban History**: Track ban history and reasons
3. **Appeal System**: Allow users to appeal bans
4. **Temporary Bans**: Support for time-limited bans
5. **IP Blocking**: Block banned users by IP address
6. **Audit Log**: Log all ban-related actions for compliance

## Conclusion

This ban system implementation provides a robust, secure, and user-friendly way to manage user access in the AgriLink marketplace. It follows OOP principles, includes comprehensive error handling, and provides both backend and frontend components for a complete solution.










