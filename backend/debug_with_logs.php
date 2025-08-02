<?php
/**
 * Direct test with error logging to console
 */

// Enable all error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set error log to output directly
ini_set('log_errors', 1);
ini_set('error_log', 'php://stdout');

echo "=== TESTING CHECKOUT WITH DEBUG LOGS ===\n";

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/services/CheckoutService.php';

try {
    $checkoutService = new CheckoutService($conn);
    
    // Test data matching frontend exactly
    $testData = [
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
                'price' => 10
            ],
            [
                'product_id' => 46,
                'quantity' => 1,
                'price' => 20
            ],
            [
                'product_id' => 48,
                'quantity' => 1,
                'price' => 80
            ],
            [
                'product_id' => 49,
                'quantity' => 1,
                'price' => 49
            ],
            [
                'product_id' => 52,
                'quantity' => 1,
                'price' => 34
            ]
        ],
        'total_amount' => 193
    ];
    
    echo "Processing checkout with debug logs...\n";
    $result = $checkoutService->processCheckout($testData);
    
    echo "\n=== FINAL RESULT ===\n";
    echo json_encode($result, JSON_PRETTY_PRINT) . "\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "TRACE: " . $e->getTraceAsString() . "\n";
}
?>
