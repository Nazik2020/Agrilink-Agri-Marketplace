<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../db.php';

try {
    $conn = getDbConnection();
    
    echo "Fixing status ENUM to include 'suspended'...\n\n";
    
    // Update customers table status column
    echo "Updating customers table...\n";
    $conn->exec("ALTER TABLE customers MODIFY COLUMN status ENUM('active', 'banned', 'pending', 'suspended') DEFAULT 'active'");
    echo "✓ Customers table updated\n";
    
    // Update sellers table status column
    echo "Updating sellers table...\n";
    $conn->exec("ALTER TABLE sellers MODIFY COLUMN status ENUM('active', 'banned', 'pending', 'suspended') DEFAULT 'active'");
    echo "✓ Sellers table updated\n";
    
    // Verify the changes
    echo "\nVerifying changes...\n";
    
    $stmt = $conn->query("SHOW COLUMNS FROM customers LIKE 'status'");
    $customerStatus = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Customers status column: " . $customerStatus['Type'] . "\n";
    
    $stmt = $conn->query("SHOW COLUMNS FROM sellers LIKE 'status'");
    $sellerStatus = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Sellers status column: " . $sellerStatus['Type'] . "\n";
    
    echo "\n✓ Status ENUM updated successfully!\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>

