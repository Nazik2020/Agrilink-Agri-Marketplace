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

    // If status update successful, send notification to customer
    if ($result['success']) {
        // Get request details for notification
        $requestDetails = $customizationRequest->getRequestById($input['request_id']);
        if ($requestDetails['success']) {
            $req = $requestDetails['request'];
            $customerId = $req['customer_id'];
            $productName = $req['product_name'];
            $sellerName = $req['seller_name'];
            if ($input['status'] === 'accepted') {
                $notificationData = [
                    'customer_id' => $customerId,
                    'title' => 'Customization Request Accepted',
                    'message' => 'Your customization request for product "' . $productName . '" has been accepted by seller ' . $sellerName . '. Please wait, we will let you know once the product is available.',
                    'type' => 'customization_request_accepted',
                    'related_id' => $input['request_id']
                ];
            } else {
                $notificationData = [
                    'customer_id' => $customerId,
                    'title' => 'Customization Request Declined',
                    'message' => 'Your customization request for product "' . $productName . '" has been declined by seller ' . $sellerName . '.',
                    'type' => 'customization_request_declined',
                    'related_id' => $input['request_id']
                ];
            }
            $ch = curl_init('http://localhost/Agrilink-Agri-Marketplace/backend/notifications/add_customer_notification.php');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($notificationData));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_exec($ch);
            curl_close($ch);
        }
    }
    echo json_encode($result);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>



