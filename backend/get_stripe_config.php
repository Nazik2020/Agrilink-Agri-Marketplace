<?php
/**
 * Get Stripe Configuration - Returns publishable key for frontend
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    echo json_encode([
        'success' => true,
        'publishable_key' => 'pk_test_mock_key_for_development',
        'publishableKey' => 'pk_test_mock_key_for_development',
        'currency' => 'usd',
        'country' => 'US'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Configuration error: ' . $e->getMessage()
    ]);
}
?>
