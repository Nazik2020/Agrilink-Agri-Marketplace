<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';
require 'Wishlist.php';

$data = json_decode(file_get_contents("php://input"), true);
$productId = $data['productId'] ?? null;
$customerId = $data['customerId'] ?? null;

if (!$productId) {
    echo json_encode(["success" => false, "message" => "Product ID is required"]);
    exit;
}

try {
    $wishlist = new Wishlist($conn);
    
    if ($customerId) {
        // Logged-in user
        $success = $wishlist->addToWishlist($customerId, $productId);
        if ($success) {
            echo json_encode([
                "success" => true, 
                "message" => "Product added to wishlist",
                "wishlistCount" => $wishlist->getWishlistCount($customerId)
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to add to wishlist"]);
        }
    } else {
        // Guest user - return success for frontend to handle localStorage
        echo json_encode([
            "success" => true, 
            "message" => "Product added to guest wishlist",
            "isGuest" => true
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false, 
        "message" => "Error: " . $e->getMessage()
    ]);
} 