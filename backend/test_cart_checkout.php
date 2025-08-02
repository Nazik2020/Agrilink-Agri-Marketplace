<?php
/**
 * Test cart checkout specifically
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/services/CheckoutService.php';

echo "=== TESTING CART CHECKOUT ===\n";

try {
    $checkoutService = new CheckoutService($conn);
    
    // Test cart checkout data (matching frontend data)
    $cartCheckoutData = [
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
                'product_id' => 48,
                'quantity' => 1,
                'price' => 80.00
            ]
        ],
        'total_amount' => 90.00
    ];
    
    echo "1. Testing cart checkout process directly...\n";
    $result = $checkoutService->processCheckout($cartCheckoutData);
    
    echo "Result: " . json_encode($result, JSON_PRETTY_PRINT) . "\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
?>
