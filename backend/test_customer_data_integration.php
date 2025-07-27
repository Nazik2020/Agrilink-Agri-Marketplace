<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

require 'db.php';
require_once 'CustomerDataManager.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Get sample customer data for testing
    $customers = $conn->query("SELECT id, full_name, email, address, contactno, country FROM customers LIMIT 3")->fetchAll(PDO::FETCH_ASSOC);
    
    // Test CustomerDataManager with first customer
    $testCustomerId = $customers[0]['id'] ?? null;
    $customerManager = null;
    $testResults = [];
    
    if ($testCustomerId) {
        $customerManager = CustomerDataManager::createFromCustomerId($conn, $testCustomerId);
        
        if ($customerManager) {
            $testResults = [
                "customer_id" => $customerManager->getCustomerId(),
                "customer_name" => $customerManager->getCustomerName(),
                "customer_email" => $customerManager->getCustomerEmail(),
                "customer_address" => $customerManager->getCustomerAddress(),
                "customer_contact" => $customerManager->getCustomerContact(),
                "customer_country" => $customerManager->getCustomerCountry(),
                "billing_data" => $customerManager->getBillingData(),
                "validation" => $customerManager->validateCustomerData()
            ];
        }
    }
    
    echo json_encode([
        "success" => true,
        "message" => "Customer Data Integration Test",
        "test_data" => [
            "customers" => $customers,
            "test_results" => $testResults
        ],
        "integration_info" => [
            "oop_implementation" => [
                "customer_data_manager" => "CustomerDataManager class following OOP principles",
                "encapsulation" => "Private properties with public getter methods",
                "single_responsibility" => "Class handles only customer data operations",
                "static_factory" => "createFromCustomerId static method for object creation",
                "validation" => "validateCustomerData method for data completeness"
            ],
            "api_endpoint" => [
                "get_customer_billing_data.php" => "API endpoint using CustomerDataManager",
                "customer_validation" => "Validates customer data completeness",
                "billing_data_format" => "Returns formatted billing data for frontend",
                "error_handling" => "Proper error handling and validation"
            ],
            "frontend_integration" => [
                "auto_population" => "Billing fields auto-populated from customer profile",
                "read_only_fields" => "Billing fields are read-only and disabled",
                "visual_indicators" => "Icons and styling to show auto-filled data",
                "loading_states" => "Loading spinner while fetching customer data",
                "error_handling" => "Error messages for incomplete profiles"
            ],
            "user_experience" => [
                "seamless_integration" => "Customer data automatically loaded",
                "no_manual_entry" => "Users don't need to re-enter billing information",
                "clear_restrictions" => "Clear indication that fields cannot be changed",
                "profile_redirect" => "Guidance to update profile if needed"
            ],
            "security_features" => [
                "data_validation" => "Backend validation of customer data completeness",
                "read_only_restriction" => "Frontend prevents editing of billing fields",
                "customer_verification" => "Verifies customer ID and data integrity"
            ]
        ],
        "test_instructions" => [
            "1. Login as a customer with complete profile",
            "2. Add items to cart and proceed to checkout",
            "3. Verify billing information is auto-populated",
            "4. Verify fields are read-only and disabled",
            "5. Verify visual indicators (icons, styling)",
            "6. Test with incomplete profile to see validation",
            "7. Verify error messages and guidance"
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error in customer data integration test",
        "error" => $e->getMessage()
    ]);
}
?> 