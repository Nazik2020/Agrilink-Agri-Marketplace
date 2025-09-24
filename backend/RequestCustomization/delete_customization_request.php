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
    if (!isset($input['request_id'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Request ID is required'
        ]);
        exit;
    }
    
    $customizationRequest = new CustomizationRequest($conn);
    
    // First, check if the request exists and get its details
    $requestResult = $customizationRequest->getRequestById($input['request_id']);
    
    if (!$requestResult['success']) {
        echo json_encode([
            'success' => false,
            'message' => 'Request not found'
        ]);
        exit;
    }
    
    // Soft delete: update status_of_request to 'deleted'
    $sql = "UPDATE customization_requests SET status_of_request = 'deleted' WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$input['request_id']]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Customization request marked as deleted'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>



