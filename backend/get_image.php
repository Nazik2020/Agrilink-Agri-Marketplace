<?php
/**
 * Image Server - Securely serves images from uploads directory
 * This prevents direct access to uploads folder and provides proper headers
 */

// Set proper headers for images
header("Access-Control-Allow-Origin: *");
header("Cache-Control: public, max-age=31536000"); // Cache for 1 year

// Get the image path from URL parameter
$image_path = isset($_GET['path']) ? $_GET['path'] : '';

// Security: Only allow images from uploads directory
if (empty($image_path) || strpos($image_path, 'uploads/') !== 0) {
    http_response_code(404);
    echo json_encode([
        "error" => "Invalid image path",
        "message" => "Image not found or access denied"
    ]);
    exit;
}

// Remove any directory traversal attempts
$image_path = str_replace(['../', '..\\', '..\\\\'], '', $image_path);

// Full path to the image
$full_path = __DIR__ . '/' . $image_path;

// Check if file exists and is readable
if (!file_exists($full_path)) {
    http_response_code(404);
    echo json_encode([
        "error" => "File not found",
        "path" => $image_path,
        "full_path" => $full_path
    ]);
    exit;
}

if (!is_readable($full_path)) {
    http_response_code(403);
    echo json_encode([
        "error" => "File not readable",
        "path" => $image_path
    ]);
    exit;
}

// Get file information
$file_info = pathinfo($full_path);
$extension = strtolower($file_info['extension']);

// Validate file extension
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
if (!in_array($extension, $allowed_extensions)) {
    http_response_code(400);
    echo json_encode([
        "error" => "Invalid file type",
        "extension" => $extension
    ]);
    exit;
}

// Set appropriate content type
$content_types = [
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'png' => 'image/png',
    'gif' => 'image/gif',
    'webp' => 'image/webp'
];

header("Content-Type: " . $content_types[$extension]);
header("Content-Length: " . filesize($full_path));

// Output the image
readfile($full_path);
exit;
?> 