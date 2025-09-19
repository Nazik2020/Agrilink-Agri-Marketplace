<?php
// CORS headers for React frontend compatibility
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once '../db.php';
require_once __DIR__ . '/../services/OfferPricing.php';
require_once __DIR__ . '/TopRatedProducts.php';

try {
    $conn = getDbConnection();
    $topRated = new TopRatedProducts($conn);
    $products = $topRated->getTopRated(6);

    // Helper to clean and format image paths (reuse from get_products.php behavior)
    $format_image_url = function($image_path) {
        $image_path = preg_replace('#^https?://[^/]+/#', '', $image_path);
        $image_path = ltrim($image_path, '/');
        if (!str_starts_with($image_path, 'uploads/')) {
            $image_path = 'uploads/' . $image_path;
        }
        return "http://localhost/Agrilink-Agri-Marketplace/backend/get_image.php?path=" . urlencode($image_path);
    };

    // Ensure images are properly formatted and compute effective_price
    foreach ($products as &$product) {
        // Normalize images to URLs
        if (!empty($product['product_images'])) {
            if (is_array($product['product_images'])) {
                $product['product_images'] = array_map($format_image_url, $product['product_images']);
            } else {
                $decoded = json_decode($product['product_images'], true);
                $product['product_images'] = is_array($decoded)
                    ? array_map($format_image_url, $decoded)
                    : [];
            }
        } else {
            $product['product_images'] = [];
        }

        // Compute effective price with OfferPricing
        $basePrice = isset($product['price']) ? (float)$product['price'] : 0.0;
        $specialOffer = $product['special_offer'] ?? null;
        $pricing = OfferPricing::compute($basePrice, 1, $specialOffer);
        $product['effective_price'] = $pricing['unit_price'];
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
