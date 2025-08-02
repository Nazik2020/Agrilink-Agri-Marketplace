<?php
// Simple CORS test endpoint
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simple response
echo json_encode([
    "success" => true, 
    "message" => "CORS test successful",
    "method" => $_SERVER['REQUEST_METHOD'],
    "time" => date('Y-m-d H:i:s')
]);
?>
