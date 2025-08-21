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
require_once 'CustomerDataManager.php';

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

    // Use CustomerDataManager to get billing data
    $customerManager = CustomerDataManager::createFromCustomerId($conn, $customerId);
    
    if (!$customerManager) {
        echo json_encode([
            "success" => false,
            "message" => "Customer not found"
        ]);
        exit;
    }

    $billingInfo = $customerManager->getBillingData();
    
    if ($billingInfo['hasCompleteProfile']) {
        // Complete profile - all billing fields auto-filled
        echo json_encode([
            "success" => true,
            "message" => "All billing information auto-filled from your profile!",
            "billingData" => $billingInfo['billingData'],
            "profileComplete" => true,
            "autoFilledFields" => array_keys(array_filter($billingInfo['billingData'], function($value) {
                return !empty($value);
            }))
        ]);
    } else {
        // Partial profile - some fields auto-filled, some need manual entry
        $autoFilledFields = array_keys(array_filter($billingInfo['billingData'], function($value) {
            return !empty($value);
        }));
        
        echo json_encode([
            "success" => true,
            "message" => count($autoFilledFields) > 0 ? 
                "Some billing info auto-filled. Please complete: " . implode(', ', $billingInfo['missingFields']) :
                "Please complete your billing information",
            "billingData" => $billingInfo['billingData'],
            "profileComplete" => false,
            "missingFields" => $billingInfo['missingFields'],
            "autoFilledFields" => $autoFilledFields,
            "suggestProfileUpdate" => count($billingInfo['missingFields']) > 0
        ]);
    }

} catch (Exception $e) {
    error_log("Error in billing data API: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Internal server error"
    ]);
}
?>
