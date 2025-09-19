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

// Log the incoming request
error_log("Get cart request for customer ID: " . $customerId);

// Validate required fields
if (empty($customerId)) {
    echo json_encode([
        "success" => false, 
        "message" => "Customer ID is required",
        "debug" => "No customer ID provided"
    ]);
    exit;
}

try {
    $cart = new Cart($conn);
    $cartItems = $cart->getCartItems($customerId);
    $cartSummary = $cart->getCartSummary($customerId);

    echo json_encode([
        "success" => true,
        "message" => "Cart retrieved successfully",
        "cart_items" => $cartItems,
        "cart_summary" => $cartSummary,
        "debug" => "Cart data retrieved for customer ID: " . $customerId
    ]);

} catch (Exception $e) {
    error_log("Error in get_cart.php: " . $e->getMessage());
    echo json_encode([
        "success" => false, 
        "message" => "An unexpected error occurred",
        "error" => $e->getMessage(),
        "debug" => "Exception caught in get_cart.php"
    ]);
}
?> 
