<?php
// CORS headers for React frontend compatibility
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once '../db.php';
require_once __DIR__ . '/TopRatedProducts.php';

try {
    $conn = getDbConnection();
    $topRated = new TopRatedProducts($conn);
    $products = $topRated->getTopRated(6);
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
