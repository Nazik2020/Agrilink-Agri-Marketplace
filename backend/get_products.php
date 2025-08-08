<?php

// CORS headers for React frontend compatibility
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once 'db.php';

try {
    // Get category filter if provided
    $category = isset($_GET['category']) ? $_GET['category'] : null;
    
    // Build SQL query with average_rating and review_count, sorted by average_rating DESC, review_count DESC
    if ($category && $category !== 'all') {
        $sql = "SELECT p.*, s.business_name as seller_name, 
                       COALESCE(AVG(r.rating), 0) AS average_rating, 
                       COUNT(r.id) AS review_count
                FROM products p 
                LEFT JOIN sellers s ON p.seller_id = s.id 
                LEFT JOIN reviews r ON p.id = r.product_id
                WHERE p.category = ?
                GROUP BY p.id
                ORDER BY average_rating DESC, review_count DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$category]);
    } else {
        $sql = "SELECT p.*, s.business_name as seller_name, 
                       COALESCE(AVG(r.rating), 0) AS average_rating, 
                       COUNT(r.id) AS review_count
                FROM products p 
                LEFT JOIN sellers s ON p.seller_id = s.id 
                LEFT JOIN reviews r ON p.id = r.product_id
                GROUP BY p.id
                ORDER BY average_rating DESC, review_count DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
    }
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    // Process product images from JSON and cast average_rating to float
    foreach ($products as &$product) {
        if ($product['product_images']) {
            $product['product_images'] = json_decode($product['product_images'], true);
        } else {
            $product['product_images'] = [];
        }
        $product['average_rating'] = isset($product['average_rating']) ? round((float)$product['average_rating'], 2) : null;
        $product['review_count'] = isset($product['review_count']) ? (int)$product['review_count'] : 0;
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
