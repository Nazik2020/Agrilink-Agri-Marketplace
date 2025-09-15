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

// Log the incoming request
error_log("Remove from cart request: " . print_r($data, true));

// Validate required fields
if (empty($customerId) || empty($productId)) {
    echo json_encode([
        "success" => false, 
        "message" => "Customer ID and Product ID are required",
        "debug" => [
            "customer_id" => $customerId,
            "product_id" => $productId
        ]
    ]);
    exit;
}

try {
    $cart = new Cart($conn);
    $result = $cart->removeFromCart($customerId, $productId);

    if ($result['success']) {
        // Get updated cart summary
        $summary = $cart->getCartSummary($customerId);
        
        echo json_encode([
            "success" => true,
            "message" => $result['message'],
            "cart_summary" => $summary,
            "debug" => "Item removed from cart successfully"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => $result['message'],
            "debug" => "Failed to remove item from cart"
        ]);
    }

} catch (Exception $e) {
    error_log("Error in remove_from_cart.php: " . $e->getMessage());
    echo json_encode([
        "success" => false, 
        "message" => "An unexpected error occurred",
        "error" => $e->getMessage(),
        "debug" => "Exception caught in remove_from_cart.php"
    ]);
}
?> 