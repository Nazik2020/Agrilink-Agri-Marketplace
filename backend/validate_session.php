<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db.php';
require 'services/UserStatusMiddleware.php';

// Get input data
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

if (!$data || !isset($data['user'])) {
    echo json_encode([
        "success" => false,
        "message" => "User data is required"
    ]);
    exit;
}

try {
    $userData = $data['user'];
    $middleware = new UserStatusMiddleware();
    
    // Validate user session and status
    $result = $middleware->validateUserSession($userData);
    
    if ($result['valid'] || $result['allowed']) {
        echo json_encode([
            "success" => true,
            "message" => "Session is valid",
            "status" => $result['status'] ?? 'active'
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => $result['message'],
            "error_type" => $result['error_type'] ?? 'session_invalid'
        ]);
    }
    
} catch (Exception $e) {
    error_log("Error in validate_session.php: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "System error occurred"
    ]);
}
?>





