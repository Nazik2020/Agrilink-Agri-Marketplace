<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

$test_results = [];

// Step 1: Check basic environment
$test_results["step_1_environment"] = [
    "php_version" => PHP_VERSION,
    "current_directory" => __DIR__,
    "script_name" => $_SERVER['SCRIPT_NAME'] ?? 'unknown'
];

// Step 2: Check directory structure
$uploads_dir = __DIR__ . "/uploads/";
$products_dir = __DIR__ . "/uploads/products/";

$test_results["step_2_directories"] = [
    "uploads_dir" => $uploads_dir,
    "uploads_exists" => is_dir($uploads_dir),
    "products_dir" => $products_dir,
    "products_exists" => is_dir($products_dir),
    "products_writable" => is_writable($products_dir)
];

// Step 3: Check PHP upload settings
$test_results["step_3_php_settings"] = [
    "file_uploads" => ini_get('file_uploads'),
    "upload_max_filesize" => ini_get('upload_max_filesize'),
    "post_max_size" => ini_get('post_max_size'),
    "max_file_uploads" => ini_get('max_file_uploads'),
    "max_execution_time" => ini_get('max_execution_time')
];

// Step 4: Check if files were received
$test_results["step_4_files_received"] = [
    "files_sent" => isset($_FILES['product_images']),
    "files_count" => isset($_FILES['product_images']) ? count($_FILES['product_images']['name']) : 0,
    "post_data" => isset($_POST['seller_id']) ? "seller_id received" : "no seller_id",
    "files_structure" => isset($_FILES['product_images']) ? array_keys($_FILES['product_images']) : []
];

// Step 5: Process files if they exist
if (isset($_FILES['product_images']) && count($_FILES['product_images']['name']) > 0) {
    $files = $_FILES['product_images'];
    $image_paths = [];
    $upload_errors = [];
    
    for ($i = 0; $i < count($files['name']); $i++) {
        $file_info = [
            "name" => $files['name'][$i],
            "type" => $files['type'][$i],
            "size" => $files['size'][$i],
            "error" => $files['error'][$i],
            "tmp_name" => $files['tmp_name'][$i],
            "tmp_exists" => file_exists($files['tmp_name'][$i])
        ];
        
        if ($files['error'][$i] === 0) {
            // Generate filename
            $file_extension = pathinfo($files['name'][$i], PATHINFO_EXTENSION);
            $filename = uniqid() . '_' . time() . '_test.' . $file_extension;
            $target_file = "uploads/products/" . $filename;
            $full_target_file = __DIR__ . "/" . $target_file;
            
            $file_info["target_file"] = $target_file;
            $file_info["full_target_file"] = $full_target_file;
            
            // Try to move file
            $moved = move_uploaded_file($files['tmp_name'][$i], $full_target_file);
            $file_info["move_success"] = $moved;
            
            if ($moved) {
                $image_paths[] = $target_file;
                $file_info["final_path"] = $target_file;
                $file_info["file_exists_after_move"] = file_exists($full_target_file);
            } else {
                $upload_errors[] = "Failed to move file " . $files['name'][$i];
                $file_info["move_error"] = "move_uploaded_file returned false";
            }
        } else {
            $upload_errors[] = "File upload error: " . $files['error'][$i];
        }
        
        $test_results["step_5_file_" . $i] = $file_info;
    }
    
    $test_results["step_5_results"] = [
        "uploaded_images" => $image_paths,
        "upload_errors" => $upload_errors,
        "image_paths_json" => json_encode($image_paths)
    ];
}

// Step 6: Test database connection
try {
    require_once 'db.php';
    $test_results["step_6_database"] = [
        "connection_success" => true,
        "connection_info" => "Database connection successful"
    ];
} catch (Exception $e) {
    $test_results["step_6_database"] = [
        "connection_success" => false,
        "connection_error" => $e->getMessage()
    ];
}

echo json_encode($test_results, JSON_PRETTY_PRINT);
?> 