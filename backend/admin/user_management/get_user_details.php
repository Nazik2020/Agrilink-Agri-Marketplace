<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once 'UserManager.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    $userManager = new UserManager();
    
    // Get query parameters
    $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
    $userType = isset($_GET['user_type']) ? $_GET['user_type'] : '';
    
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
    
    $result = $userManager->getUserDetails($userId, $userType);
    
    if (!$result['success']) {
        http_response_code(404);
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
