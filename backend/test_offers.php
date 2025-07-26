<?php
require_once 'db.php';

echo "TESTING OFFERS CATEGORY:\n";
echo "======================\n\n";

try {
    // Check Offers products specifically
    echo "OFFERS PRODUCTS:\n";
    $sql = "SELECT id, product_name, category, price FROM products WHERE category = 'Offers'";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $offers_products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Offers products found: " . count($offers_products) . "\n";
    foreach ($offers_products as $product) {
        echo "  - ID: {$product['id']}, Name: {$product['product_name']}, Price: \${$product['price']}\n";
    }

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
