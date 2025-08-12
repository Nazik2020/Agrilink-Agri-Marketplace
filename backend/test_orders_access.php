<?php
/**
 * Test script to verify orders table access
 * This should confirm that the "Table 'agrilink.orders' doesn't exist" error is fixed
 */

require 'db.php';

echo "=== TESTING ORDERS TABLE ACCESS ===\n\n";

try {
    // Test 1: Check if table exists by counting rows
    echo "Test 1: Checking if orders table exists...\n";
    $stmt = $conn->query("SELECT COUNT(*) FROM orders");
    $count = $stmt->fetchColumn();
    echo "  ✅ Orders table exists. Row count: $count\n\n";
    
    // Test 2: Try to insert a test record
    echo "Test 2: Testing insert operation...\n";
    $stmt = $conn->prepare("INSERT INTO orders (customer_id, seller_id, product_id, product_name, quantity, unit_price, total_amount, billing_name, billing_email, billing_address, billing_postal_code, billing_country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    // Using dummy data for testing
    $result = $stmt->execute([
        1, // customer_id
        1, // seller_id
        1, // product_id
        'Test Product', // product_name
        2, // quantity
        10.99, // unit_price
        21.98, // total_amount
        'Test Customer', // billing_name
        'test@example.com', // billing_email
        '123 Test Street', // billing_address
        '12345', // billing_postal_code
        'Test Country' // billing_country
    ]);
    
    if ($result) {
        $orderId = $conn->lastInsertId();
        echo "  ✅ Successfully inserted test order with ID: $orderId\n";
        
        // Clean up - delete the test record
        $conn->exec("DELETE FROM orders WHERE id = $orderId");
        echo "  🧹 Cleaned up test record\n";
    }
    
    echo "\n🎉 All tests passed! The orders table is working correctly.\n";
    echo "The 'Table agrilink.orders doesn\'t exist' error has been fixed.\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    
    if (strpos($e->getMessage(), 'doesn\'t exist') !== false) {
        echo "\n⚠️  The table still doesn't exist. You may need to:\n";
        echo "  1. Check your database connection in db.php\n";
        echo "  2. Verify the database 'agrilink' exists\n";
        echo "  3. Run the create_orders_table.php script\n";
    }
}
?>