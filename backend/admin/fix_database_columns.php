<?php
require_once '../db.php';

echo "Fixing database columns for admin dashboard...\n\n";

try {
    $conn = getDbConnection();
    
    // Check if status column exists in customers table
    $stmt = $conn->query("SHOW COLUMNS FROM customers LIKE 'status'");
    $customerStatusExists = $stmt->rowCount() > 0;
    
    if (!$customerStatusExists) {
        echo "Adding status column to customers table...\n";
        $conn->exec("ALTER TABLE customers ADD COLUMN status ENUM('active', 'banned', 'pending') DEFAULT 'active'");
        echo "✅ Status column added to customers table\n";
    } else {
        echo "✅ Status column already exists in customers table\n";
    }
    
    // Check if status column exists in sellers table
    $stmt = $conn->query("SHOW COLUMNS FROM sellers LIKE 'status'");
    $sellerStatusExists = $stmt->rowCount() > 0;
    
    if (!$sellerStatusExists) {
        echo "Adding status column to sellers table...\n";
        $conn->exec("ALTER TABLE sellers ADD COLUMN status ENUM('active', 'banned', 'pending') DEFAULT 'active'");
        echo "✅ Status column added to sellers table\n";
    } else {
        echo "✅ Status column already exists in sellers table\n";
    }
    
    // Check if banned_reason column exists in customers table
    $stmt = $conn->query("SHOW COLUMNS FROM customers LIKE 'banned_reason'");
    $customerBannedReasonExists = $stmt->rowCount() > 0;
    
    if (!$customerBannedReasonExists) {
        echo "Adding banned_reason column to customers table...\n";
        $conn->exec("ALTER TABLE customers ADD COLUMN banned_reason TEXT NULL");
        echo "✅ banned_reason column added to customers table\n";
    } else {
        echo "✅ banned_reason column already exists in customers table\n";
    }
    
    // Check if banned_reason column exists in sellers table
    $stmt = $conn->query("SHOW COLUMNS FROM sellers LIKE 'banned_reason'");
    $sellerBannedReasonExists = $stmt->rowCount() > 0;
    
    if (!$sellerBannedReasonExists) {
        echo "Adding banned_reason column to sellers table...\n";
        $conn->exec("ALTER TABLE sellers ADD COLUMN banned_reason TEXT NULL");
        echo "✅ banned_reason column added to sellers table\n";
    } else {
        echo "✅ banned_reason column already exists in sellers table\n";
    }
    
    // Check if banned_at column exists in customers table
    $stmt = $conn->query("SHOW COLUMNS FROM customers LIKE 'banned_at'");
    $customerBannedAtExists = $stmt->rowCount() > 0;
    
    if (!$customerBannedAtExists) {
        echo "Adding banned_at column to customers table...\n";
        $conn->exec("ALTER TABLE customers ADD COLUMN banned_at DATETIME NULL");
        echo "✅ banned_at column added to customers table\n";
    } else {
        echo "✅ banned_at column already exists in customers table\n";
    }
    
    // Check if banned_at column exists in sellers table
    $stmt = $conn->query("SHOW COLUMNS FROM sellers LIKE 'banned_at'");
    $sellerBannedAtExists = $stmt->rowCount() > 0;
    
    if (!$sellerBannedAtExists) {
        echo "Adding banned_at column to sellers table...\n";
        $conn->exec("ALTER TABLE sellers ADD COLUMN banned_at DATETIME NULL");
        echo "✅ banned_at column added to sellers table\n";
    } else {
        echo "✅ banned_at column already exists in sellers table\n";
    }
    
    // Check if user_type column exists in customers table
    $stmt = $conn->query("SHOW COLUMNS FROM customers LIKE 'user_type'");
    $customerUserTypeExists = $stmt->rowCount() > 0;
    
    if (!$customerUserTypeExists) {
        echo "Adding user_type column to customers table...\n";
        $conn->exec("ALTER TABLE customers ADD COLUMN user_type VARCHAR(20) DEFAULT 'customer'");
        echo "✅ user_type column added to customers table\n";
    } else {
        echo "✅ user_type column already exists in customers table\n";
    }
    
    // Check if user_type column exists in sellers table
    $stmt = $conn->query("SHOW COLUMNS FROM sellers LIKE 'user_type'");
    $sellerUserTypeExists = $stmt->rowCount() > 0;
    
    if (!$sellerUserTypeExists) {
        echo "Adding user_type column to sellers table...\n";
        $conn->exec("ALTER TABLE sellers ADD COLUMN user_type VARCHAR(20) DEFAULT 'seller'");
        echo "✅ user_type column added to sellers table\n";
    } else {
        echo "✅ user_type column already exists in sellers table\n";
    }
    
    // Update existing records to have 'active' status
    echo "Updating existing records to have 'active' status...\n";
    $conn->exec("UPDATE customers SET status = 'active' WHERE status IS NULL");
    $conn->exec("UPDATE sellers SET status = 'active' WHERE status IS NULL");
    echo "✅ Existing records updated\n";
    
    // Verify the changes
    echo "\nVerifying database structure...\n";
    $stmt = $conn->query("SELECT COUNT(*) as total FROM customers WHERE status = 'active'");
    $activeCustomers = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    $stmt = $conn->query("SELECT COUNT(*) as total FROM sellers WHERE status = 'active'");
    $activeSellers = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    echo "✅ Active customers: $activeCustomers\n";
    echo "✅ Active sellers: $activeSellers\n";
    
    echo "\n🎉 Database columns fixed successfully!\n";
    echo "Your admin dashboard should now work properly.\n";
    
} catch (Exception $e) {
    echo "❌ Error fixing database columns: " . $e->getMessage() . "\n";
}
?> 