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
    // Get sample seller data for testing
    $sellers = $conn->query("SELECT id, email, username, business_name, role FROM sellers LIMIT 3")->fetchAll(PDO::FETCH_ASSOC);
    
    // Get sample customer data for comparison
    $customers = $conn->query("SELECT id, email, full_name, role FROM customers LIMIT 2")->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "message" => "Seller flow test data",
        "test_sellers" => $sellers,
        "test_customers" => $customers,
        "expected_flow" => [
            "step1" => "Seller logs in with email/password",
            "step2" => "Login redirects to home page (/)",
            "step3" => "Seller clicks account dropdown in navbar",
            "step4" => "Seller clicks 'Dashboard' option",
            "step5" => "Seller redirected to /seller-dashboard",
            "step6" => "Seller profile loads automatically"
        ],
        "test_instructions" => [
            "1. Use any seller email/password to login",
            "2. Should redirect to home page",
            "3. Click account dropdown (top right)",
            "4. Click 'Dashboard' option",
            "5. Should go to seller dashboard",
            "6. Profile should load automatically"
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error in seller flow test",
        "error" => $e->getMessage()
    ]);
}
?> 