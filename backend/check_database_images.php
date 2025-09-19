<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'db.php';

try {
    // Get all products with their image data
    $sql = "SELECT id, product_name, product_images, created_at FROM products ORDER BY created_at DESC LIMIT 10";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $result = [];
    foreach ($products as $product) {
        $product_info = [
            "product_id" => $product['id'],
            "product_name" => $product['product_name'],
            "created_at" => $product['created_at'],
            "raw_product_images" => $product['product_images'],
            "decoded_images" => null,
            "image_count" => 0,
            "file_check" => []
        ];
        
        if ($product['product_images']) {
            $decoded = json_decode($product['product_images'], true);
            $product_info["decoded_images"] = $decoded;
            $product_info["image_count"] = is_array($decoded) ? count($decoded) : 0;
            
            // Check if files actually exist on disk
            if (is_array($decoded)) {
                foreach ($decoded as $image_path) {
                    $full_path = __DIR__ . "/" . $image_path;
                    $product_info["file_check"][] = [
                        "database_path" => $image_path,
                        "full_path" => $full_path,
                        "file_exists" => file_exists($full_path),
                        "file_size" => file_exists($full_path) ? filesize($full_path) : 0,
                        "is_readable" => file_exists($full_path) ? is_readable($full_path) : false
                    ];
                }
            }
        }
        
        $result[] = $product_info;
    }
    
    // Also check what's in the uploads directory
    $uploads_dir = __DIR__ . "/uploads/products/";
    $uploaded_files = [];
    
    if (is_dir($uploads_dir)) {
        $files = scandir($uploads_dir);
        foreach ($files as $file) {
            if ($file !== '.' && $file !== '..') {
                $full_path = $uploads_dir . $file;
                $uploaded_files[] = [
                    "filename" => $file,
                    "full_path" => $full_path,
                    "file_size" => filesize($full_path),
                    "modified_time" => date('Y-m-d H:i:s', filemtime($full_path))
                ];
            }
        }
    }
    
    echo json_encode([
        "success" => true,
        "products_in_database" => $result,
        "files_in_uploads_directory" => $uploaded_files,
        "uploads_directory" => $uploads_dir,
        "uploads_directory_exists" => is_dir($uploads_dir),
        "uploads_directory_writable" => is_writable($uploads_dir)
    ], JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?> 