<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

// Debug the temporary to permanent file movement process
$debug_info = [
    "timestamp" => date('Y-m-d H:i:s'),
    "php_temp_dir" => sys_get_temp_dir(),
    "upload_tmp_dir" => ini_get('upload_tmp_dir') ?: sys_get_temp_dir(),
    "current_directory" => __DIR__,
    "target_directory" => __DIR__ . "/uploads/products/"
];

// Check if files are being uploaded
if (isset($_FILES['product_images']) && !empty($_FILES['product_images']['name'][0])) {
    $debug_info["upload_process"] = [];
    
    $files = $_FILES['product_images'];
    $target_dir = "uploads/products/";
    $full_target_dir = __DIR__ . "/" . $target_dir;
    
    // Create directory if it doesn't exist
    if (!is_dir($full_target_dir)) {
        $mkdir_result = mkdir($full_target_dir, 0777, true);
        $debug_info["directory_creation"] = [
            "attempted" => true,
            "success" => $mkdir_result,
            "directory" => $full_target_dir
        ];
    }
    
    for ($i = 0; $i < count($files['name']); $i++) {
        $file_debug = [
            "file_index" => $i,
            "original_name" => $files['name'][$i],
            "file_type" => $files['type'][$i],
            "file_size" => $files['size'][$i],
            "upload_error" => $files['error'][$i],
            "temp_file_path" => $files['tmp_name'][$i],
            "temp_file_exists" => file_exists($files['tmp_name'][$i]),
            "temp_file_size" => file_exists($files['tmp_name'][$i]) ? filesize($files['tmp_name'][$i]) : 0,
            "temp_file_readable" => file_exists($files['tmp_name'][$i]) ? is_readable($files['tmp_name'][$i]) : false
        ];
        
        if ($files['error'][$i] === 0) {
            // Generate unique filename
            $file_extension = pathinfo($files['name'][$i], PATHINFO_EXTENSION);
            $filename = uniqid() . '_' . time() . '_debug.' . $file_extension;
            $target_file = $target_dir . $filename;
            $full_target_file = $full_target_dir . $filename;
            
            $file_debug["target_info"] = [
                "filename" => $filename,
                "relative_path" => $target_file,
                "full_path" => $full_target_file,
                "target_dir_exists" => is_dir($full_target_dir),
                "target_dir_writable" => is_writable($full_target_dir)
            ];
            
            // Check if target file already exists
            $file_debug["target_file_exists_before"] = file_exists($full_target_file);
            
            // Try to move the file from temp to permanent
            $move_result = move_uploaded_file($files['tmp_name'][$i], $full_target_file);
            $file_debug["move_result"] = $move_result;
            
            // Check results after move attempt
            $file_debug["after_move"] = [
                "temp_file_still_exists" => file_exists($files['tmp_name'][$i]),
                "target_file_exists" => file_exists($full_target_file),
                "target_file_size" => file_exists($full_target_file) ? filesize($full_target_file) : 0,
                "target_file_readable" => file_exists($full_target_file) ? is_readable($full_target_file) : false,
                "target_file_permissions" => file_exists($full_target_file) ? substr(sprintf('%o', fileperms($full_target_file)), -4) : "N/A"
            ];
            
            if (!$move_result) {
                $file_debug["move_error"] = error_get_last();
                $file_debug["php_errors"] = error_get_last();
            }
            
        } else {
            $file_debug["upload_error_description"] = [
                1 => "File exceeds upload_max_filesize",
                2 => "File exceeds MAX_FILE_SIZE", 
                3 => "File was only partially uploaded",
                4 => "No file was uploaded",
                6 => "Missing a temporary folder",
                7 => "Failed to write file to disk",
                8 => "A PHP extension stopped the file upload"
            ][$files['error'][$i]] ?? "Unknown error";
        }
        
        $debug_info["upload_process"][] = $file_debug;
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
                "permissions" => substr(sprintf('%o', fileperms($full_path)), -4),
                "is_readable" => is_readable($full_path)
            ];
        }
    }
}

$debug_info["current_files_in_uploads"] = $current_files;

echo json_encode($debug_info, JSON_PRETTY_PRINT);
?> 