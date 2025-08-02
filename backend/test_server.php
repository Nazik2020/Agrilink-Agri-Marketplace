<?php
// Enhanced test endpoint to verify PHP server is working
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Origin, Accept");
header("Access-Control-Max-Age: 86400");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Log the request
error_log("Test server endpoint accessed from: " . ($_SERVER['HTTP_ORIGIN'] ?? 'direct'));

echo json_encode([
    'success' => true,
    'message' => 'PHP Server is working perfectly!',
    'timestamp' => date('Y-m-d H:i:s'),
    'server_info' => [
        'php_version' => phpversion(),
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'PHP Built-in Server',
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? dirname(__FILE__),
        'server_name' => $_SERVER['SERVER_NAME'] ?? 'localhost',
        'server_port' => $_SERVER['SERVER_PORT'] ?? '8080'
    ],
    'request_info' => [
        'method' => $_SERVER['REQUEST_METHOD'],
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown',
        'origin' => $_SERVER['HTTP_ORIGIN'] ?? 'Direct access'
    ]
]);
?>
