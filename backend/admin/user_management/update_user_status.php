<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

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

require_once 'UserManager.php';

try {
    $userManager = new UserManager();

    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['user_id']) || !isset($input['user_type']) || !isset($input['status'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Missing required fields: user_id, user_type, status'
        ]);
        exit();
    }

    $userId = (int)$input['user_id'];
    $userType = $input['user_type'];
    $status = $input['status'];

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

    if (!in_array($status, ['active', 'banned', 'pending'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid status. Must be "active", "banned", or "pending"'
        ]);
        exit();
    }

    $result = $userManager->updateUserStatus($userId, $userType, $status);

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
