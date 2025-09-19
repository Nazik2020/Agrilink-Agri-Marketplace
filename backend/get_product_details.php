<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'db.php';
require_once __DIR__ . '/services/OfferPricing.php';

try {
    // Get product ID from URL parameter
    $product_id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if (!$product_id) {
        echo json_encode([
            "success" => false,
            "message" => "Product ID is required"
        ]);
        exit;
    }
    
    // Get product details with seller information
    $sql = "SELECT p.*, s.business_name as seller_name, s.business_description as seller_description, 
                   s.contact_number as seller_contact, s.email as seller_email, s.address as seller_address,
                   s.business_logo as seller_logo
            FROM products p 
            LEFT JOIN sellers s ON p.seller_id = s.id 
            WHERE p.id = ?";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute([$product_id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$product) {
        echo json_encode([
            "success" => false,
            "message" => "Product not found"
        ]);
        exit;
    }
    
    // Helper to clean and format image paths
    function format_image_url($image_path) {
        // Remove any existing domain or leading slashes
        $image_path = preg_replace('#^https?://[^/]+/#', '', $image_path);
        $image_path = ltrim($image_path, '/');
        if (!str_starts_with($image_path, 'uploads/')) {
            $image_path = 'uploads/' . $image_path;
        }
        return "http://localhost/Agrilink-Agri-Marketplace/backend/get_image.php?path=" . urlencode($image_path);
    }

    // Process product images from JSON and convert to full URLs
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

    // Format seller logo
    $seller_logo_url = null;
    if ($product['seller_logo']) {
        $seller_logo_url = format_image_url($product['seller_logo']);
    }
    
    // Calculate average rating for this product
    $avgStmt = $conn->prepare("SELECT AVG(rating) as avg_rating FROM reviews WHERE product_id = ?");
    $avgStmt->execute([$product_id]);
    $avg = $avgStmt->fetch(PDO::FETCH_ASSOC);
    $average_rating = $avg && $avg['avg_rating'] !== null ? round($avg['avg_rating'], 2) : null;
    
    // Calculate effective pricing using OfferPricing
    $basePrice = floatval($product['price']);
    $specialOffer = $product['special_offer'];
    $pricing = OfferPricing::compute($basePrice, 1, $specialOffer);
    $effectivePrice = $pricing['unit_price'];
    
    // Format the response
    $response = [
        "success" => true,
        "product" => [
            "id" => $product['id'],
            "name" => $product['product_name'],
            "category" => $product['category'],
            "price" => $basePrice,
            "effective_price" => $effectivePrice,
            "description" => $product['product_description'],
            "special_offer" => $product['special_offer'],
            "images" => $product['product_images'],
            "created_at" => $product['created_at'],
            "average_rating" => $average_rating,
            "stock" => isset($product['stock']) ? intval($product['stock']) : 0,
            "seller" => [
                "id" => $product['seller_id'],
                "name" => $product['seller_name'],
                "description" => $product['seller_description'],
                "contact" => $product['seller_contact'],
                "email" => $product['seller_email'],
                "address" => $product['seller_address'],
                "logo" => $seller_logo_url
            ]
        ]
    ];

    echo json_encode($response);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>