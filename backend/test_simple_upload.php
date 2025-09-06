<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Simple test to check if upload system is working
$test_info = [
    "php_version" => PHP_VERSION,
    "current_directory" => __DIR__,
    "uploads_directory" => __DIR__ . "/uploads/",
    "products_directory" => __DIR__ . "/uploads/products/",
    "products_dir_exists" => is_dir(__DIR__ . "/uploads/products/"),
    "products_dir_writable" => is_writable(__DIR__ . "/uploads/products/"),
    "test_file_path" => __DIR__ . "/uploads/products/test.txt"
];

// Try to create a test file
$test_file = __DIR__ . "/uploads/products/test.txt";
$test_content = "Test file created at " . date('Y-m-d H:i:s');
$file_created = file_put_contents($test_file, $test_content);
$test_info["test_file_created"] = $file_created !== false;
$test_info["test_file_exists"] = file_exists($test_file);

// Check if we can read the file back
if ($file_created !== false) {
    $test_info["test_file_content"] = file_get_contents($test_file);
    // Clean up test file
    unlink($test_file);
    $test_info["test_file_cleaned_up"] = true;
}

// Check PHP upload settings
$test_info["php_settings"] = [
    "upload_max_filesize" => ini_get('upload_max_filesize'),
    "post_max_size" => ini_get('post_max_size'),
    "max_file_uploads" => ini_get('max_file_uploads'),
    "file_uploads" => ini_get('file_uploads')
];

echo json_encode($test_info, JSON_PRETTY_PRINT);
?> 