<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// Debug information
$debug_info = [
    "request_method" => $_SERVER['REQUEST_METHOD'] ?? 'unknown',
    "content_type" => $_SERVER['CONTENT_TYPE'] ?? 'unknown',
    "post_data" => $_POST,
    "files_data" => $_FILES,
    "upload_max_filesize" => ini_get('upload_max_filesize'),
    "post_max_size" => ini_get('post_max_size'),
    "max_file_uploads" => ini_get('max_file_uploads'),
    "file_uploads_enabled" => ini_get('file_uploads'),
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
    ]
];

// Test file upload if files are present
if (isset($_FILES['product_images']) && !empty($_FILES['product_images']['name'][0])) {
    $debug_info["upload_test"] = [];
    
    $files = $_FILES['product_images'];
    $target_dir = "uploads/products/";
    $full_target_dir = __DIR__ . "/" . $target_dir;
    
    for ($i = 0; $i < count($files['name']); $i++) {
        $file_info = [
            "name" => $files['name'][$i],
            "type" => $files['type'][$i],
            "size" => $files['size'][$i],
            "error" => $files['error'][$i],
            "tmp_name" => $files['tmp_name'][$i],
            "tmp_name_exists" => file_exists($files['tmp_name'][$i])
        ];
        
        if ($files['error'][$i] === 0) {
            // Generate unique filename
            $file_extension = pathinfo($files['name'][$i], PATHINFO_EXTENSION);
            $filename = uniqid() . '_' . time() . '_debug.' . $file_extension;
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
            }
        }
        
        $debug_info["upload_test"][] = $file_info;
    }
}

echo json_encode($debug_info, JSON_PRETTY_PRINT);
?> 