<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';
require 'Wishlist.php';

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"), true);
$customerId = $data['customerId'] ?? null;

echo "<h2>Wishlist API Test</h2>";

if (!$customerId) {
    echo "<p>❌ Customer ID is required</p>";
    echo "<p>Please provide a customerId in the request body</p>";
    exit;
}

echo "<p>Testing with Customer ID: {$customerId}</p>";

try {
    // Check if customer exists
    $stmt = $conn->prepare("SELECT id, full_name, email FROM customers WHERE id = ?");
    $stmt->execute([$customerId]);
    $customer = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$customer) {
        echo "<p>❌ Customer with ID {$customerId} not found</p>";
        exit;
    }
    
    echo "<p>✅ Found customer: {$customer['full_name']} ({$customer['email']})</p>";
    
    // Test the Wishlist class
    $wishlist = new Wishlist($conn);
    
    // Get customer's wishlist
    $wishlistItems = $wishlist->getCustomerWishlist($customerId);
    $wishlistCount = $wishlist->getWishlistCount($customerId);
    
    echo "<h3>Wishlist Results:</h3>";
    echo "<p>Wishlist count: {$wishlistCount}</p>";
    echo "<p>Wishlist items:</p>";
    echo "<pre>";
    print_r($wishlistItems);
    echo "</pre>";
    
    // Test JSON response (like the real API)
    $jsonResponse = [
        "success" => true,
        "wishlist" => $wishlistItems,
        "count" => $wishlistCount,
        "customer" => $customer
    ];
    
    echo "<h3>JSON Response (what the frontend receives):</h3>";
    echo "<pre>";
    echo json_encode($jsonResponse, JSON_PRETTY_PRINT);
    echo "</pre>";
    
} catch (PDOException $e) {
    echo "<p>❌ Database error: " . $e->getMessage() . "</p>";
} catch (Exception $e) {
    echo "<p>❌ General error: " . $e->getMessage() . "</p>";
}
?> 