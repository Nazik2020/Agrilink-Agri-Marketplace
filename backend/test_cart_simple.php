<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

require 'db.php';
require 'Cart.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Get first customer and first product for testing
    $customer = $conn->query("SELECT id, email FROM customers LIMIT 1")->fetch(PDO::FETCH_ASSOC);
    $product = $conn->query("SELECT id, product_name, price FROM products LIMIT 1")->fetch(PDO::FETCH_ASSOC);
    
    if (!$customer || !$product) {
        echo json_encode([
            "success" => false,
            "message" => "No customer or product found for testing"
        ]);
        exit;
    }
    
    $customerId = $customer['id'];
    $productId = $product['id'];
    
    echo json_encode([
        "success" => true,
        "message" => "Test data ready",
        "test_customer" => $customer,
        "test_product" => $product,
        "test_commands" => [
            "add_to_cart" => "POST to add_to_cart.php with customer_id: $customerId, product_id: $productId",
            "get_cart" => "POST to get_cart.php with customer_id: $customerId",
            "update_quantity" => "POST to update_cart_item.php with customer_id: $customerId, product_id: $productId, quantity: 2",
            "remove_item" => "POST to remove_from_cart.php with customer_id: $customerId, product_id: $productId"
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error in test script",
        "error" => $e->getMessage()
    ]);
}
?> 