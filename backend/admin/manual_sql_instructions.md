# Manual SQL Instructions for Adding Last Login Tracking

## Step 1: Add the Database Columns

Run these SQL commands in your MySQL database:

```sql
-- Add last_login column to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_login DATETIME NULL;

-- Add last_login column to sellers table  
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS last_login DATETIME NULL;

-- Verify the columns were added
DESCRIBE customers;
DESCRIBE sellers;
```

## Step 2: Test the Columns

Run this SQL to verify the columns exist:

```sql
-- Check if columns exist
SHOW COLUMNS FROM customers LIKE 'last_login';
SHOW COLUMNS FROM sellers LIKE 'last_login';

-- Show sample data
SELECT id, full_name, email, last_login FROM customers LIMIT 5;
SELECT id, business_name, email, last_login FROM sellers LIMIT 5;
```

## Step 3: After Adding Columns

Once you've added the columns:

1. **Update UserManager.php** - Change `NULL as last_login` back to `COALESCE(last_login, NULL) as last_login`
2. **Test login tracking** - Log in with any user account
3. **Check admin dashboard** - You should see actual login times

## Current Status

- ✅ **Admin dashboard works** (shows "Never" for all users)
- ✅ **No database errors**
- ⏳ **Waiting for you to add the columns**

After you add the columns, the login tracking will work perfectly! 