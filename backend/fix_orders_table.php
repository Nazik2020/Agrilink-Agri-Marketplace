<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';

try {
    // Check if billing_city column exists
    $columns = $conn->query("DESCRIBE orders")->fetchAll(PDO::FETCH_ASSOC);
    $hasBillingCity = false;
    
    foreach ($columns as $column) {
        if ($column['Field'] === 'billing_city') {
            $hasBillingCity = true;
            break;
        }
    }
    
    if ($hasBillingCity) {
        // Remove billing_city column
        $conn->exec("ALTER TABLE orders DROP COLUMN billing_city");
        
        echo json_encode([
            "success" => true,
            "message" => "billing_city column removed from orders table",
            "action" => "DROPPED billing_city column"
        ]);
    } else {
        echo json_encode([
            "success" => true,
            "message" => "billing_city column does not exist - table is already correct",
            "action" => "No action needed"
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?> 