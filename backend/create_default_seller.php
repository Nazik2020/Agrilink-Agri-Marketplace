<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';

try {
    // Check if sellers table exists
    $sellersExist = $conn->query("SHOW TABLES LIKE 'sellers'")->rowCount() > 0;
    
    if (!$sellersExist) {
        // Create sellers table if it doesn't exist
        $createTable = "CREATE TABLE sellers (
            id INT(11) PRIMARY KEY AUTO_INCREMENT,
            business_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(20),
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";
        
        $conn->exec($createTable);
        echo json_encode([
            "success" => true,
            "action" => "Created sellers table"
        ]);
    }
    
    // Check if default seller (ID 1) exists
    $defaultSeller = $conn->query("SELECT id FROM sellers WHERE id = 1")->fetch(PDO::FETCH_ASSOC);
    
    if (!$defaultSeller) {
        // Create default seller
        $insertSeller = "INSERT INTO sellers (id, business_name, email, phone, address) 
                        VALUES (1, 'Default Seller', 'default@agrilink.com', '1234567890', 'Default Address')";
        
        $conn->exec($insertSeller);
        echo json_encode([
            "success" => true,
            "action" => "Created default seller with ID 1"
        ]);
    } else {
        echo json_encode([
            "success" => true,
            "action" => "Default seller already exists"
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
?> 