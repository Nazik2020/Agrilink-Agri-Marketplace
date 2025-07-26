<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';
require 'Wishlist.php';

echo "<h2>Manual Guest Wishlist Sync Test</h2>";

try {
    // Get a customer
    $stmt = $conn->prepare("SELECT id, email FROM customers LIMIT 1");
    $stmt->execute();
    $customer = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$customer) {
        echo "<p>❌ No customers found.</p>";
        exit;
    }
    
    echo "<p>✅ Using customer: {$customer['email']} (ID: {$customer['id']})</p>";
    
    // Get some products to simulate guest wishlist
    $stmt = $conn->prepare("SELECT id, product_name FROM products LIMIT 3");
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($products)) {
        echo "<p>❌ No products found.</p>";
        exit;
    }
    
    // Simulate guest wishlist (product IDs)
    $guestWishlist = array_column($products, 'id');
    echo "<p>✅ Simulating guest wishlist with product IDs: " . implode(', ', $guestWishlist) . "</p>";
    
    // Test the sync
    $wishlist = new Wishlist($conn);
    $results = $wishlist->syncGuestWishlist($customer['id'], $guestWishlist);
    
    echo "<h3>Sync Results:</h3>";
    echo "<pre>";
    print_r($results);
    echo "</pre>";
    
    // Check the customer's wishlist after sync
    $customerWishlist = $wishlist->getCustomerWishlist($customer['id']);
    $wishlistCount = $wishlist->getWishlistCount($customer['id']);
    
    echo "<h3>Customer's Wishlist After Sync:</h3>";
    echo "<p>Total items: {$wishlistCount}</p>";
    echo "<pre>";
    print_r($customerWishlist);
    echo "</pre>";
    
    echo "<h3>Test Instructions:</h3>";
    echo "<p>1. Login with customer email: <strong>{$customer['email']}</strong></p>";
    echo "<p>2. Go to the wishlist page</p>";
    echo "<p>3. You should see {$wishlistCount} items</p>";
    
} catch (PDOException $e) {
    echo "<p>❌ Database error: " . $e->getMessage() . "</p>";
} catch (Exception $e) {
    echo "<p>❌ General error: " . $e->getMessage() . "</p>";
}
?> 