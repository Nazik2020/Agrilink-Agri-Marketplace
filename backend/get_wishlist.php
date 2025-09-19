<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';
// Wishlist.php includes OfferPricing and computes effective_price per item
require 'Wishlist.php';

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"), true);
$customerId = $data['customerId'] ?? null;

// Debug logging
error_log("get_wishlist.php: Received request with customerId: " . $customerId);

if (!$customerId) {
    error_log("get_wishlist.php: Error - Customer ID is required");
    echo json_encode(["success" => false, "message" => "Customer ID is required"]);
    exit;
}

try {
    error_log("get_wishlist.php: Creating Wishlist instance");
    $wishlist = new Wishlist($conn);
    
    error_log("get_wishlist.php: Getting wishlist for customer ID: " . $customerId);
    $wishlistItems = $wishlist->getCustomerWishlist($customerId);
    
    error_log("get_wishlist.php: Wishlist items retrieved: " . count($wishlistItems));
    
    echo json_encode([
        "success" => true, 
        "wishlist" => $wishlistItems, 
        "count" => count($wishlistItems),
        "debug" => "Successfully retrieved wishlist for customer ID: " . $customerId
    ]);
    
    error_log("get_wishlist.php: Response sent successfully");
    
} catch (Exception $e) {
    error_log("get_wishlist.php: Exception occurred: " . $e->getMessage());
    echo json_encode([
        "success" => false, 
        "message" => "Error: " . $e->getMessage(),
        "debug" => "Exception in get_wishlist.php"
    ]);
}
?> 