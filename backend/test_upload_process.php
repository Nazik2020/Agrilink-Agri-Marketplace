<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// Test the entire upload process
$test_results = [
    "timestamp" => date('Y-m-d H:i:s'),
    "php_version" => PHP_VERSION,
    "server_info" => [
        "request_method" => $_SERVER['REQUEST_METHOD'] ?? 'unknown',
        "content_type" => $_SERVER['CONTENT_TYPE'] ?? 'unknown',
        "content_length" => $_SERVER['CONTENT_LENGTH'] ?? 'unknown'
    ],
    "php_settings" => [
        "upload_max_filesize" => ini_get('upload_max_filesize'),
        "post_max_size" => ini_get('post_max_size'),
        "max_file_uploads" => ini_get('max_file_uploads'),
        "file_uploads_enabled" => ini_get('file_uploads'),
        "max_execution_time" => ini_get('max_execution_time'),
        "memory_limit" => ini_get('memory_limit')
    ],
    "directory_info" => [
        "current_directory" => __DIR__,
        "uploads_directory" => __DIR__ . "/uploads/",
        "products_directory" => __DIR__ . "/uploads/products/",
        "directories_exist" => [
            "uploads" => is_dir(__DIR__ . "/uploads/"),
            "products" => is_dir(__DIR__ . "/uploads/products/")
        ],
        "directories_writable" => [
            "uploads" => is_writable(__DIR__ . "/uploads/"),
            "products" => is_writable(__DIR__ . "/uploads/products/")
        ],
        "permissions" => [
            "uploads" => substr(sprintf('%o', fileperms(__DIR__ . "/uploads/")), -4),
            "products" => is_dir(__DIR__ . "/uploads/products/") ? substr(sprintf('%o', fileperms(__DIR__ . "/uploads/products/")), -4) : "N/A"
        ]
    ],
    "post_data" => $_POST,
    "files_data" => $_FILES
];

// Test file upload if files are present
if (isset($_FILES['product_images']) && !empty($_FILES['product_images']['name'][0])) {
    $test_results["upload_test"] = [];
    
    $files = $_FILES['product_images'];
    $target_dir = "uploads/products/";
    $full_target_dir = __DIR__ . "/" . $target_dir;
    
    // Create directory if it doesn't exist
    if (!is_dir($full_target_dir)) {
        $mkdir_result = mkdir($full_target_dir, 0777, true);
        $test_results["directory_creation"] = [
            "attempted" => true,
            "success" => $mkdir_result,
            "directory" => $full_target_dir
        ];
    }
    
    for ($i = 0; $i < count($files['name']); $i++) {
        $file_info = [
            "index" => $i,
            "name" => $files['name'][$i],
            "type" => $files['type'][$i],
            "size" => $files['size'][$i],
            "error" => $files['error'][$i],
            "tmp_name" => $files['tmp_name'][$i],
            "tmp_name_exists" => file_exists($files['tmp_name'][$i]),
            "tmp_name_size" => file_exists($files['tmp_name'][$i]) ? filesize($files['tmp_name'][$i]) : 0
        ];
        
        if ($files['error'][$i] === 0) {
            // Generate unique filename
            $file_extension = pathinfo($files['name'][$i], PATHINFO_EXTENSION);
            $filename = uniqid() . '_' . time() . '_test.' . $file_extension;
            $target_file = $target_dir . $filename;
            $full_target_file = $full_target_dir . $filename;
            
            $file_info["target_file"] = $target_file;
            $file_info["full_target_file"] = $full_target_file;
            
            // Try to move the file
            $move_result = move_uploaded_file($files['tmp_name'][$i], $full_target_file);
            $file_info["move_result"] = $move_result;
            $file_info["file_exists_after_move"] = file_exists($full_target_file);
            
            if ($move_result) {
                $file_info["file_size_after_move"] = filesize($full_target_file);
                $file_info["file_permissions"] = substr(sprintf('%o', fileperms($full_target_file)), -4);
            } else {
                $file_info["move_error"] = error_get_last();
            }
        } else {
            $file_info["upload_error_description"] = [
                1 => "File exceeds upload_max_filesize",
                2 => "File exceeds MAX_FILE_SIZE",
                3 => "File was only partially uploaded",
                4 => "No file was uploaded",
                6 => "Missing a temporary folder",
                7 => "Failed to write file to disk",
                8 => "A PHP extension stopped the file upload"
            ][$files['error'][$i]] ?? "Unknown error";
        }
        
        $test_results["upload_test"][] = $file_info;
    }
}

// Check what's currently in the uploads directory
$uploads_dir = __DIR__ . "/uploads/products/";
$current_files = [];

if (is_dir($uploads_dir)) {
    $files = scandir($uploads_dir);
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..') {
            $full_path = $uploads_dir . $file;
            $current_files[] = [
                "filename" => $file,
                "full_path" => $full_path,
                "file_size" => filesize($full_path),
                "modified_time" => date('Y-m-d H:i:s', filemtime($full_path)),
                "permissions" => substr(sprintf('%o', fileperms($full_path)), -4)
            ];
        }
    }
}

$test_results["current_files_in_uploads"] = $current_files;

echo json_encode($test_results, JSON_PRETTY_PRINT);
?> 