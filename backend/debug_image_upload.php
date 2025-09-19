<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// Debug information
$debug_info = [
    "current_directory" => __DIR__,
    "upload_directory_exists" => is_dir("uploads/products"),
    "upload_directory_writable" => is_writable("uploads/products"),
    "full_upload_path" => __DIR__ . "/uploads/products/",
    "full_upload_path_exists" => is_dir(__DIR__ . "/uploads/products/"),
    "full_upload_path_writable" => is_writable(__DIR__ . "/uploads/products/"),
    "php_upload_max_filesize" => ini_get('upload_max_filesize'),
    "php_post_max_size" => ini_get('post_max_size'),
    "php_max_file_uploads" => ini_get('max_file_uploads')
];

// Test file upload if files are present
if (isset($_FILES['product_images'])) {
    $debug_info["files_received"] = true;
    $debug_info["files_count"] = count($_FILES['product_images']['name']);
    $debug_info["files_info"] = $_FILES['product_images'];
    
    $target_dir = "uploads/products/";
    $full_target_dir = __DIR__ . "/" . $target_dir;
    
    // Create directory if it doesn't exist
    if (!is_dir($full_target_dir)) {
        $debug_info["creating_directory"] = "Attempting to create: " . $full_target_dir;
        $created = mkdir($full_target_dir, 0777, true);
        $debug_info["directory_created"] = $created;
    }
    
    $image_paths = [];
    $upload_errors = [];
    
    $files = $_FILES['product_images'];
    $allowed_types = ['image/jpeg', 'image/jpg', 'image/png'];
    $max_file_size = 5 * 1024 * 1024; // 5MB
    
    for ($i = 0; $i < count($files['name']); $i++) {
        $file_debug = [
            "file_name" => $files['name'][$i],
            "file_type" => $files['type'][$i],
            "file_size" => $files['size'][$i],
            "file_error" => $files['error'][$i],
            "tmp_name" => $files['tmp_name'][$i],
            "tmp_name_exists" => file_exists($files['tmp_name'][$i])
        ];
        
        if ($files['error'][$i] === 0) {
            // Validate file type
            if (!in_array($files['type'][$i], $allowed_types)) {
                $upload_errors[] = "File " . $files['name'][$i] . " is not a valid image type.";
                $file_debug["validation_passed"] = false;
                $file_debug["validation_error"] = "Invalid file type";
            } else {
                $file_debug["validation_passed"] = true;
                
                // Validate file size
                if ($files['size'][$i] > $max_file_size) {
                    $upload_errors[] = "File " . $files['name'][$i] . " is too large.";
                    $file_debug["size_valid"] = false;
                } else {
                    $file_debug["size_valid"] = true;
                    
                    // Generate unique filename
                    $file_extension = pathinfo($files['name'][$i], PATHINFO_EXTENSION);
                    $filename = uniqid() . '_' . time() . '_test.' . $file_extension;
                    $target_file = $target_dir . $filename;
                    $full_target_file = $full_target_dir . $filename;
                    
                    $file_debug["target_file"] = $target_file;
                    $file_debug["full_target_file"] = $full_target_file;
                    
                    // Move uploaded file
                    $moved = move_uploaded_file($files['tmp_name'][$i], $full_target_file);
                    $file_debug["move_success"] = $moved;
                    
                    if ($moved) {
                        $image_paths[] = $target_file;
                        $file_debug["final_path"] = $target_file;
                        $file_debug["file_exists_after_move"] = file_exists($full_target_file);
                    } else {
                        $upload_errors[] = "Failed to move " . $files['name'][$i];
                        $file_debug["move_error"] = "move_uploaded_file failed";
                    }
                }
            }
        } else {
            $upload_errors[] = "Error uploading " . $files['name'][$i] . ": " . $files['error'][$i];
            $file_debug["upload_error"] = $files['error'][$i];
        }
        
        $debug_info["file_" . $i] = $file_debug;
    }
    
    $debug_info["uploaded_images"] = $image_paths;
    $debug_info["upload_errors"] = $upload_errors;
    $debug_info["image_paths_json"] = json_encode($image_paths);
    
} else {
    $debug_info["files_received"] = false;
    $debug_info["_FILES"] = $_FILES;
}

echo json_encode($debug_info, JSON_PRETTY_PRINT);
?> 