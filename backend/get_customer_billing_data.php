<?php
// filepath: d:\Documents\GitHub\Agrilink-Agri-Marketplace\backend\get_customer_billing_data.php

// CORS headers - MUST BE FIRST
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Get customer ID from request
    $input = json_decode(file_get_contents('php://input'), true);
    $customerId = $input['customer_id'] ?? $_GET['customer_id'] ?? 1;
    $customerEmail = $input['customer_email'] ?? $_GET['customer_email'] ?? null;
    error_log("[DEBUG] Received customer_id: " . var_export($customerId, true));
    error_log("[DEBUG] Received customer_email: " . var_export($customerEmail, true));

    // Use correct DB connection
    require_once __DIR__ . '/db.php';
    
    // PRIORITY: Always try to find by email first (logged-in user's email)
    $customer = null;
    if ($customerEmail) {
        $queryEmail = "SELECT 
                        id,
                        full_name,
                        username,
                        email,
                        address,
                        contactno,
                        country,
                        postal_code
                      FROM customers 
                      WHERE email = ? 
                      LIMIT 1";
        $stmtEmail = $conn->prepare($queryEmail);
        $stmtEmail->execute([$customerEmail]);
        $customer = $stmtEmail->fetch(PDO::FETCH_ASSOC);
        error_log("[DEBUG] DB query result by email: " . var_export($customer, true));
    }
    
    // If not found by email, try by ID as fallback
    if (!$customer) {
        $query = "SELECT 
                    id,
                    full_name,
                    username,
                    email,
                    address,
                    contactno,
                    country,
                    postal_code
                  FROM customers 
                  WHERE id = ? 
                  LIMIT 1";
        $stmt = $conn->prepare($query);
        $stmt->execute([$customerId]);
        $customer = $stmt->fetch(PDO::FETCH_ASSOC);
        error_log("[DEBUG] DB query result by id: " . var_export($customer, true));
    }

    if ($customer) {
        // return real customer data
        echo json_encode([
            "success" => true,
            "customerInfo" => [
                "id" => $customer['id'],
                "name" => $customer['full_name'] ?: $customer['username'] ?: '',
                "full_name" => $customer['full_name'] ?: $customer['username'] ?: '',
                "email" => $customer['email'] ?: '',
                "address" => $customer['address'] ?: '',
                "contact" => $customer['contactno'] ?: '',
                "country" => $customer['country'] ?: '',
                "postal_code" => $customer['postal_code'] ?: ''
            ]
        ]);
    } else {
        // customer not found - return error, don't auto-create
        error_log("[DEBUG] No customer found for email: $customerEmail or id: $customerId");
        echo json_encode([
            "success" => false,
            "message" => "Customer profile not found. Please complete your signup and profile.",
            "customerInfo" => null
        ]);
    }
} catch (Exception $e) {
    // error
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "customerInfo" => null
    ]);
}
?>