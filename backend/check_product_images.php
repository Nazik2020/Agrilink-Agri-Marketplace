<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'db.php';

try {
    // Get all products with their image data
    $sql = "SELECT id, product_name, product_images FROM products ORDER BY created_at DESC LIMIT 10";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $result = [];
    foreach ($products as $product) {
        $image_data = [
            "product_id" => $product['id'],
            "product_name" => $product['product_name'],
            "raw_product_images" => $product['product_images'],
            "decoded_images" => null,
            "image_count" => 0
        ];
        
        if ($product['product_images']) {
            $decoded = json_decode($product['product_images'], true);
            $image_data["decoded_images"] = $decoded;
            $image_data["image_count"] = is_array($decoded) ? count($decoded) : 0;
            
            // Check if files actually exist
            if (is_array($decoded)) {
                $existing_files = [];
                foreach ($decoded as $image_path) {
                    $full_path = __DIR__ . "/" . $image_path;
                    $existing_files[] = [
                        "path" => $image_path,
                        "full_path" => $full_path,
                        "exists" => file_exists($full_path),
                        "size" => file_exists($full_path) ? filesize($full_path) : 0
                    ];
                }
                $image_data["file_check"] = $existing_files;
            }
        }
        
        $result[] = $image_data;
    }
    
    echo json_encode([
        "success" => true,
        "products" => $result,
        "total_products" => count($result)
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?> 