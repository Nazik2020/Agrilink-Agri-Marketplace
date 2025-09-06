<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../db.php';
require_once 'CustomizationRequest.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Only POST method allowed'
    ]);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (!isset($input['request_id']) || !isset($input['status'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Request ID and status are required'
        ]);
        exit;
    }
    
    // Validate status
    $validStatuses = ['pending', 'accepted', 'declined'];
    if (!in_array($input['status'], $validStatuses)) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid status. Must be one of: ' . implode(', ', $validStatuses)
        ]);
        exit;
    }
    
    $customizationRequest = new CustomizationRequest($conn);
    
    $result = $customizationRequest->updateStatus(
        $input['request_id'],
        $input['status']
    );
    
    echo json_encode($result);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
