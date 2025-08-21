<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'db.php';

try {
    // Get category filter if provided
    $category = isset($_GET['category']) ? $_GET['category'] : null;
    
    // Build SQL query
    if ($category && $category !== 'all') {
        $sql = "SELECT p.*, s.business_name as seller_name 
                FROM products p 
                LEFT JOIN sellers s ON p.seller_id = s.id 
                WHERE p.category = ? 
                ORDER BY p.created_at DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$category]);
    } else {
        $sql = "SELECT p.*, s.business_name as seller_name 
                FROM products p 
                LEFT JOIN sellers s ON p.seller_id = s.id 
                ORDER BY p.created_at DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
    }
    
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Process product images from JSON
    foreach ($products as &$product) {
        if ($product['product_images']) {
            $product['product_images'] = json_decode($product['product_images'], true);
        } else {
            $product['product_images'] = [];
        }
    }
    
    echo json_encode([
        "success" => true,
        "products" => $products
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
