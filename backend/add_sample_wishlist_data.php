<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';
require 'Wishlist.php';

echo "<h2>Adding Sample Wishlist Data</h2>";

try {
    // Get a customer
    $stmt = $conn->prepare("SELECT id, email FROM customers LIMIT 1");
    $stmt->execute();
    $customer = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$customer) {
        echo "<p>❌ No customers found. Please create a customer account first.</p>";
        exit;
    }
    
    echo "<p>✅ Found customer: {$customer['email']} (ID: {$customer['id']})</p>";
    
    // Get some products
    $stmt = $conn->prepare("SELECT id, product_name FROM products LIMIT 3");
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (empty($products)) {
        echo "<p>❌ No products found. Please add some products first.</p>";
        exit;
    }
    
    echo "<p>✅ Found " . count($products) . " products</p>";
    
    // Add products to wishlist
    $wishlist = new Wishlist($conn);
    $addedCount = 0;
    
    foreach ($products as $product) {
        echo "<p>Adding product: {$product['product_name']} (ID: {$product['id']})</p>";
        
        $success = $wishlist->addToWishlist($customer['id'], $product['id']);
        
        if ($success) {
            echo "<p>✅ Successfully added to wishlist</p>";
            $addedCount++;
        } else {
            echo "<p>❌ Failed to add to wishlist (might already exist)</p>";
        }
    }
    
    echo "<h3>Summary:</h3>";
    echo "<p>Added {$addedCount} products to wishlist for customer {$customer['email']}</p>";
    
    // Show the customer's wishlist
    $customerWishlist = $wishlist->getCustomerWishlist($customer['id']);
    echo "<h3>Customer's Wishlist:</h3>";
    echo "<pre>";
    print_r($customerWishlist);
    echo "</pre>";
    
    echo "<h3>Test Data Ready!</h3>";
    echo "<p>You can now test the wishlist functionality with customer email: <strong>{$customer['email']}</strong></p>";
    
} catch (PDOException $e) {
    echo "<p>❌ Database error: " . $e->getMessage() . "</p>";
} catch (Exception $e) {
    echo "<p>❌ General error: " . $e->getMessage() . "</p>";
}
?> 