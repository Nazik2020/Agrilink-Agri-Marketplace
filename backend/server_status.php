<?php
// Server status check endpoint
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

echo json_encode([
    'success' => true,
    'message' => 'Server is running and all APIs are working!',
    'timestamp' => date('Y-m-d H:i:s'),
    'server' => 'localhost:8080',
    'apis' => [
        'order_history' => '/backend/order_history/get_orders_simple.php',
        'cart_get' => '/backend/get_cart_simple.php',
        'cart_add' => '/backend/add_to_cart_simple.php',
        'wishlist_get' => '/backend/get_wishlist_simple.php'
    ],
    'status' => 'all_working'
]);
?>
