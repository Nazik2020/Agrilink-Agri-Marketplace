<?php
/**
 * Test Stripe Card Validation
 */

require_once 'services/StripePaymentService.php';

$stripeService = new StripePaymentService();

echo "Testing Stripe Card Validation\n";
echo "=============================\n\n";

// Test valid cards
$validCards = [
    '4242424242424242', // Visa test card
    '5555555555554444', // Mastercard test card
    '378282246310005'   // Amex test card
];

echo "Testing VALID cards:\n";
foreach ($validCards as $cardNumber) {
    $result = $stripeService->confirmPayment('test_payment_intent', $cardNumber);
    
    echo "Card: " . $cardNumber . " - ";
    echo ($result['success'] ? "SUCCESS" : "FAILED: " . $result['error']) . "\n";
}

echo "\nTesting DECLINE cards:\n";
// Test decline cards
$declineCards = [
    '4000000000000002', // Generic decline
    '4000000000009995', // Insufficient funds
    '4000000000009987'  // Lost card
];

foreach ($declineCards as $cardNumber) {
    $result = $stripeService->confirmPayment('test_payment_intent', $cardNumber);
    
    echo "Card: " . $cardNumber . " - ";
    echo ($result['success'] ? "SUCCESS" : "DECLINED: " . $result['error']) . "\n";
}

echo "\nTesting INVALID card:\n";
// Test invalid card
$result = $stripeService->confirmPayment('test_payment_intent', '1234567890123456');

echo "Card: 1234567890123456 - ";
echo ($result['success'] ? "SUCCESS" : "REJECTED: " . $result['error']) . "\n";

echo "\n=============================\n";
echo "Stripe Card Validation Test Complete!\n";
?>
