# Admin Dashboard Troubleshooting Guide

## Issue: "Failed to fetch users from server" Error

### Step 1: Check Backend Server
Make sure your PHP server is running. If you're using XAMPP/WAMP:

1. **Start Apache server**
2. **Start MySQL server**
3. **Verify PHP is running** on port 80 (default)

### Step 2: Test Backend Connection
Open your browser and visit:
```
http://localhost/backend/admin/test_connection.php
```

You should see a JSON response like:
```json
{
  "success": true,
  "message": "Backend connection successful",
  "data": {
    "customers_count": 5,
    "sellers_count": 3,
    "timestamp": "2024-01-15 10:30:00"
  }
}
```

### Step 3: Check Vite Proxy Configuration
The `vite.config.js` file should have this proxy configuration:
```javascript
server: {
  port: 3000,
  proxy: {
    '/backend': {
      target: 'http://localhost:80',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

### Step 4: Restart Development Server
After updating the config, restart your React development server:
```bash
npm run dev
```

### Step 5: Check Browser Console
Open browser developer tools (F12) and check the Console tab for:
- Network errors
- API response details
- Connection test results

### Step 6: Verify Database Tables
Make sure the required tables exist:
```sql
-- Check if tables exist
SHOW TABLES LIKE 'customers';
SHOW TABLES LIKE 'sellers';
SHOW TABLES LIKE 'admin_users';
```

### Step 7: Test API Endpoint Directly
Visit this URL in your browser:
```
http://localhost/backend/admin/user_management/get_all_users.php?page=1&limit=10&filter=all
```

### Common Issues & Solutions:

#### Issue 1: "Connection refused"
- **Solution**: Start your PHP server (Apache/XAMPP/WAMP)

#### Issue 2: "404 Not Found"
- **Solution**: Check if the backend files are in the correct location:
  ```
  backend/admin/user_management/get_all_users.php
  ```

#### Issue 3: "CORS error"
- **Solution**: The proxy configuration in vite.config.js should handle this

#### Issue 4: "Database connection failed"
- **Solution**: Check your database credentials in `backend/db.php`

### Debug Steps:

1. **Check Network Tab**: In browser dev tools, go to Network tab and see if the API calls are being made

2. **Check Console Logs**: Look for the console.log messages we added:
   - "Testing backend connection..."
   - "Fetching users from: ..."
   - "API Response: ..."

3. **Test Individual Endpoints**: Try accessing each API endpoint directly in your browser

### Quick Fix Commands:

```bash
# Restart React dev server
npm run dev

# If using XAMPP, restart Apache and MySQL
# If using WAMP, restart WAMP services
```

### Expected Behavior:
- ✅ Backend test shows success
- ✅ Console shows "Backend is accessible"
- ✅ Users load from database
- ✅ Search and filter work
- ✅ Pagination works

If you're still having issues, check the browser console and share the error messages! 