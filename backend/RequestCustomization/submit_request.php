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
    $requiredFields = ['customer_id', 'seller_id', 'product_id', 'customization_details', 'quantity'];
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            echo json_encode([
                'success' => false,
                'message' => "Missing required field: $field"
            ]);
            exit;
        }
    }
    
    // Check seller status (block if banned)
    $sellerId = (int)$input['seller_id'];
    $sellerStmt = $conn->prepare('SELECT status, business_name FROM sellers WHERE id = ? LIMIT 1');
    $sellerStmt->execute([$sellerId]);
    $seller = $sellerStmt->fetch(PDO::FETCH_ASSOC);
    if ($seller && isset($seller['status']) && $seller['status'] === 'banned') {
        echo json_encode([
            'success' => false,
            'message' => 'This seller is currently disabled. For further information, contact the seller.'
        ]);
        exit;
    }

    $customizationRequest = new CustomizationRequest($conn);
    $result = $customizationRequest->createRequest(
        $input['customer_id'],
        $input['seller_id'],
        $input['product_id'],
        $input['customization_details'],
        $input['quantity'],
        $input['notes'] ?? ''
    );

    // If customization request was created, send notification to seller
    if ($result['success'] && isset($result['request_id'])) {
        // Fetch product and customer details for notification
        $productName = '';
        $customerName = '';
        $productStmt = $conn->prepare('SELECT product_name FROM products WHERE id = ?');
        $productStmt->execute([$input['product_id']]);
        $productRow = $productStmt->fetch(PDO::FETCH_ASSOC);
        if ($productRow) $productName = $productRow['product_name'];
        $customerStmt = $conn->prepare('SELECT full_name FROM customers WHERE id = ?');
        $customerStmt->execute([$input['customer_id']]);
        $customerRow = $customerStmt->fetch(PDO::FETCH_ASSOC);
        if ($customerRow) $customerName = $customerRow['full_name'];

        $notificationData = [
            'seller_id' => $input['seller_id'],
            'title' => 'New Customization Request',
            'message' => 'Customer ' . $customerName . ' has requested customization for product "' . $productName . '".',
            'type' => 'customization_request',
            'related_id' => $result['request_id']
        ];
    $ch = curl_init('http://localhost/Agrilink-Agri-Marketplace/backend/notifications/add_notification.php');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($notificationData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        $notificationResponse = curl_exec($ch);
        curl_close($ch);
    }
    echo json_encode($result);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>



