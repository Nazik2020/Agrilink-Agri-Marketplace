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
    // Get sample customer and products
    $customers = $conn->query("SELECT id, email FROM customers LIMIT 3")->fetchAll(PDO::FETCH_ASSOC);
    $products = $conn->query("SELECT id, product_name, price FROM products LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);
    
    // Get current cart state for first customer
    $cart = new Cart($conn);
    $customerId = $customers[0]['id'] ?? null;
    
    $currentCart = [];
    $cartSummary = [];
    
    if ($customerId) {
        $currentCart = $cart->getCartItems($customerId);
        $cartSummary = $cart->getCartSummary($customerId);
    }
    
    echo json_encode([
        "success" => true,
        "message" => "Cart debug information",
        "available_customers" => $customers,
        "available_products" => $products,
        "test_customer_id" => $customerId,
        "current_cart_items" => $currentCart,
        "cart_summary" => $cartSummary,
        "debug_info" => [
            "total_customers" => count($customers),
            "total_products" => count($products),
            "cart_items_count" => count($currentCart)
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error in debug script",
        "error" => $e->getMessage()
    ]);
}
?> 