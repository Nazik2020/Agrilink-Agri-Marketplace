<?php
/**
 * Test Image Upload System
 * This file helps verify that the image upload system is working correctly
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

echo json_encode([
    "message" => "Image Upload System Test",
    "upload_directories" => [
        "products" => is_dir("uploads/products") ? "✅ Exists" : "❌ Missing",
        "logos" => is_dir("uploads/logos") ? "✅ Exists" : "❌ Missing", 
        "profiles" => is_dir("uploads/profiles") ? "✅ Exists" : "❌ Missing"
    ],
    "permissions" => [
        "products_writable" => is_writable("uploads/products") ? "✅ Writable" : "❌ Not Writable",
        "logos_writable" => is_writable("uploads/logos") ? "✅ Writable" : "❌ Not Writable",
        "profiles_writable" => is_writable("uploads/profiles") ? "✅ Writable" : "❌ Not Writable"
    ],
    "image_server" => [
        "get_image_php_exists" => file_exists("get_image.php") ? "✅ Exists" : "❌ Missing"
    ],
    "usage" => [
        "upload_url" => "POST to: http://localhost/Agrilink-Agri-Marketplace/backend/add_product.php",
        "image_url_format" => "http://localhost/Agrilink-Agri-Marketplace/backend/get_image.php?path=uploads/products/filename.jpg",
        "database_storage" => "Store relative paths like: uploads/products/abc123_timestamp_sellerid.jpg"
    ]
]);
?> 