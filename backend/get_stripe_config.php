<?php
/**
 * Get Stripe Configuration - Returns publishable key for frontend
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once __DIR__ . '/config/stripe.php';

try {
    echo json_encode([
        'success' => true,
        'publishable_key' => StripeConfig::getPublishableKey(),
        'test_mode' => StripeConfig::isTestMode()
    ]);
    
} catch (Exception $e) {
    error_log("Stripe config API error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Configuration error'
    ]);
}
?>
