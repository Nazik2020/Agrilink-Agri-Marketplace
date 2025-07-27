<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';

try {
    // Check if products table exists
    $tableExists = $conn->query("SHOW TABLES LIKE 'products'")->rowCount() > 0;
    
    if (!$tableExists) {
        echo json_encode([
            "success" => false,
            "error" => "Products table does not exist"
        ]);
        exit;
    }
    
    // Get table structure
    $columns = $conn->query("DESCRIBE products")->fetchAll(PDO::FETCH_ASSOC);
    
    // Get sample product data
    $sampleProduct = $conn->query("SELECT * FROM products LIMIT 1")->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "table_exists" => $tableExists,
        "columns" => $columns,
        "sample_product" => $sampleProduct,
        "column_names" => array_column($columns, 'Field')
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?> 