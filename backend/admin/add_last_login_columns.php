<?php
// Script to add last_login columns to customers and sellers tables
// This fixes the "Unknown column 'last_login' in 'field list'" error

require_once '../db.php';

echo "Setting up last_login tracking...\n\n";

try {
    // Get database connection
    $conn = getDbConnection();
    
    echo "✅ Connected to database successfully\n\n";
    
    // Check if last_login column exists in customers table
    $stmt = $conn->query("SHOW COLUMNS FROM customers LIKE 'last_login'");
    $customerHasLastLogin = $stmt->rowCount() > 0;
    
    if (!$customerHasLastLogin) {
        // Add last_login to customers table
        echo "Adding last_login to customers table...\n";
        $conn->exec("ALTER TABLE customers ADD COLUMN last_login DATETIME NULL");
        echo "✅ Added last_login to customers table\n";
    } else {
        echo "✅ customers.last_login column already exists\n";
    }
    
    // Check if last_login column exists in sellers table
    $stmt = $conn->query("SHOW COLUMNS FROM sellers LIKE 'last_login'");
    $sellerHasLastLogin = $stmt->rowCount() > 0;
    
    if (!$sellerHasLastLogin) {
        // Add last_login to sellers table
        echo "Adding last_login to sellers table...\n";
        $conn->exec("ALTER TABLE sellers ADD COLUMN last_login DATETIME NULL");
        echo "✅ Added last_login to sellers table\n";
    } else {
        echo "✅ sellers.last_login column already exists\n";
    }
    
    // Verify the columns exist
    echo "\nVerifying columns...\n";
    $stmt = $conn->query("SHOW COLUMNS FROM customers LIKE 'last_login'");
    if ($stmt->rowCount() > 0) {
        echo "✅ customers.last_login column exists\n";
    } else {
        echo "❌ customers.last_login column missing\n";
    }
    
    $stmt = $conn->query("SHOW COLUMNS FROM sellers LIKE 'last_login'");
    if ($stmt->rowCount() > 0) {
        echo "✅ sellers.last_login column exists\n";
    } else {
        echo "❌ sellers.last_login column missing\n";
    }
    
    echo "\n🎉 Last login tracking setup completed!\n";
    echo "The UserManagement component should now work without errors.\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\nPlease run this SQL manually in your database:\n";
    echo "ALTER TABLE customers ADD COLUMN last_login DATETIME NULL;\n";
    echo "ALTER TABLE sellers ADD COLUMN last_login DATETIME NULL;\n";
}
?>