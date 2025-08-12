<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once 'UserManager.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

try {
    $userManager = new UserManager();
    
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (!isset($input['user_id']) || !isset($input['user_type']) || !isset($input['message'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Missing required fields: user_id, user_type, message'
        ]);
        exit();
    }
    
    $userId = (int)$input['user_id'];
    $userType = $input['user_type'];
    $message = trim($input['message']);
    $subject = isset($input['subject']) ? trim($input['subject']) : 'System Message';
    
    // Validate parameters
    if ($userId <= 0) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid user ID'
        ]);
        exit();
    }
    
    if (!in_array($userType, ['customer', 'seller'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid user type. Must be "customer" or "seller"'
        ]);
        exit();
    }
    
    if (empty($message)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Message cannot be empty'
        ]);
        exit();
    }
    
    if (strlen($message) > 1000) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Message too long. Maximum 1000 characters allowed'
        ]);
        exit();
    }
    
    $result = $userManager->sendMessageToUser($userId, $userType, $message, $subject);
    
    if ($result['success']) {
        http_response_code(200);
    } else {
        http_response_code(400);
    }
    
    echo json_encode($result);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error: ' . $e->getMessage()
    ]);
}
?>
