<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';

try {
    // Create cart table if it doesn't exist
    $createCartTable = "
    CREATE TABLE IF NOT EXISTS cart (
        cart_id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        UNIQUE KEY unique_customer_cart (customer_id),
        INDEX idx_customer_id (customer_id),
        INDEX idx_created_at (created_at)
    )";
    
    $conn->exec($createCartTable);
    
    // Create cart_items table if it doesn't exist
    $createCartItemsTable = "
    CREATE TABLE IF NOT EXISTS cart_items (
        cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
        cart_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price DECIMAL(10,2) NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE KEY unique_cart_product (cart_id, product_id),
        INDEX idx_cart_id (cart_id),
        INDEX idx_product_id (product_id),
        INDEX idx_added_at (added_at),
        CHECK (quantity > 0),
        CHECK (price >= 0)
    )";
    
    $conn->exec($createCartItemsTable);
    
    // Verify tables exist
    $cartTable = $conn->query("SHOW TABLES LIKE 'cart'")->rowCount();
    $cartItemsTable = $conn->query("SHOW TABLES LIKE 'cart_items'")->rowCount();
    
    echo json_encode([
        "success" => true,
        "message" => "Cart tables ensured",
        "tables_created" => [
            "cart" => $cartTable > 0 ? "Yes" : "No",
            "cart_items" => $cartItemsTable > 0 ? "Yes" : "No"
        ],
        "status" => "Cart system ready"
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Error creating cart tables",
        "error" => $e->getMessage()
    ]);
}
?> 