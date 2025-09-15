<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require 'db.php';
require 'Cart.php';

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"), true);

// Validate JSON data
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        "success" => false, 
        "message" => "Invalid JSON data",
        "error" => json_last_error_msg()
    ]);
    exit;
}

$customerId = $data['customer_id'] ?? null;
$productId = $data['product_id'] ?? null;
$quantity = $data['quantity'] ?? 1;
$price = $data['price'] ?? null;

// Log the incoming request
error_log("Add to cart request: " . print_r($data, true));

// Validate required fields
if (empty($customerId) || empty($productId)) {
    echo json_encode([
        "success" => false, 
        "message" => "Customer ID and Product ID are required",
        "debug" => [
            "customer_id" => $customerId,
            "product_id" => $productId,
            "quantity" => $quantity
        ]
    ]);
    exit;
}

// Validate quantity
if ($quantity <= 0) {
    echo json_encode([
        "success" => false, 
        "message" => "Quantity must be greater than 0"
    ]);
    exit;
}

try {
    $cart = new Cart($conn);
    
    // Add detailed logging
    error_log("=== ADD TO CART DEBUG ===");
    error_log("Customer ID: " . $customerId);
    error_log("Product ID: " . $productId);
    error_log("Quantity: " . $quantity);
    error_log("Price: " . $price);
    
    $result = $cart->addToCart($customerId, $productId, $quantity, $price);
    
    error_log("Cart result: " . print_r($result, true));

    if ($result['success']) {
        // Get updated cart summary
        $summary = $cart->getCartSummary($customerId);
        
        error_log("Cart summary: " . print_r($summary, true));
        
        echo json_encode([
            "success" => true,
            "message" => $result['message'],
            "cart_item_id" => $result['cart_item_id'],
            "quantity" => $result['quantity'],
            "cart_summary" => $summary,
            "debug" => "Item successfully added to cart"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => $result['message'],
            "debug" => "Failed to add item to cart"
        ]);
    }

} catch (Exception $e) {
    error_log("Error in add_to_cart.php: " . $e->getMessage());
    echo json_encode([
        "success" => false, 
        "message" => "An unexpected error occurred",
        "error" => $e->getMessage(),
        "debug" => "Exception caught in add_to_cart.php"
    ]);
}
?> 