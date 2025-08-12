<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';
require_once 'CustomerDataManager.php';

try {
    // Get customer ID from request
    $input = json_decode(file_get_contents('php://input'), true);
    $customerId = $input['customer_id'] ?? null;

    if (!$customerId) {
        echo json_encode([
            "success" => false,
            "message" => "Customer ID is required"
        ]);
        exit;
    }

    // Create CustomerDataManager instance
    $customerManager = CustomerDataManager::createFromCustomerId($conn, $customerId);

    if (!$customerManager) {
        echo json_encode([
            "success" => false,
            "message" => "Customer not found"
        ]);
        exit;
    }

    // Validate customer data completeness
    $validation = $customerManager->validateCustomerData();

    // Always return data, even if incomplete - let frontend handle validation
    $billingInfo = $customerManager->getBillingData();

    if (!$validation['isValid']) {
        // Return partial data with warning
        echo json_encode([
            "success" => false,
            "message" => $validation['message'],
            "missingFields" => $validation['missingFields'],
            "billingData" => $billingInfo['billingData'], // Extract the actual billing data
            "customerInfo" => [
                "id" => $customerManager->getCustomerId(),
                "name" => $customerManager->getCustomerName(),
                "email" => $customerManager->getCustomerEmail(),
                "address" => $customerManager->getCustomerAddress(),
                "contact" => $customerManager->getCustomerContact(),
                "country" => $customerManager->getCustomerCountry(),
                "postal_code" => $customerManager->getCustomerPostalCode()
            ]
        ]);
        exit;
    }

    // Get billing data
    $billingInfo = $customerManager->getBillingData();

    if ($billingInfo['hasCompleteProfile']) {
        echo json_encode([
            "success" => true,
            "message" => "All billing information auto-filled from your profile!",
            "billingData" => $billingInfo['billingData'],
            "customerInfo" => [
                "id" => $customerManager->getCustomerId(),
                "name" => $customerManager->getCustomerName(),
                "email" => $customerManager->getCustomerEmail(),
                "address" => $customerManager->getCustomerAddress(),
                "contact" => $customerManager->getCustomerContact(),
                "country" => $customerManager->getCustomerCountry(),
                "postal_code" => $customerManager->getCustomerPostalCode()
            ]
        ]);
    } else {
        echo json_encode([
            "success" => true,
            "message" => "Some billing info auto-filled. Please complete: " . implode(', ', $billingInfo['missingFields']),
            "billingData" => $billingInfo['billingData'],
            "customerInfo" => [
                "id" => $customerManager->getCustomerId(),
                "name" => $customerManager->getCustomerName(),
                "email" => $customerManager->getCustomerEmail(),
                "address" => $customerManager->getCustomerAddress(),
                "contact" => $customerManager->getCustomerContact(),
                "country" => $customerManager->getCustomerCountry(),
                "postal_code" => $customerManager->getCustomerPostalCode()
            ]
        ]);
    }

} catch (Exception $e) {
    error_log("Error in get_customer_billing_data.php: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Internal server error"
    ]);
}
?> 