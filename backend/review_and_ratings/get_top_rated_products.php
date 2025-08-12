<?php
// CORS headers for React frontend compatibility
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once '../db.php';

try {
    // Get top 6 products by average rating (only products with at least 1 review)
    $sql = "SELECT p.*, s.business_name as seller_name, 
                   ROUND(AVG(r.rating),2) as average_rating, COUNT(r.id) as review_count
            FROM products p
            LEFT JOIN sellers s ON p.seller_id = s.id
            LEFT JOIN reviews r ON p.id = r.product_id
            GROUP BY p.id
            HAVING review_count > 0
            ORDER BY average_rating DESC
            LIMIT 6";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Decode images and ensure average_rating is always a number
    foreach ($products as &$product) {
        $product['product_images'] = $product['product_images'] ? json_decode($product['product_images'], true) : [];
        // If average_rating is null, set to 0 (or you can skip, but for debug show 0)
        if (!isset($product['average_rating']) || $product['average_rating'] === null) {
            $product['average_rating'] = 0;
        } else {
            $product['average_rating'] = floatval($product['average_rating']);
        }
    }

    echo json_encode([
        "success" => true,
        "products" => $products,
        "debug" => $products
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
