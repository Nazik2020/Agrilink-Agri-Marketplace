<?php
// Simple test file for top rated products API
header("Content-Type: application/json");

require_once 'db.php';
require_once __DIR__ . '/review_and_ratings/TopRatedProducts.php';

try {
    $conn = getDbConnection();
    $topRated = new TopRatedProducts($conn);
    $products = $topRated->getTopRated(6);
    
    echo json_encode([
        "success" => true,
        "count" => count($products),
        "products" => $products
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?> 