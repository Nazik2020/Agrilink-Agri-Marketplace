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
$quantity = $data['quantity'] ?? null;

// Log the incoming request
error_log("Update cart item request: " . print_r($data, true));

// Validate required fields
if (empty($customerId) || empty($productId) || $quantity === null) {
    echo json_encode([
        "success" => false, 
        "message" => "Customer ID, Product ID, and Quantity are required",
        "debug" => [
            "customer_id" => $customerId,
            "product_id" => $productId,
            "quantity" => $quantity
        ]
    ]);
    exit;
}

// Validate quantity
if ($quantity < 0) {
    echo json_encode([
        "success" => false, 
        "message" => "Quantity cannot be negative"
    ]);
    exit;
}

try {
    $cart = new Cart($conn);
    $result = $cart->updateQuantity($customerId, $productId, $quantity);

    if ($result['success']) {
        // Get updated cart summary
        $summary = $cart->getCartSummary($customerId);
        
        echo json_encode([
            "success" => true,
            "message" => $result['message'],
            "cart_summary" => $summary,
            "debug" => "Cart item updated successfully"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => $result['message'],
            "debug" => "Failed to update cart item"
        ]);
    }

} catch (Exception $e) {
    error_log("Error in update_cart_item.php: " . $e->getMessage());
    echo json_encode([
        "success" => false, 
        "message" => "An unexpected error occurred",
        "error" => $e->getMessage(),
        "debug" => "Exception caught in update_cart_item.php"
    ]);
}
?> 