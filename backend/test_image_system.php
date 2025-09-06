<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Simple test to check image system
$test_results = [
    "status" => "Image System Test",
    "timestamp" => date('Y-m-d H:i:s'),
    "php_version" => PHP_VERSION,
    "current_directory" => __DIR__,
    "uploads_directory" => __DIR__ . "/uploads/",
    "products_directory" => __DIR__ . "/uploads/products/",
    "directories_exist" => [
        "uploads" => is_dir(__DIR__ . "/uploads/"),
        "products" => is_dir(__DIR__ . "/uploads/products/"),
        "logos" => is_dir(__DIR__ . "/uploads/logos/"),
        "profiles" => is_dir(__DIR__ . "/uploads/profiles/")
    ],
    "directories_writable" => [
        "uploads" => is_writable(__DIR__ . "/uploads/"),
        "products" => is_writable(__DIR__ . "/uploads/products/"),
        "logos" => is_writable(__DIR__ . "/uploads/logos/"),
        "profiles" => is_writable(__DIR__ . "/uploads/profiles/")
    ]
];

// Test file creation
$test_file = __DIR__ . "/uploads/products/test_" . time() . ".txt";
$test_content = "Test file created at " . date('Y-m-d H:i:s');
$file_created = file_put_contents($test_file, $test_content);

$test_results["file_test"] = [
    "test_file_path" => $test_file,
    "file_created" => $file_created !== false,
    "file_size" => $file_created !== false ? $file_created : 0
];

// Clean up test file
if ($file_created !== false) {
    unlink($test_file);
    $test_results["file_test"]["cleaned_up"] = true;
}

echo json_encode($test_results, JSON_PRETTY_PRINT);
?> 