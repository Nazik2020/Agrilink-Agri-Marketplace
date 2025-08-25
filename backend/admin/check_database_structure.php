<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../db.php';

try {
    $conn = getDbConnection();
    
    echo "Checking database structure...\n\n";
    
    // Check customers table
    echo "=== CUSTOMERS TABLE ===\n";
    $stmt = $conn->query("DESCRIBE customers");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $column) {
        echo "Column: {$column['Field']} - Type: {$column['Type']} - Default: {$column['Default']}\n";
    }
    
    // Check if status column exists in customers
    $stmt = $conn->query("SHOW COLUMNS FROM customers LIKE 'status'");
    $statusExists = $stmt->rowCount() > 0;
    echo "\nStatus column in customers exists: " . ($statusExists ? 'YES' : 'NO') . "\n";
    
    // Check sellers table
    echo "\n=== SELLERS TABLE ===\n";
    $stmt = $conn->query("DESCRIBE sellers");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $column) {
        echo "Column: {$column['Field']} - Type: {$column['Type']} - Default: {$column['Default']}\n";
    }
    
    // Check if status column exists in sellers
    $stmt = $conn->query("SHOW COLUMNS FROM sellers LIKE 'status'");
    $statusExists = $stmt->rowCount() > 0;
    echo "\nStatus column in sellers exists: " . ($statusExists ? 'YES' : 'NO') . "\n";
    
    // Show sample data
    echo "\n=== SAMPLE CUSTOMERS ===\n";
    $stmt = $conn->query("SELECT id, full_name, email, status FROM customers LIMIT 3");
    $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($customers as $customer) {
        echo "ID: {$customer['id']}, Name: {$customer['full_name']}, Email: {$customer['email']}, Status: " . ($customer['status'] ?? 'NULL') . "\n";
    }
    
    echo "\n=== SAMPLE SELLERS ===\n";
    $stmt = $conn->query("SELECT id, business_name, email, status FROM sellers LIMIT 3");
    $sellers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($sellers as $seller) {
        echo "ID: {$seller['id']}, Name: {$seller['business_name']}, Email: {$seller['email']}, Status: " . ($seller['status'] ?? 'NULL') . "\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>

