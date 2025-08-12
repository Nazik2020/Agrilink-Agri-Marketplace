-- Manual SQL script to add last_login columns
-- Run this directly in your MySQL database

-- Add last_login column to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_login DATETIME NULL;

-- Add last_login column to sellers table  
ALTER TABLE sellers ADD COLUMN IF NOT EXISTS last_login DATETIME NULL;

-- Verify the columns were added
DESCRIBE customers;
DESCRIBE sellers;

-- Show sample data with last_login
SELECT id, full_name, email, last_login FROM customers LIMIT 5;
SELECT id, business_name, email, last_login FROM sellers LIMIT 5; 