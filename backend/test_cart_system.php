<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

require 'db.php';
require 'Cart.php';

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Test database connection
    $testStmt = $conn->query("SELECT 1");
    
    // Check if cart tables exist
    $cartTableCheck = $conn->query("SHOW TABLES LIKE 'cart'");
    $cartItemsTableCheck = $conn->query("SHOW TABLES LIKE 'cart_items'");
    
    if ($cartTableCheck->rowCount() === 0 || $cartItemsTableCheck->rowCount() === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Cart tables do not exist",
            "debug" => "Please run the create_cart_tables.sql script first"
        ]);
        exit;
    }
    
    // Get table structures
    $cartStructure = $conn->query("DESCRIBE cart")->fetchAll(PDO::FETCH_ASSOC);
    $cartItemsStructure = $conn->query("DESCRIBE cart_items")->fetchAll(PDO::FETCH_ASSOC);
    
    // Get sample data for testing
    $customers = $conn->query("SELECT id, email FROM customers LIMIT 3")->fetchAll(PDO::FETCH_ASSOC);
    $products = $conn->query("SELECT id, product_name, price FROM products LIMIT 3")->fetchAll(PDO::FETCH_ASSOC);
    
    // Test cart operations if we have sample data
    $testResults = [];
    if (!empty($customers) && !empty($products)) {
        $cart = new Cart($conn);
        $testCustomerId = $customers[0]['id'];
        $testProductId = $products[0]['id'];
        
        // Test adding item to cart
        $addResult = $cart->addToCart($testCustomerId, $testProductId, 2);
        $testResults['add_to_cart'] = $addResult;
        
        // Test getting cart items
        $cartItems = $cart->getCartItems($testCustomerId);
        $testResults['get_cart_items'] = [
            'success' => true,
            'count' => count($cartItems),
            'items' => $cartItems
        ];
        
        // Test cart summary
        $summary = $cart->getCartSummary($testCustomerId);
        $testResults['cart_summary'] = $summary;
        
        // Test updating quantity
        $updateResult = $cart->updateQuantity($testCustomerId, $testProductId, 3);
        $testResults['update_quantity'] = $updateResult;
        
        // Test removing item
        $removeResult = $cart->removeFromCart($testCustomerId, $testProductId);
        $testResults['remove_from_cart'] = $removeResult;
    }
    
    echo json_encode([
        "success" => true,
        "message" => "Cart system test completed",
        "database_status" => "Connected",
        "tables_exist" => true,
        "table_structures" => [
            "cart" => $cartStructure,
            "cart_items" => $cartItemsStructure
        ],
        "sample_data" => [
            "customers" => $customers,
            "products" => $products
        ],
        "test_results" => $testResults,
        "debug" => "Cart system is ready for use"
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "General error",
        "error" => $e->getMessage()
    ]);
}
?> 