<?php
/**
 * Get Customer Order History - OOP Implementation
 * Clean, maintainable code using proper PHP OOP concepts
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
    $customerId = $input['customer_id'] ?? $_GET['customer_id'] ?? null;
    
    // Validate customer ID
    if (!$customerId) {
        APIResponse::error("Customer ID is required", null, 400);
    }
    
    if (!is_numeric($customerId) || $customerId <= 0) {
        APIResponse::error("Valid customer ID is required", null, 400);
    }
    
    // Create OrderHistory instance
    $orderHistory = new OrderHistory($conn);
    
    // Get customer orders
    $result = $orderHistory->getCustomerOrders($customerId);
    
    // Send response
    if ($result['success']) {
        APIResponse::success($result['data'], $result['message']);
    } else {
        APIResponse::error($result['message'], null, 500);
    }
    
} catch (Exception $e) {
    error_log("Get Customer Orders API Error: " . $e->getMessage());
    APIResponse::error("Server error occurred", $e->getMessage(), 500);
}
