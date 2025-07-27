<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Get sample seller data
    $sellers = $conn->query("SELECT id, email, username, business_name FROM sellers LIMIT 3")->fetchAll(PDO::FETCH_ASSOC);
    
    // Get sample products for sellers
    $products = $conn->query("SELECT id, product_name, seller_id FROM products LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "message" => "Seller system test data",
        "available_sellers" => $sellers,
        "available_products" => $products,
        "test_info" => [
            "total_sellers" => count($sellers),
            "total_products" => count($products),
            "login_test" => "Use any seller email/password to test login",
            "profile_test" => "After login, seller profile should load automatically"
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error in seller test script",
        "error" => $e->getMessage()
    ]);
}
?> 