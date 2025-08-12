<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';
require 'Wishlist.php';

$data = json_decode(file_get_contents("php://input"), true);
$customerId = $data['customerId'] ?? null;
$productIds = $data['productIds'] ?? [];

if (!$customerId) {
    echo json_encode(["success" => false, "message" => "Customer ID is required"]);
    exit;
}

if (empty($productIds)) {
    echo json_encode(["success" => true, "message" => "No items to sync"]);
    exit;
}

try {
    $wishlist = new Wishlist($conn);
    $results = $wishlist->syncGuestWishlist($customerId, $productIds);
    
    echo json_encode([
        "success" => true,
        "message" => "Wishlist synced successfully",
        "results" => $results,
        "summary" => [
            "added" => count($results['success']),
            "already_exists" => count($results['already_exists']),
            "failed" => count($results['failed'])
        ]
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
} 