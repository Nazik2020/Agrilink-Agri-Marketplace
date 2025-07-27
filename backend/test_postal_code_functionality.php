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
    // Get sample customer data
    $customers = $conn->query("SELECT id, full_name, email, address, contactno, country, postal_code FROM customers LIMIT 3")->fetchAll(PDO::FETCH_ASSOC);
    
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
                "customer_postal_code" => $customerManager->getCustomerPostalCode(),
                "billing_data" => $customerManager->getBillingData(),
                "validation" => $customerManager->validateCustomerData()
            ];
        }
    }
    
    echo json_encode([
        "success" => true,
        "message" => "Postal Code Functionality Test",
        "test_data" => [
            "customers" => $customers,
            "test_results" => $testResults
        ],
        "postal_code_integration" => [
            "database" => [
                "column_added" => "postal_code column added to customers table",
                "data_type" => "VARCHAR(20)",
                "position" => "After country column"
            ],
            "backend_classes" => [
                "Customer.php" => [
                    "getByEmail" => "Updated to include postal_code in SELECT",
                    "updateProfile" => "Updated to include postal_code in UPDATE"
                ],
                "CustomerDataManager.php" => [
                    "loadCustomerData" => "Updated to include postal_code in SELECT",
                    "getCustomerPostalCode" => "New getter method for postal code",
                    "validateCustomerData" => "Updated to include postal_code in required fields",
                    "getBillingData" => "Updated to include postal_code in billing data"
                ]
            ],
            "api_endpoints" => [
                "update_customer_profile.php" => [
                    "postal_code_parameter" => "Added postal_code parameter handling",
                    "validation" => "Added postal code format validation",
                    "update_call" => "Updated to pass postal_code to updateProfile method"
                ],
                "get_customer_billing_data.php" => [
                    "response" => "Updated to include postal_code in customer info"
                ]
            ],
            "frontend_integration" => [
                "BuyNowModal.jsx" => [
                    "auto_population" => "Postal code will be auto-populated from customer profile",
                    "read_only" => "Postal code field will be read-only in billing form"
                ]
            ]
        ],
        "test_instructions" => [
            "1. First run execute_postal_code_update.php to add the column",
            "2. Update a customer profile with postal code",
            "3. Verify postal code is saved in database",
            "4. Test billing data retrieval includes postal code",
            "5. Verify BuyNowModal shows postal code in read-only field"
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error in postal code functionality test",
        "error" => $e->getMessage()
    ]);
}
?> 