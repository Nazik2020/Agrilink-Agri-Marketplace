<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

require_once '../db.php';
require_once 'CustomizedProduct.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode([
        'success' => false,
        'message' => 'Only GET method allowed'
    ]);
    exit;
}

$originalProductId = $_GET['originalProductId'] ?? null;
$customerId = $_GET['customerId'] ?? null;

if (!$originalProductId || !$customerId) {
    echo json_encode([
        'success' => false,
        'message' => 'Original Product ID and Customer ID are required'
    ]);
    exit;
}

try {
    $customizedProduct = new CustomizedProduct($conn);
    
    // Check if there's a customized version of this product for this customer
    $sql = "SELECT cp.*, s.business_name as seller_name, s.business_description as seller_description, 
                   s.contact_number as seller_contact, s.email as seller_email, s.address as seller_address,
                   s.business_logo as seller_logo
            FROM customized_products cp 
            LEFT JOIN sellers s ON cp.seller_id = s.id 
            WHERE cp.original_product_id = ? AND cp.customer_id = ? AND cp.status = 'active'";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute([$originalProductId, $customerId]);
    $customizedProductData = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$customizedProductData) {
        echo json_encode([
            'success' => false,
            'message' => 'No customized version found for this customer'
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
    if ($customizedProductData['product_images']) {
        $image_paths = json_decode($customizedProductData['product_images'], true);
        if (is_array($image_paths)) {
            $customizedProductData['product_images'] = array_map('format_image_url', $image_paths);
        } else {
            $customizedProductData['product_images'] = [];
        }
    } else {
        $customizedProductData['product_images'] = [];
    }

    // Format seller logo
    $seller_logo_url = null;
    if ($customizedProductData['seller_logo']) {
        $seller_logo_url = format_image_url($customizedProductData['seller_logo']);
    }
    
    // Calculate average rating for this product (using original product ID for reviews)
    $avgStmt = $conn->prepare("SELECT AVG(rating) as avg_rating FROM reviews WHERE product_id = ?");
    $avgStmt->execute([$originalProductId]);
    $avg = $avgStmt->fetch(PDO::FETCH_ASSOC);
    $average_rating = $avg && $avg['avg_rating'] !== null ? round($avg['avg_rating'], 2) : null;
    
    // Format the response
    $response = [
        'success' => true,
        'product' => [
            'id' => $customizedProductData['id'],
            'original_product_id' => $customizedProductData['original_product_id'],
            'name' => $customizedProductData['product_name'],
            'category' => $customizedProductData['category'],
            'price' => floatval($customizedProductData['price']),
            'description' => $customizedProductData['product_description'],
            'customization_description' => $customizedProductData['customization_description'],
            'special_offer' => $customizedProductData['special_offer'],
            'images' => $customizedProductData['product_images'],
            'created_at' => $customizedProductData['created_at'],
            'average_rating' => $average_rating,
            'stock' => isset($customizedProductData['stock']) ? intval($customizedProductData['stock']) : 0,
            'is_customized' => true,
            'seller' => [
                'id' => $customizedProductData['seller_id'],
                'name' => $customizedProductData['seller_name'],
                'description' => $customizedProductData['seller_description'],
                'contact' => $customizedProductData['seller_contact'],
                'email' => $customizedProductData['seller_email'],
                'address' => $customizedProductData['seller_address'],
                'logo' => $seller_logo_url
            ]
        ]
    ];

    echo json_encode($response);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>



