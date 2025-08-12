<?php
/**
 * Checkout API Controller - Handles checkout requests from frontend
 * Professional API endpoints for Buy Now functionality
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/services/CheckoutService.php';

try {
    $checkoutService = new CheckoutService($conn);
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Get JSON input
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            echo json_encode([
                'success' => false,
                'error' => 'Invalid JSON data'
            ]);
            exit;
        }
        
        // Determine the action
        $action = $input['action'] ?? '';
        
        switch ($action) {
            case 'create_payment_intent':
                handleCreatePaymentIntent($checkoutService, $input);
                break;
                
            case 'confirm_payment':
                handleConfirmPayment($checkoutService, $input);
                break;
                
            case 'get_publishable_key':
                handleGetPublishableKey($checkoutService);
                break;
                
            default:
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid action'
                ]);
        }
        
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Method not allowed'
        ]);
    }
    
} catch (Exception $e) {
    error_log("Checkout API error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Internal server error'
    ]);
}

/**
 * Handle payment intent creation
 */
function handleCreatePaymentIntent($checkoutService, $input) {
    // Check if this is a cart checkout or single product checkout
    $isCartCheckout = isset($input['cart_items']) && is_array($input['cart_items']) && !empty($input['cart_items']);
    
    if ($isCartCheckout) {
        // Cart checkout validation
        $required = ['cart_items', 'customer_id', 'billing_name', 'billing_email', 
                    'billing_address', 'billing_postal_code', 'billing_country'];
        
        foreach ($required as $field) {
            if (empty($input[$field])) {
                echo json_encode([
                    'success' => false,
                    'error' => "Missing required field: {$field}"
                ]);
                return;
            }
        }
        
        // Validate cart items structure
        foreach ($input['cart_items'] as $item) {
            if (empty($item['product_id']) || empty($item['quantity']) || !isset($item['price'])) {
                echo json_encode([
                    'success' => false,
                    'error' => "Invalid cart item structure"
                ]);
                return;
            }
        }
    } else {
        // Single product checkout validation
        $required = ['product_id', 'quantity', 'customer_id', 'billing_name', 'billing_email', 
                    'billing_address', 'billing_postal_code', 'billing_country'];
        
        foreach ($required as $field) {
            if (empty($input[$field])) {
                echo json_encode([
                    'success' => false,
                    'error' => "Missing required field: {$field}"
                ]);
                return;
            }
        }
    }
    
    // Process checkout
    $result = $checkoutService->processCheckout($input);
    echo json_encode($result);
}

/**
 * Handle payment confirmation
 */
function handleConfirmPayment($checkoutService, $input) {
    if (empty($input['payment_intent_id']) || empty($input['order_id'])) {
        echo json_encode([
            'success' => false,
            'error' => 'Missing payment_intent_id or order_id'
        ]);
        return;
    }
    
    $result = $checkoutService->confirmPayment($input['payment_intent_id'], $input['order_id']);
    echo json_encode($result);
}

/**
 * Handle getting publishable key
 */
function handleGetPublishableKey($checkoutService) {
    echo json_encode([
        'success' => true,
        'publishable_key' => $checkoutService->getPublishableKey()
    ]);
}
?>
