<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
require_once 'db.php'; // Make sure $conn is your PDO connection
require_once __DIR__ . '/services/OfferPricing.php';

$sellerId = $_GET['sellerId'] ?? null;

if (empty($sellerId)) {
    echo json_encode([
        "success" => false,
        "message" => "Seller ID is required"
    ]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT id, product_name, price, stock, product_images, special_offer FROM products WHERE seller_id = ? AND status = 'active'");
    $stmt->execute([$sellerId]);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Process product images
    foreach ($products as &$product) {
        // Compute effective price (unit price for quantity 1) using OfferPricing
        $basePrice = isset($product['price']) ? (float)$product['price'] : 0.0;
        $specialOffer = $product['special_offer'] ?? null;
        $pricing = OfferPricing::compute($basePrice, 1, $specialOffer);
        $product['effective_price'] = $pricing['unit_price'];

        $images = json_decode($product['product_images'], true);
        
        if (is_array($images) && count($images) > 0) {
            // Clean the image path and construct proper URL
            $imagePath = $images[0];
            // Remove any existing localhost URL if present
            $imagePath = str_replace("http://localhost/Agrilink-Agri-Marketplace/", "", $imagePath);
            // Ensure the path starts correctly
            if (!str_starts_with($imagePath, 'uploads/')) {
                $imagePath = 'uploads/' . ltrim($imagePath, '/');
            }
$product['image_url'] = "http://localhost/Agrilink-Agri-Marketplace/backend/get_image.php?path=" . urlencode($imagePath);            $product['all_images'] = array_map(function($img) {
                $imgPath = str_replace("http://localhost/Agrilink-Agri-Marketplace/", "", $img);
                if (!str_starts_with($imgPath, 'uploads/')) {
                    $imgPath = 'uploads/' . ltrim($imgPath, '/');
                }
                return "http://localhost/Agrilink-Agri-Marketplace/" . $imgPath;
            }, $images);
        } else {
            $product['image_url'] = "http://localhost/Agrilink-Agri-Marketplace/uploads/placeholder.svg";
            $product['all_images'] = [];
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