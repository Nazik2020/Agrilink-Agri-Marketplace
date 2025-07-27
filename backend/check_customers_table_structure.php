<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';

try {
    // Get table structure
    $stmt = $conn->query("DESCRIBE customers");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Check if postal_code column exists
    $hasPostalCode = false;
    $postalCodeColumn = null;
    
    foreach ($columns as $column) {
        if ($column['Field'] === 'postal_code') {
            $hasPostalCode = true;
            $postalCodeColumn = $column;
            break;
        }
    }
    
    // Get sample customer data
    $sampleCustomers = $conn->query("SELECT id, full_name, email, address, contactno, country FROM customers LIMIT 3")->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "table_structure" => [
            "columns" => $columns,
            "has_postal_code" => $hasPostalCode,
            "postal_code_column" => $postalCodeColumn
        ],
        "sample_data" => $sampleCustomers,
        "recommendations" => [
            "if_no_postal_code" => "Add postal_code column to customers table",
            "if_has_postal_code" => "Update Customer.php and update_customer_profile.php to handle postal_code"
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error checking table structure",
        "error" => $e->getMessage()
    ]);
}
?> 