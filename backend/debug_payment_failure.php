<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

require 'db.php';
require_once 'services/CheckoutService.php';
require_once 'CustomerDataManager.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Get sample data for testing
    $customers = $conn->query("SELECT id, full_name, email, address, postal_code, country FROM customers LIMIT 3")->fetchAll(PDO::FETCH_ASSOC);
    $products = $conn->query("SELECT id, name, price, seller_id FROM products LIMIT 3")->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($customers)) {
        echo json_encode([
            "success" => false,
            "error" => "No customers found in database"
        ]);
        exit;
    }
    
    if (empty($products)) {
        echo json_encode([
            "success" => false,
            "error" => "No products found in database"
        ]);
        exit;
    }
    
    $customer = $customers[0];
    $product = $products[0];
    
    // Test customer data loading
    $customerDataManager = CustomerDataManager::createFromCustomerId($conn, $customer['id']);
    $billingData = $customerDataManager->getBillingData();
    
    // Test cart checkout data
    $cartCheckoutData = [
        "action" => "create_payment_intent",
        "customer_id" => $customer['id'],
        "billing_name" => $billingData['billing_name'],
        "billing_email" => $billingData['billing_email'],
        "billing_address" => $billingData['billing_address'],
        "billing_postal_code" => $billingData['billing_postal_code'],
        "billing_country" => $billingData['billing_country'],
        "cart_items" => [
            [
                "product_id" => $product['id'],
                "quantity" => 2,
                "price" => floatval($product['price'])
            ]
        ],
        "total_amount" => floatval($product['price']) * 2
    ];
    
    // Test CheckoutService
    $checkoutService = new CheckoutService($conn);
    $result = $checkoutService->processCheckout($cartCheckoutData);
    
    echo json_encode([
        "success" => true,
        "debug_info" => [
            "customer_data" => $customer,
            "product_data" => $product,
            "billing_data" => $billingData,
            "cart_checkout_data" => $cartCheckoutData,
            "checkout_result" => $result,
            "customer_data_validation" => [
                "has_full_name" => !empty($customer['full_name']),
                "has_email" => !empty($customer['email']),
                "has_address" => !empty($customer['address']),
                "has_postal_code" => !empty($customer['postal_code']),
                "has_country" => !empty($customer['country'])
            ],
            "billing_data_validation" => [
                "has_billing_name" => !empty($billingData['billing_name']),
                "has_billing_email" => !empty($billingData['billing_email']),
                "has_billing_address" => !empty($billingData['billing_address']),
                "has_billing_postal_code" => !empty($billingData['billing_postal_code']),
                "has_billing_country" => !empty($billingData['billing_country'])
            ]
        ],
        "potential_issues" => [
            "missing_customer_data" => empty($customer['full_name']) || empty($customer['email']) || empty($customer['address']),
            "missing_billing_data" => empty($billingData['billing_name']) || empty($billingData['billing_email']) || empty($billingData['billing_address']),
            "checkout_service_error" => !$result['success'],
            "stripe_config_issue" => !file_exists(__DIR__ . '/config/stripe.php')
        ],
        "test_instructions" => [
            "1. Check if customer data is complete",
            "2. Verify billing data is properly formatted",
            "3. Test CheckoutService with sample data",
            "4. Check Stripe configuration",
            "5. Verify database connections"
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Debug error: " . $e->getMessage(),
        "trace" => $e->getTraceAsString()
    ]);
}
?> 