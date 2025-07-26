<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';
require 'Wishlist.php';

echo "<h2>Wishlist Debug Information</h2>";

try {
    // Test database connection
    echo "<p>✅ Database connection successful</p>";
    
    // Check if wishlist table exists
    $stmt = $conn->prepare("SHOW TABLES LIKE 'wishlist'");
    $stmt->execute();
    $tableExists = $stmt->fetch();
    
    if ($tableExists) {
        echo "<p>✅ Wishlist table exists</p>";
        
        // Check table structure
        $stmt = $conn->prepare("DESCRIBE wishlist");
        $stmt->execute();
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "<h3>Wishlist Table Structure:</h3>";
        echo "<ul>";
        foreach ($columns as $column) {
            echo "<li>{$column['Field']} - {$column['Type']}</li>";
        }
        echo "</ul>";
        
        // Check if there are any wishlist entries
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM wishlist");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo "<p>Total wishlist entries: {$result['count']}</p>";
        
        // Show sample wishlist data
        $stmt = $conn->prepare("SELECT * FROM wishlist LIMIT 5");
        $stmt->execute();
        $wishlistItems = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "<h3>Sample Wishlist Data:</h3>";
        echo "<pre>";
        print_r($wishlistItems);
        echo "</pre>";
        
        // Check customers table
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM customers");
        $stmt->execute();
        $customerCount = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo "<p>Total customers: {$customerCount['count']}</p>";
        
        // Show sample customers
        $stmt = $conn->prepare("SELECT id, full_name, email FROM customers LIMIT 3");
        $stmt->execute();
        $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "<h3>Sample Customers:</h3>";
        echo "<pre>";
        print_r($customers);
        echo "</pre>";
        
        // Check products table
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM products");
        $stmt->execute();
        $productCount = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo "<p>Total products: {$productCount['count']}</p>";
        
        // Show sample products
        $stmt = $conn->prepare("SELECT id, product_name, price FROM products LIMIT 3");
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "<h3>Sample Products:</h3>";
        echo "<pre>";
        print_r($products);
        echo "</pre>";
        
        // Test the Wishlist class
        if (!empty($customers) && !empty($products)) {
            $testCustomerId = $customers[0]['id'];
            echo "<h3>Testing Wishlist Class with Customer ID: {$testCustomerId}</h3>";
            
            $wishlist = new Wishlist($conn);
            $customerWishlist = $wishlist->getCustomerWishlist($testCustomerId);
            
            echo "<p>Customer wishlist items:</p>";
            echo "<pre>";
            print_r($customerWishlist);
            echo "</pre>";
            
            $wishlistCount = $wishlist->getWishlistCount($testCustomerId);
            echo "<p>Wishlist count for customer {$testCustomerId}: {$wishlistCount}</p>";
        }
        
    } else {
        echo "<p>❌ Wishlist table does not exist</p>";
        echo "<p>Please create the wishlist table using the SQL provided in the guide.</p>";
    }
    
} catch (PDOException $e) {
    echo "<p>❌ Database error: " . $e->getMessage() . "</p>";
} catch (Exception $e) {
    echo "<p>❌ General error: " . $e->getMessage() . "</p>";
}
?> 