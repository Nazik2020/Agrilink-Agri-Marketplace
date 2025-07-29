<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $customerId = $input['customer_id'] ?? null;

    if (!$customerId) {
        echo json_encode([
            "success" => false,
            "message" => "Customer ID is required"
        ]);
        exit;
    }

    // Get customer data directly
    $stmt = $conn->prepare("SELECT * FROM customers WHERE id = ?");
    $stmt->execute([$customerId]);
    $customer = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$customer) {
        echo json_encode([
            "success" => false,
            "message" => "Customer not found"
        ]);
        exit;
    }

    // Always return success with available data
    $billingData = [
        'billing_name' => $customer['full_name'] ?? '',
        'billing_email' => $customer['email'] ?? '',
        'billing_address' => $customer['address'] ?? '',
        'billing_postal_code' => $customer['postal_code'] ?? '',
        'billing_country' => $customer['country'] ?? 'United States'
    ];

    // Count how many fields are auto-filled
    $autoFilledCount = 0;
    foreach ($billingData as $key => $value) {
        if (!empty($value) && $value !== 'United States') {
            $autoFilledCount++;
        }
    }

    echo json_encode([
        "success" => true,
        "message" => $autoFilledCount > 0 ? 
            "Auto-filled $autoFilledCount fields from your profile" : 
            "Please complete your billing information",
        "billingData" => $billingData,
        "autoFilledCount" => $autoFilledCount,
        "customerInfo" => [
            "id" => $customer['id'],
            "name" => $customer['full_name'],
            "email" => $customer['email'],
            "address" => $customer['address'] ?? '',
            "contact" => $customer['contactno'] ?? '',
            "country" => $customer['country'] ?? '',
            "postal_code" => $customer['postal_code'] ?? ''
        ]
    ]);

} catch (Exception $e) {
    error_log("Error in simple billing API: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Internal server error"
    ]);
}
?>
