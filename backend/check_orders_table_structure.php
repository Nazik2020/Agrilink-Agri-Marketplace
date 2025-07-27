<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';

try {
    // Check if orders table exists
    $tableExists = $conn->query("SHOW TABLES LIKE 'orders'")->rowCount() > 0;
    
    if (!$tableExists) {
        echo json_encode([
            "success" => false,
            "error" => "Orders table does not exist"
        ]);
        exit;
    }
    
    // Get table structure
    $columns = $conn->query("DESCRIBE orders")->fetchAll(PDO::FETCH_ASSOC);
    
    // Check for billing_city column
    $hasBillingCity = false;
    foreach ($columns as $column) {
        if ($column['Field'] === 'billing_city') {
            $hasBillingCity = true;
            break;
        }
    }
    
    echo json_encode([
        "success" => true,
        "table_exists" => $tableExists,
        "has_billing_city" => $hasBillingCity,
        "columns" => $columns,
        "issue" => $hasBillingCity ? "Orders table still has billing_city column - needs to be removed" : "Table structure looks correct"
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?> 