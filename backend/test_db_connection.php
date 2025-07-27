<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';

try {
    // Test database connection
    $test = $conn->query("SELECT 1 as test")->fetch(PDO::FETCH_ASSOC);
    
    // Check if cart tables exist
    $cartTable = $conn->query("SHOW TABLES LIKE 'cart'")->rowCount();
    $cartItemsTable = $conn->query("SHOW TABLES LIKE 'cart_items'")->rowCount();
    
    // Get sample data
    $customers = $conn->query("SELECT COUNT(*) as count FROM customers")->fetch(PDO::FETCH_ASSOC);
    $products = $conn->query("SELECT COUNT(*) as count FROM products")->fetch(PDO::FETCH_ASSOC);
    $cartItems = $conn->query("SELECT COUNT(*) as count FROM cart_items")->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "message" => "Database connection successful",
        "database_status" => "Connected",
        "tables" => [
            "cart" => $cartTable > 0 ? "Exists" : "Missing",
            "cart_items" => $cartItemsTable > 0 ? "Exists" : "Missing"
        ],
        "data_counts" => [
            "customers" => $customers['count'],
            "products" => $products['count'],
            "cart_items" => $cartItems['count']
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed",
        "error" => $e->getMessage()
    ]);
}
?> 