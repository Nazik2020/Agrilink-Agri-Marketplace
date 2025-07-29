<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

/**
 * Complete Image System Test
 * Tests all aspects of the image upload and serving system
 */

$test_results = [
    "timestamp" => date('Y-m-d H:i:s'),
    "test_name" => "Complete Image System Test",
    "overall_status" => "PENDING"
];

// Test 1: PHP Environment
$test_results["php_environment"] = [
    "php_version" => PHP_VERSION,
    "upload_max_filesize" => ini_get('upload_max_filesize'),
    "post_max_size" => ini_get('post_max_size'),
    "max_file_uploads" => ini_get('max_file_uploads'),
    "file_uploads_enabled" => ini_get('file_uploads'),
    "temp_dir" => sys_get_temp_dir(),
    "upload_tmp_dir" => ini_get('upload_tmp_dir') ?: sys_get_temp_dir()
];

// Test 2: Directory Structure
$uploads_dir = __DIR__ . "/uploads/";
$products_dir = __DIR__ . "/uploads/products/";
$logos_dir = __DIR__ . "/uploads/logos/";
$profiles_dir = __DIR__ . "/uploads/profiles/";

$test_results["directory_structure"] = [
    "uploads_dir" => $uploads_dir,
    "products_dir" => $products_dir,
    "logos_dir" => $logos_dir,
    "profiles_dir" => $profiles_dir,
    "directories_exist" => [
        "uploads" => is_dir($uploads_dir),
        "products" => is_dir($products_dir),
        "logos" => is_dir($logos_dir),
        "profiles" => is_dir($profiles_dir)
    ],
    "directories_writable" => [
        "uploads" => is_writable($uploads_dir),
        "products" => is_writable($products_dir),
        "logos" => is_writable($logos_dir),
        "profiles" => is_writable($profiles_dir)
    ],
    "permissions" => [
        "uploads" => is_dir($uploads_dir) ? substr(sprintf('%o', fileperms($uploads_dir)), -4) : "N/A",
        "products" => is_dir($products_dir) ? substr(sprintf('%o', fileperms($products_dir)), -4) : "N/A",
        "logos" => is_dir($logos_dir) ? substr(sprintf('%o', fileperms($logos_dir)), -4) : "N/A",
        "profiles" => is_dir($profiles_dir) ? substr(sprintf('%o', fileperms($profiles_dir)), -4) : "N/A"
    ]
];

// Test 3: Database Connection
try {
    require_once 'db.php';
    $test_results["database_connection"] = [
        "status" => "SUCCESS",
        "connection_info" => "Connected successfully"
    ];
} catch (Exception $e) {
    $test_results["database_connection"] = [
        "status" => "FAILED",
        "error" => $e->getMessage()
    ];
}

// Test 4: Product Table Structure
try {
    $sql = "DESCRIBE products";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $product_images_column = null;
    foreach ($columns as $column) {
        if ($column['Field'] === 'product_images') {
            $product_images_column = $column;
            break;
        }
    }
    
    $test_results["database_structure"] = [
        "status" => "SUCCESS",
        "product_images_column" => $product_images_column,
        "total_columns" => count($columns)
    ];
} catch (Exception $e) {
    $test_results["database_structure"] = [
        "status" => "FAILED",
        "error" => $e->getMessage()
    ];
}

// Test 5: Existing Products and Images
try {
    $sql = "SELECT id, product_name, product_images, created_at FROM products ORDER BY created_at DESC LIMIT 5";
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $products_with_images = [];
    foreach ($products as $product) {
        $product_info = [
            "id" => $product['id'],
            "name" => $product['product_name'],
            "created_at" => $product['created_at'],
            "has_images" => !empty($product['product_images']),
            "image_count" => 0,
            "file_check" => []
        ];
        
        if (!empty($product['product_images'])) {
            $images = json_decode($product['product_images'], true);
            $product_info["image_count"] = is_array($images) ? count($images) : 0;
            
            if (is_array($images)) {
                foreach ($images as $image_path) {
                    $full_path = __DIR__ . "/" . $image_path;
                    $product_info["file_check"][] = [
                        "path" => $image_path,
                        "full_path" => $full_path,
                        "exists" => file_exists($full_path),
                        "size" => file_exists($full_path) ? filesize($full_path) : 0,
                        "readable" => file_exists($full_path) ? is_readable($full_path) : false
                    ];
                }
            }
        }
        
        $products_with_images[] = $product_info;
    }
    
    $test_results["existing_products"] = [
        "status" => "SUCCESS",
        "total_products" => count($products),
        "products_with_images" => $products_with_images
    ];
} catch (Exception $e) {
    $test_results["existing_products"] = [
        "status" => "FAILED",
        "error" => $e->getMessage()
    ];
}

// Test 6: File Upload Test (if files are present)
if (isset($_FILES['test_image']) && !empty($_FILES['test_image']['name'])) {
    $test_results["upload_test"] = [];
    
    $files = $_FILES['test_image'];
    $target_dir = "uploads/products/";
    $full_target_dir = __DIR__ . "/" . $target_dir;
    
    for ($i = 0; $i < count($files['name']); $i++) {
        $upload_info = [
            "file_name" => $files['name'][$i],
            "file_type" => $files['type'][$i],
            "file_size" => $files['size'][$i],
            "upload_error" => $files['error'][$i],
            "temp_file" => $files['tmp_name'][$i],
            "temp_exists" => file_exists($files['tmp_name'][$i])
        ];
        
        if ($files['error'][$i] === 0) {
            // Generate test filename
            $extension = strtolower(pathinfo($files['name'][$i], PATHINFO_EXTENSION));
            $test_filename = "test_" . uniqid() . "_" . time() . "." . $extension;
            $target_file = $target_dir . $test_filename;
            $full_target_file = $full_target_dir . $test_filename;
            
            $upload_info["target_file"] = $target_file;
            $upload_info["full_target_file"] = $full_target_file;
            
            // Try to move the file
            $move_result = move_uploaded_file($files['tmp_name'][$i], $full_target_file);
            $upload_info["move_result"] = $move_result;
            $upload_info["file_exists_after_move"] = file_exists($full_target_file);
            
            if ($move_result) {
                $upload_info["final_size"] = filesize($full_target_file);
                $upload_info["test_url"] = "http://localhost/backend/get_image.php?path=" . urlencode($target_file);
            }
        }
        
        $test_results["upload_test"][] = $upload_info;
    }
}

// Test 7: Image Server Test
$test_results["image_server_test"] = [
    "get_image_php_exists" => file_exists(__DIR__ . "/get_image.php"),
    "get_image_php_readable" => file_exists(__DIR__ . "/get_image.php") ? is_readable(__DIR__ . "/get_image.php") : false
];

// Determine overall status
$failed_tests = 0;
$total_tests = 0;

foreach ($test_results as $test_name => $test_data) {
    if (is_array($test_data) && isset($test_data['status'])) {
        $total_tests++;
        if ($test_data['status'] === 'FAILED') {
            $failed_tests++;
        }
    }
}

$test_results["overall_status"] = $failed_tests === 0 ? "PASSED" : "FAILED";
$test_results["summary"] = [
    "total_tests" => $total_tests,
    "passed_tests" => $total_tests - $failed_tests,
    "failed_tests" => $failed_tests
];

echo json_encode($test_results, JSON_PRETTY_PRINT);
?> 