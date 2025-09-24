<?php
/**
 * Get Order Details
 * Fetches comprehensive order information
 */

// Include required classes
require_once __DIR__ . '/APIResponse.php';
require_once __DIR__ . '/OrderHistory.php';
require_once __DIR__ . '/../db.php';

// Set CORS headers and handle preflight
APIResponse::setCORSHeaders();
APIResponse::handlePreflight();

// Log the request for debugging
APIResponse::logRequest();

try {
    // Validate database connection
    if (!$conn) {
        throw new Exception("Database connection failed");
    }
    
    // Get request data
    $input = json_decode(file_get_contents('php://input'), true);
    $orderId = $input['order_id'] ?? $_GET['order_id'] ?? null;
    $orderNumber = $input['order_number'] ?? $_GET['order_number'] ?? null;
    
    // Validate input
    if (!$orderId && !$orderNumber) {
        APIResponse::error("Order ID or Order Number is required", null, 400);
    }
    
    // Create OrderHistory instance
    $orderHistory = new OrderHistory($conn);
    
    // Get order details
    if ($orderId) {
        $result = $orderHistory->getOrderDetails($orderId, 'id');
    } else {
        $result = $orderHistory->getOrderDetails($orderNumber, 'number');
    }
    
    // Send response
    if ($result['success']) {
        APIResponse::success($result['data'], $result['message']);
    } else {
        APIResponse::error($result['message'], null, 404);
    }
    
} catch (Exception $e) {
    error_log("Get Order Details API Error: " . $e->getMessage());
    APIResponse::error("Server error occurred", $e->getMessage(), 500);
}
