<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

require_once '../db.php';
require_once 'CustomizationRequest.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode([
        'success' => false,
        'message' => 'Only GET method allowed'
    ]);
    exit;
}

$sellerId = $_GET['sellerId'] ?? null;

if (!$sellerId) {
    echo json_encode([
        'success' => false,
        'message' => 'Seller ID is required'
    ]);
    exit;
}

try {
    $customizationRequest = new CustomizationRequest($conn);
    $result = $customizationRequest->getSellerRequests($sellerId);
    
    echo json_encode($result);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>



