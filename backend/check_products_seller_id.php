<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';

try {
    // Check products with NULL seller_id
    $nullSellerProducts = $conn->query("SELECT id, product_name, seller_id FROM products WHERE seller_id IS NULL")->fetchAll(PDO::FETCH_ASSOC);
    
    // Check products with valid seller_id
    $validSellerProducts = $conn->query("SELECT id, product_name, seller_id FROM products WHERE seller_id IS NOT NULL LIMIT 5")->fetchAll(PDO::FETCH_ASSOC);
    
    // Check if sellers table exists and has data
    $sellersExist = $conn->query("SHOW TABLES LIKE 'sellers'")->rowCount() > 0;
    $sellersCount = 0;
    if ($sellersExist) {
        $sellersCount = $conn->query("SELECT COUNT(*) as count FROM sellers")->fetch(PDO::FETCH_ASSOC)['count'];
    }
    
    echo json_encode([
        "success" => true,
        "issue_found" => !empty($nullSellerProducts),
        "null_seller_products" => $nullSellerProducts,
        "valid_seller_products" => $validSellerProducts,
        "sellers_table_exists" => $sellersExist,
        "sellers_count" => $sellersCount,
        "problem" => !empty($nullSellerProducts) ? "Products with NULL seller_id will cause order creation to fail" : "No issues found"
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?> 