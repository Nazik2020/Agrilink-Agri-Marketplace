<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'db.php';

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
    
    // Process product images from JSON and convert to full URLs
    if ($product['product_images']) {
        $image_paths = json_decode($product['product_images'], true);
        if (is_array($image_paths)) {
            // Convert each image path to a full URL
            $product['product_images'] = array_map(function($image_path) {
                // Fix: Use correct URL format without double backend
                return "http://localhost/backend/get_image.php?path=" . urlencode($image_path);
            }, $image_paths);
        } else {
            $product['product_images'] = [];
        }
    } else {
        $product['product_images'] = [];
    }
    
    // Process seller logo if exists
    if ($product['seller_logo']) {
        $product['seller_logo_url'] = "http://localhost/backend/get_image.php?path=" . urlencode($product['seller_logo']);
    }
    
    // Format the response
    $response = [
        "success" => true,
        "product" => [
            "id" => $product['id'],
            "name" => $product['product_name'],
            "category" => $product['category'],
            "price" => floatval($product['price']),
            "description" => $product['product_description'],
            "special_offer" => $product['special_offer'],
            "images" => $product['product_images'],
            "created_at" => $product['created_at'],
            "seller" => [
                "name" => $product['seller_name'],
                "description" => $product['seller_description'],
                "contact" => $product['seller_contact'],
                "email" => $product['seller_email'],
                "address" => $product['seller_address'],
                "logo" => $product['seller_logo_url'] ?? null
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
