<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

require 'db.php';
require_once 'services/CheckoutService.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Get sample data for testing
    $customers = $conn->query("SELECT id, full_name, email FROM customers LIMIT 3")->fetchAll(PDO::FETCH_ASSOC);
    $products = $conn->query("SELECT id, name, price, seller_id FROM products LIMIT 3")->fetchAll(PDO::FETCH_ASSOC);
    
    // Create sample cart checkout data
    $sampleCartCheckout = [
        "action" => "create_payment_intent",
        "customer_id" => $customers[0]['id'] ?? 1,
        "billing_name" => $customers[0]['full_name'] ?? "Test Customer",
        "billing_email" => $customers[0]['email'] ?? "test@example.com",
        "billing_address" => "123 Test Street",
        "billing_postal_code" => "12345",
        "billing_country" => "United States",
        "cart_items" => [
            [
                "product_id" => $products[0]['id'] ?? 1,
                "quantity" => 2,
                "price" => floatval($products[0]['price'] ?? 50.00)
            ],
            [
                "product_id" => $products[1]['id'] ?? 2,
                "quantity" => 1,
                "price" => floatval($products[1]['price'] ?? 120.00)
            ]
        ],
        "total_amount" => 220.00
    ];
    
    // Test single product checkout data
    $sampleSingleProductCheckout = [
        "action" => "create_payment_intent",
        "product_id" => $products[0]['id'] ?? 1,
        "quantity" => 1,
        "customer_id" => $customers[0]['id'] ?? 1,
        "billing_name" => $customers[0]['full_name'] ?? "Test Customer",
        "billing_email" => $customers[0]['email'] ?? "test@example.com",
        "billing_address" => "123 Test Street",
        "billing_postal_code" => "12345",
        "billing_country" => "United States"
    ];
    
    echo json_encode([
        "success" => true,
        "message" => "Cart Checkout Test",
        "test_data" => [
            "customers" => $customers,
            "products" => $products
        ],
        "sample_cart_checkout" => $sampleCartCheckout,
        "sample_single_product_checkout" => $sampleSingleProductCheckout,
        "cart_checkout_fixes" => [
            "checkout_api.php" => [
                "validation" => "Updated to handle both cart_items and product_id",
                "cart_validation" => "Validates cart_items structure",
                "single_product_validation" => "Validates product_id and quantity"
            ],
            "CheckoutService.php" => [
                "processCheckout" => "Routes to appropriate checkout method",
                "processCartCheckout" => "Handles multiple cart items",
                "processSingleProductCheckout" => "Handles single product",
                "validateCheckoutData" => "Validates both checkout types"
            ],
            "frontend_integration" => [
                "BuyNowModal.jsx" => "Sends cart_items for cart checkout",
                "data_structure" => "Correctly formats cart items data"
            ]
        ],
        "test_instructions" => [
            "1. Test cart checkout with sample data",
            "2. Verify validation works for both types",
            "3. Check that cart items are processed correctly",
            "4. Verify orders are created for each cart item",
            "5. Test single product checkout still works"
        ],
        "debug_info" => [
            "cart_items_structure" => "Each item should have product_id, quantity, price",
            "total_amount" => "Should match sum of all cart items",
            "billing_data" => "Required for both checkout types",
            "customer_id" => "Must be valid customer ID"
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error in cart checkout test",
        "error" => $e->getMessage()
    ]);
}
?> 