<?php

// CORS headers for React frontend compatibility
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once 'db.php';
require_once __DIR__ . '/services/OfferPricing.php';

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
                WHERE p.category = ? AND p.status != 'deleted'
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
                WHERE p.status != 'deleted'
                GROUP BY p.id
                ORDER BY average_rating DESC, review_count DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
    }
    
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Helper to clean and format image paths
    function format_image_url($image_path) {
        $image_path = preg_replace('#^https?://[^/]+/#', '', $image_path);
        $image_path = ltrim($image_path, '/');
        if (!str_starts_with($image_path, 'uploads/')) {
            $image_path = 'uploads/' . $image_path;
        }
        return "http://localhost/Agrilink-Agri-Marketplace/backend/get_image.php?path=" . urlencode($image_path);
    }

    // Process product images from JSON and cast average_rating to float
    foreach ($products as &$product) {
        if ($product['product_images']) {
            $image_paths = json_decode($product['product_images'], true);
            if (is_array($image_paths)) {
                $product['product_images'] = array_map('format_image_url', $image_paths);
            } else {
                $product['product_images'] = [];
            }
        } else {
            $product['product_images'] = [];
        }
        
        // Calculate effective pricing using OfferPricing
        $basePrice = floatval($product['price']);
        $specialOffer = $product['special_offer'];
        $pricing = OfferPricing::compute($basePrice, 1, $specialOffer);
        $product['effective_price'] = $pricing['unit_price'];
        
        // Ensure correct data types
        $product['average_rating'] = isset($product['average_rating']) ? round((float)$product['average_rating'], 2) : null;
        $product['review_count'] = isset($product['review_count']) ? (int)$product['review_count'] : 0;
        $product['seller_id'] = isset($product['seller_id']) ? (int)$product['seller_id'] : null;
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
