<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

require_once '../db.php';
require_once 'CustomizedProduct.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode([
        'success' => false,
        'message' => 'Only GET method allowed'
    ]);
    exit;
}

$customerId = $_GET['customerId'] ?? null;

if (!$customerId) {
    echo json_encode([
        'success' => false,
        'message' => 'Customer ID is required'
    ]);
    exit;
}

try {
    $customizedProduct = new CustomizedProduct($conn);
    $result = $customizedProduct->getCustomerProducts($customerId);
    
    echo json_encode($result);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>



