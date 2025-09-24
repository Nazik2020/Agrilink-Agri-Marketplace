<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../db.php';
require_once 'CustomizedProduct.php';

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
    $requiredFields = [
        'request_id', 'product_name', 'product_description', 
        'customization_description', 'price', 'stock', 'category'
    ];
    
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            echo json_encode([
                'success' => false,
                'message' => "Missing required field: $field"
            ]);
            exit;
        }
    }
    
    $customizedProduct = new CustomizedProduct($conn);
    
    $result = $customizedProduct->createFromRequest(
        $input['request_id'],
        [
            'product_name' => $input['product_name'],
            'product_description' => $input['product_description'],
            'customization_description' => $input['customization_description'],
            'price' => $input['price'],
            'stock' => $input['stock'],
            'category' => $input['category'],
            'special_offer' => $input['special_offer'] ?? null
        ]
    );
    
    echo json_encode($result);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>



