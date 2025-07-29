<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db.php';
require_once 'Product.php';

$product = new Product($conn);

// Initialize response data
$response = [
    "success" => false,
    "message" => "",
    "upload_errors" => [],
    "uploaded_images" => [],
    "debug_info" => []
];

try {
    // Get form data
    $seller_id = isset($_POST['seller_id']) ? trim($_POST['seller_id']) : null;
    $product_name = isset($_POST['product_name']) ? trim($_POST['product_name']) : null;
    $product_description = isset($_POST['product_description']) ? trim($_POST['product_description']) : null;
    $price = isset($_POST['price']) ? floatval($_POST['price']) : null;
    $special_offer = isset($_POST['special_offer']) ? trim($_POST['special_offer']) : null;
    $category = isset($_POST['category']) ? trim($_POST['category']) : null;

    // Validate required fields
    if (!$seller_id || !$product_name || !$product_description || !$price || !$category) {
        $response["message"] = "All required fields must be provided";
        echo json_encode($response);
        exit;
    }

    // Handle image uploads
    $image_paths = [];
    $upload_errors = [];
    $debug_info = [];

    // Check if files were uploaded
    if (isset($_FILES['product_images']) && !empty($_FILES['product_images']['name'][0])) {
        $files = $_FILES['product_images'];
        $target_dir = "uploads/products/";
        $full_target_dir = __DIR__ . "/" . $target_dir;
        
        // Create upload directory if it doesn't exist
        if (!is_dir($full_target_dir)) {
            if (!mkdir($full_target_dir, 0755, true)) {
                $upload_errors[] = "Failed to create upload directory: " . $full_target_dir;
                $debug_info["directory_creation_failed"] = true;
            } else {
                $debug_info["directory_created"] = $full_target_dir;
            }
        }

        // Check directory permissions
        if (!is_writable($full_target_dir)) {
            $upload_errors[] = "Upload directory is not writable: " . $full_target_dir;
            $debug_info["directory_not_writable"] = true;
        }

        // Process each uploaded file
        for ($i = 0; $i < count($files['name']); $i++) {
            $file_debug = [
                "index" => $i,
                "original_name" => $files['name'][$i],
                "file_type" => $files['type'][$i],
                "file_size" => $files['size'][$i],
                "upload_error" => $files['error'][$i],
                "temp_file" => $files['tmp_name'][$i]
            ];

            // Check for upload errors
            if ($files['error'][$i] !== 0) {
                $error_messages = [
                    1 => "File exceeds upload_max_filesize",
                    2 => "File exceeds MAX_FILE_SIZE",
                    3 => "File was only partially uploaded",
                    4 => "No file was uploaded",
                    6 => "Missing a temporary folder",
                    7 => "Failed to write file to disk",
                    8 => "A PHP extension stopped the file upload"
                ];
                $error_msg = $error_messages[$files['error'][$i]] ?? "Unknown upload error";
                $upload_errors[] = "File {$files['name'][$i]}: {$error_msg}";
                $file_debug["upload_error_description"] = $error_msg;
                $debug_info["file_errors"][] = $file_debug;
                continue;
            }

            // Validate file type
            $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!in_array($files['type'][$i], $allowed_types)) {
                $upload_errors[] = "File {$files['name'][$i]} is not a valid image type. Allowed: JPEG, JPG, PNG, GIF";
                $file_debug["invalid_type"] = true;
                $debug_info["file_errors"][] = $file_debug;
                continue;
            }

            // Validate file size (5MB limit)
            $max_file_size = 5 * 1024 * 1024;
            if ($files['size'][$i] > $max_file_size) {
                $upload_errors[] = "File {$files['name'][$i]} is too large. Maximum size is 5MB";
                $file_debug["too_large"] = true;
                $debug_info["file_errors"][] = $file_debug;
                continue;
            }

            // Check if temporary file exists and is readable
            if (!file_exists($files['tmp_name'][$i])) {
                $upload_errors[] = "Temporary file not found for {$files['name'][$i]}";
                $file_debug["temp_file_missing"] = true;
                $debug_info["file_errors"][] = $file_debug;
                continue;
            }

            if (!is_readable($files['tmp_name'][$i])) {
                $upload_errors[] = "Temporary file not readable for {$files['name'][$i]}";
                $file_debug["temp_file_not_readable"] = true;
                $debug_info["file_errors"][] = $file_debug;
                continue;
            }

            // Generate unique filename
            $file_extension = strtolower(pathinfo($files['name'][$i], PATHINFO_EXTENSION));
            $unique_id = uniqid('img_', true);
            $timestamp = time();
            $filename = "{$unique_id}_{$timestamp}_{$seller_id}.{$file_extension}";
            $target_file = $target_dir . $filename;
            $full_target_file = $full_target_dir . $filename;

            $file_debug["target_info"] = [
                "filename" => $filename,
                "target_file" => $target_file,
                "full_target_file" => $full_target_file
            ];

            // Move file from temporary to permanent location
            $move_result = move_uploaded_file($files['tmp_name'][$i], $full_target_file);
            $file_debug["move_result"] = $move_result;

            if ($move_result) {
                // Verify file was moved successfully
                if (file_exists($full_target_file) && filesize($full_target_file) > 0) {
                    $image_paths[] = $target_file;
                    $file_debug["success"] = true;
                    $file_debug["final_size"] = filesize($full_target_file);
                    $debug_info["successful_uploads"][] = $file_debug;
                } else {
                    $upload_errors[] = "File {$files['name'][$i]} was moved but verification failed";
                    $file_debug["verification_failed"] = true;
                    $debug_info["file_errors"][] = $file_debug;
                }
            } else {
                $upload_errors[] = "Failed to move file {$files['name'][$i]} to {$full_target_file}";
                $file_debug["move_failed"] = true;
                $file_debug["php_error"] = error_get_last();
                $debug_info["file_errors"][] = $file_debug;
            }
        }
    } else {
        $debug_info["no_files_uploaded"] = true;
    }

    // Convert image paths to JSON
    $image_paths_json = json_encode($image_paths);

    // Add product to database
    $success = $product->addProduct(
        $seller_id,
        $product_name,
        $product_description,
        $price,
        $special_offer,
        $image_paths_json,
        $category
    );

    if ($success) {
        $response["success"] = true;
        $response["message"] = "Product added successfully";
        $response["uploaded_images"] = $image_paths;
        $response["product_data"] = [
            "seller_id" => $seller_id,
            "product_name" => $product_name,
            "price" => $price,
            "category" => $category,
            "image_count" => count($image_paths)
        ];
    } else {
        $response["message"] = "Failed to add product to database";
        $response["database_error"] = $product->conn->errorInfo();
    }

} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
    $response["exception"] = $e->getTraceAsString();
}

// Add debug information
$response["upload_errors"] = $upload_errors;
$response["debug_info"] = array_merge($debug_info, [
    "php_settings" => [
        "upload_max_filesize" => ini_get('upload_max_filesize'),
        "post_max_size" => ini_get('post_max_size'),
        "max_file_uploads" => ini_get('max_file_uploads'),
        "file_uploads_enabled" => ini_get('file_uploads'),
        "temp_dir" => sys_get_temp_dir()
    ],
    "directory_info" => [
        "uploads_dir" => __DIR__ . "/uploads/",
        "products_dir" => __DIR__ . "/uploads/products/",
        "uploads_exists" => is_dir(__DIR__ . "/uploads/"),
        "products_exists" => is_dir(__DIR__ . "/uploads/products/"),
        "uploads_writable" => is_writable(__DIR__ . "/uploads/"),
        "products_writable" => is_dir(__DIR__ . "/uploads/products/") ? is_writable(__DIR__ . "/uploads/products/") : false
    ],
    "request_info" => [
        "method" => $_SERVER['REQUEST_METHOD'] ?? 'unknown',
        "content_type" => $_SERVER['CONTENT_TYPE'] ?? 'unknown',
        "has_files" => isset($_FILES['product_images']),
        "file_count" => isset($_FILES['product_images']) ? count($_FILES['product_images']['name']) : 0
    ]
]);

echo json_encode($response, JSON_PRETTY_PRINT);
?>
