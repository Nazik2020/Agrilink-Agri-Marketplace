<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';
require_once 'models/Order.php';

try {
    // Get sample data
    $customers = $conn->query("SELECT id FROM customers LIMIT 1")->fetchAll(PDO::FETCH_ASSOC);
    $products = $conn->query("SELECT id, product_name, price, seller_id FROM products LIMIT 1")->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($customers) || empty($products)) {
        echo json_encode([
            "success" => false,
            "error" => "No customers or products found"
        ]);
        exit;
    }
    
    $customer = $customers[0];
    $product = $products[0];
    
    // Test order data
    $testOrderData = [
        'customer_id' => $customer['id'],
        'seller_id' => $product['seller_id'],
        'product_id' => $product['id'],
        'product_name' => $product['product_name'],
        'quantity' => 1,
        'unit_price' => $product['price'],
        'total_amount' => $product['price'],
        'order_status' => 'pending',
        'payment_status' => 'pending',
        'payment_method' => 'credit_card',
        'billing_name' => 'Test Customer',
        'billing_email' => 'test@example.com',
        'billing_address' => 'Test Address',
        'billing_postal_code' => '12345',
        'billing_country' => 'Test Country',
        'card_last_four' => '1234',
        'transaction_id' => 'test_transaction_123'
    ];
    
    echo json_encode([
        "success" => true,
        "test_data" => [
            "customer" => $customer,
            "product" => $product,
            "order_data" => $testOrderData
        ],
        "instructions" => [
            "1. Check if all required data is present",
            "2. Verify database connection",
            "3. Test order creation manually"
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage(),
        "trace" => $e->getTraceAsString()
    ]);
}
?>
