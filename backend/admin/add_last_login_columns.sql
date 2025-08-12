-- SQL script to add last_login columns to customers and sellers tables
-- This fixes the "Unknown column 'last_login' in 'field list'" error

-- Add last_login column to customers table
ALTER TABLE customers ADD COLUMN last_login DATETIME NULL;

-- Add last_login column to sellers table
ALTER TABLE sellers ADD COLUMN last_login DATETIME NULL;

-- Verify the columns were added
SHOW COLUMNS FROM customers LIKE 'last_login';
SHOW COLUMNS FROM sellers LIKE 'last_login';