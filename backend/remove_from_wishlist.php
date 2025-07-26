<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';
require 'Wishlist.php';

$data = json_decode(file_get_contents("php://input"), true);
$productId = $data['productId'] ?? null;
$customerId = $data['customerId'] ?? null;

if (!$productId || !$customerId) {
    echo json_encode(["success" => false, "message" => "Product ID and Customer ID are required"]);
    exit;
}

try {
    $wishlist = new Wishlist($conn);
    $success = $wishlist->removeFromWishlist($customerId, $productId);
    
    if ($success) {
        echo json_encode([
            "success" => true,
            "message" => "Product removed from wishlist",
            "wishlistCount" => $wishlist->getWishlistCount($customerId)
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to remove from wishlist"]);
    }
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
} 