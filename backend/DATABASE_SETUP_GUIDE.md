# Database Setup Guide for Ban System

## Current Issue
The ban system is correctly implemented, but the database connection is failing because the `pdo_mysql` extension is not enabled in PHP. This causes all non-admin logins to return "Database connection error" instead of the specific banned message.

## Solution Steps

### Step 1: Enable PDO MySQL Extension

#### For Windows (XAMPP/WAMP):
1. Open your PHP configuration file:
   - **XAMPP**: `C:\xampp\php\php.ini`
   - **WAMP**: `C:\wamp\bin\php\php8.x.x\php.ini`

2. Find and uncomment these lines (remove the semicolon `;` at the beginning):
   ```ini
   extension=pdo
   extension=pdo_mysql
   ```

3. Restart your web server (Apache)

#### For Windows (Standalone PHP):
1. Find your `php.ini` file:
   ```bash
   php --ini
   ```

2. Edit the `php.ini` file and uncomment:
   ```ini
   extension=pdo
   extension=pdo_mysql
   ```

3. Restart your web server

#### For Linux:
```bash
sudo apt-get install php-mysql
sudo systemctl restart apache2
```

### Step 2: Verify Installation

Run this command to check if PDO MySQL is enabled:
```bash
php -m | grep pdo
```

You should see:
```
pdo
pdo_mysql
```

### Step 3: Test the Ban System

After enabling the extension, test with a real banned user:

1. **Create a test banned user in your database:**
   ```sql
   -- For sellers table
   UPDATE sellers SET status = 'banned' WHERE email = 'test@example.com';
   
   -- For customers table  
   UPDATE customers SET status = 'banned' WHERE email = 'test@example.com';
   ```

2. **Test the login:**
   - Try to login with the banned user's credentials
   - You should see: "🚫 Your account has been suspended. Please contact support at support@agrilink.com for assistance."

### Step 4: Expected Behavior

Once the database is working, the ban system will:

- **Banned users**: Show specific banned message with `error_type = 'account_banned'`
- **Non-existent users**: Show "Invalid credentials" 
- **Wrong password**: Show "Invalid credentials"
- **Admin users**: Login successfully
- **Active users**: Login successfully

## Current Implementation Status

✅ **Ban System Code**: Correctly implemented in `UserAuthenticationService.php`
✅ **Frontend Handling**: Correctly handles `account_banned` error type
✅ **Admin Login**: Works without database connection
❌ **Database Connection**: Failing due to missing PDO MySQL extension

## Files Modified

1. `backend/services/UserAuthenticationService.php` - Core ban system logic
2. `backend/Login.php` - Uses the authentication service
3. `src/components/Login/RightSection.jsx` - Handles banned user messages
4. `src/components/common/ProtectedRoute.jsx` - Route protection for banned users

## Testing Commands

```bash
# Test admin login (works without DB)
php backend/test_admin_login.php

# Test ban system logic
php backend/test_ban_mock.php

# Test real login process
php backend/test_real_login.php
```

## Next Steps

1. Enable PDO MySQL extension using the steps above
2. Restart your web server
3. Test with real banned users in your database
4. The ban system will then work correctly with specific error messages

## Support

If you need help with the database setup, please provide:
- Your operating system
- PHP version (`php -v`)
- Web server type (Apache, Nginx, etc.)
- Current PHP extensions (`php -m`)
