<?php
require_once '../db.php';

echo "Adding last_login columns to database...\n\n";

try {
    $conn = getDbConnection();
    
    // Add last_login to customers table
    echo "Adding last_login to customers table...\n";
    $conn->exec("ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_login DATETIME NULL");
    echo "✅ Added last_login to customers table\n";
    
    // Add last_login to sellers table
    echo "Adding last_login to sellers table...\n";
    $conn->exec("ALTER TABLE sellers ADD COLUMN IF NOT EXISTS last_login DATETIME NULL");
    echo "✅ Added last_login to sellers table\n";
    
    echo "\n🎉 Successfully added last_login columns!\n";
    echo "Now the admin dashboard should work without errors.\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?> 