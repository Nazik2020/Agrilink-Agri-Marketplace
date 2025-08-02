<?php
/**
 * Simple test to verify database connection and Order model
 */

echo "Testing database connection and Order model...\n";

try {
    // Test database connection
    require_once __DIR__ . '/db.php';
    echo "✓ Database connection successful\n";
    
    // Test Order model
    require_once __DIR__ . '/models/Order.php';
    $order = new Order($conn);
    echo "✓ Order model loaded successfully\n";
    
    // Test a simple order creation
    $testOrderData = [
        'customer_id' => 4,
        'seller_id' => 16,
        'product_id' => 44,
        'product_name' => 'SA 501',
        'quantity' => 1,
        'unit_price' => 10.00,
        'total_amount' => 10.00,
        'billing_name' => 'Test User',
        'billing_email' => 'test@example.com',
        'billing_address' => 'Test Address',
        'billing_postal_code' => '12345',
        'billing_country' => 'Test Country',
        'transaction_id' => 'test_debug_' . time()
    ];
    
    echo "Testing order creation...\n";
    $result = $order->create($testOrderData);
    
    if ($result) {
        echo "✓ Order created successfully with ID: $result\n";
    } else {
        echo "✗ Order creation failed\n";
    }
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " Line: " . $e->getLine() . "\n";
}
?>
