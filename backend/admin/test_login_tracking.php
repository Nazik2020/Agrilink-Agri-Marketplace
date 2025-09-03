<?php
require_once '../db.php';

echo "Testing login tracking system...\n\n";

try {
    $conn = getDbConnection();
    
    // Check if last_login columns exist
    echo "Checking database structure...\n";
    
    $stmt = $conn->query("SHOW COLUMNS FROM customers LIKE 'last_login'");
    $customerHasLastLogin = $stmt->rowCount() > 0;
    echo "Customers table has last_login: " . ($customerHasLastLogin ? "✅ Yes" : "❌ No") . "\n";
    
    $stmt = $conn->query("SHOW COLUMNS FROM sellers LIKE 'last_login'");
    $sellerHasLastLogin = $stmt->rowCount() > 0;
    echo "Sellers table has last_login: " . ($sellerHasLastLogin ? "✅ Yes" : "❌ No") . "\n";
    
    // Show sample data
    echo "\nSample customer data:\n";
    $stmt = $conn->query("SELECT id, full_name, email, last_login FROM customers LIMIT 3");
    $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($customers as $customer) {
        echo "- ID: {$customer['id']}, Name: {$customer['full_name']}, Last Login: " . 
             ($customer['last_login'] ? $customer['last_login'] : 'Never') . "\n";
    }
    
    echo "\nSample seller data:\n";
    $stmt = $conn->query("SELECT id, business_name, email, last_login FROM sellers LIMIT 3");
    $sellers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($sellers as $seller) {
        echo "- ID: {$seller['id']}, Business: {$seller['business_name']}, Last Login: " . 
             ($seller['last_login'] ? $seller['last_login'] : 'Never') . "\n";
    }
    
    echo "\n🎉 Login tracking test completed!\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?> 