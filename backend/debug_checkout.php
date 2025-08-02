<?php
/**
 * Debug script to test checkout process with cart data
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/services/CheckoutService.php';

try {
    echo "=== DEBUGGING CHECKOUT PROCESS ===\n";
    
    // Test data from the frontend
    $testCheckoutData = [
        'action' => 'create_payment_intent',
        'customer_id' => 4,
        'billing_name' => 'Nawas Mohamed Iflal',
        'billing_email' => 'mohamediflal037@gmail.com',
        'billing_address' => '47 12A School lane, Hirimbura, Galle',
        'billing_postal_code' => '20000',
        'billing_country' => 'Afghanistan',
        'cart_items' => [
            [
                'product_id' => 44,
                'quantity' => 1,
                'price' => 10.00
            ],
            [
                'product_id' => 46,
                'quantity' => 1,
                'price' => 20.00
            ],
            [
                'product_id' => 48,
                'quantity' => 1,
                'price' => 80.00
            ],
            [
                'product_id' => 49,
                'quantity' => 1,
                'price' => 49.00
            ],
            [
                'product_id' => 52,
                'quantity' => 1,
                'price' => 34.00
            ]
        ],
        'total_amount' => 193.00
    ];
    
    echo "Test checkout data:\n";
    echo json_encode($testCheckoutData, JSON_PRETTY_PRINT) . "\n\n";
    
    // Test CheckoutService
    $checkoutService = new CheckoutService($conn);
    
    echo "Processing checkout...\n";
    $result = $checkoutService->processCheckout($testCheckoutData);
    
    echo "Checkout result:\n";
    echo json_encode($result, JSON_PRETTY_PRINT) . "\n\n";
    
    // If successful, let's check the created orders
    if ($result['success'] && isset($result['order_ids'])) {
        echo "Created order IDs: " . implode(', ', $result['order_ids']) . "\n";
        
        // Query the orders to see if they exist
        foreach ($result['order_ids'] as $orderId) {
            $stmt = $conn->prepare("SELECT * FROM orders WHERE id = ?");
            $stmt->execute([$orderId]);
            $order = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($order) {
                echo "Order $orderId found in database:\n";
                echo json_encode($order, JSON_PRETTY_PRINT) . "\n";
            } else {
                echo "Order $orderId NOT found in database!\n";
            }
        }
    }
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
?>
