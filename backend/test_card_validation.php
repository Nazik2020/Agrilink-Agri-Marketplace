<?php
/**
 * Quick test for card validation in payment confirmation
 */

require_once 'services/CheckoutService.php';
require_once 'db.php';

// Initialize CheckoutService
$database = new PDO("mysql:host=localhost;dbname=agrilink", "root", "");
$checkoutService = new CheckoutService($database);

echo "Testing Payment Confirmation with Card Validation\n";
echo "=================================================\n\n";

// Test with valid card
echo "1. Testing with VALID Stripe test card (4242424242424242):\n";
$result1 = $checkoutService->confirmPayment('test_intent_123', [1], '4242424242424242');
echo "Result: " . ($result1['success'] ? "SUCCESS" : "FAILED - " . $result1['error']) . "\n\n";

// Test with decline card
echo "2. Testing with DECLINE Stripe test card (4000000000000002):\n";
$result2 = $checkoutService->confirmPayment('test_intent_123', [1], '4000000000000002');
echo "Result: " . ($result2['success'] ? "SUCCESS" : "FAILED - " . $result2['error']) . "\n\n";

// Test with random invalid card
echo "3. Testing with RANDOM invalid card (1234567890123456):\n";
$result3 = $checkoutService->confirmPayment('test_intent_123', [1], '1234567890123456');
echo "Result: " . ($result3['success'] ? "SUCCESS" : "FAILED - " . $result3['error']) . "\n\n";

// Test with random card that user entered
echo "4. Testing with RANDOM card (5678901234567890):\n";
$result4 = $checkoutService->confirmPayment('test_intent_123', [1], '5678901234567890');
echo "Result: " . ($result4['success'] ? "SUCCESS" : "FAILED - " . $result4['error']) . "\n\n";

echo "=================================================\n";
echo "Card validation test complete!\n";
?>
