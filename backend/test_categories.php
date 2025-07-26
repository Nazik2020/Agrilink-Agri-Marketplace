<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'db.php';

try {
    echo "=== TESTING PRODUCTS DATABASE ===\n\n";
    
    // Test 1: Get all products and their categories
    echo "1. ALL PRODUCTS:\n";
    $sql = "SELECT id, product_name, category FROM products ORDER BY id";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $all_products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($all_products as $product) {
        echo "ID: {$product['id']}, Name: {$product['product_name']}, Category: '{$product['category']}'\n";
    }
    
    echo "\n2. CATEGORY COUNTS:\n";
    $sql = "SELECT category, COUNT(*) as count FROM products GROUP BY category";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($categories as $cat) {
        echo "Category: '{$cat['category']}' - Count: {$cat['count']}\n";
    }
    
    echo "\n3. TESTING 'Seeds' FILTER:\n";
    $sql = "SELECT id, product_name, category FROM products WHERE category = 'Seeds'";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $seeds_products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Seeds products found: " . count($seeds_products) . "\n";
    foreach ($seeds_products as $product) {
        echo "ID: {$product['id']}, Name: {$product['product_name']}\n";
    }
    
    echo "\n4. TESTING CASE-INSENSITIVE 'seeds' FILTER:\n";
    $sql = "SELECT id, product_name, category FROM products WHERE LOWER(category) = 'seeds'";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $seeds_lower = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Seeds products (case-insensitive): " . count($seeds_lower) . "\n";
    foreach ($seeds_lower as $product) {
        echo "ID: {$product['id']}, Name: {$product['product_name']}, Category: '{$product['category']}'\n";
    }

} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage();
}
?>
