<?php
/**
 * Test script to verify order creation is working correctly
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/models/Order.php';

try {
    // Create Order instance
    $order = new Order($conn);
    
    // Test order data
    $testOrderData = [
        'customer_id' => 4,
        'seller_id' => 16,
        'product_id' => 44,
        'product_name' => 'SA 501',
        'quantity' => 1,
        'unit_price' => 10.00,
        'total_amount' => 10.00,
        'order_status' => 'pending',
        'payment_status' => 'pending',
        'payment_method' => 'credit_card',
        'billing_name' => 'Test User',
        'billing_email' => 'test@example.com',
        'billing_address' => 'Test Address',
        'billing_postal_code' => '12345',
        'billing_country' => 'Test Country',
        'transaction_id' => 'test_transaction_' . time()
    ];
    
    echo "Testing order creation...\n";
    echo "Order data: " . json_encode($testOrderData, JSON_PRETTY_PRINT) . "\n";
    
    $result = $order->create($testOrderData);
    
    if ($result) {
        echo "SUCCESS: Order created with ID: " . $result . "\n";
        
        // Try to fetch the created order
        $createdOrder = $order->findById($result);
        if ($createdOrder) {
            echo "Order found in database: " . json_encode($createdOrder, JSON_PRETTY_PRINT) . "\n";
        } else {
            echo "WARNING: Order created but could not be retrieved\n";
        }
    } else {
        echo "FAILED: Order creation failed\n";
    }
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?>
