<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';
require 'Wishlist.php';

echo "<h2>Simple Wishlist Test for Customer ID 4</h2>";

try {
    // Test with customer ID 4 (kamal@gmail.com)
    $customerId = 4;
    
    echo "<p>Testing wishlist for customer ID: {$customerId}</p>";
    
    // Check if customer exists
    $stmt = $conn->prepare("SELECT id, full_name, email FROM customers WHERE id = ?");
    $stmt->execute([$customerId]);
    $customer = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$customer) {
        echo "<p>❌ Customer with ID {$customerId} not found</p>";
        exit;
    }
    
    echo "<p>✅ Found customer: {$customer['full_name']} ({$customer['email']})</p>";
    
    // Test the wishlist class
    $wishlist = new Wishlist($conn);
    
    // Get wishlist items
    $wishlistItems = $wishlist->getCustomerWishlist($customerId);
    $wishlistCount = $wishlist->getWishlistCount($customerId);
    
    echo "<h3>Wishlist Results:</h3>";
    echo "<p>Wishlist count: {$wishlistCount}</p>";
    echo "<p>Wishlist items:</p>";
    echo "<pre>";
    print_r($wishlistItems);
    echo "</pre>";
    
    // Test the API endpoint directly
    echo "<h3>Testing API Endpoint:</h3>";
    
    // Simulate the API call
    $data = ['customerId' => $customerId];
    
    // This is what the frontend sends
    $requestData = json_encode($data);
    echo "<p>Request data: {$requestData}</p>";
    
    // Test the wishlist class method
    $result = $wishlist->getCustomerWishlist($customerId);
    
    $response = [
        'success' => true,
        'wishlist' => $result,
        'count' => count($result)
    ];
    
    echo "<p>API Response:</p>";
    echo "<pre>";
    print_r($response);
    echo "</pre>";
    
    echo "<h3>JSON Response (what frontend receives):</h3>";
    echo "<pre>";
    echo json_encode($response, JSON_PRETTY_PRINT);
    echo "</pre>";
    
} catch (PDOException $e) {
    echo "<p>❌ Database error: " . $e->getMessage() . "</p>";
} catch (Exception $e) {
    echo "<p>❌ General error: " . $e->getMessage() . "</p>";
}
?> 