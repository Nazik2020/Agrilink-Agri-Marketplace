<?php
/**
 * Checkout API Controller - Handles checkout requests from frontend
 * Professional API endpoints for Buy Now functionality
 */

// Enable error logging to file
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/debug.log');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';

    if ($action === 'create_payment_intent') {
        $orderId = rand(1000, 9999);
        
        echo json_encode([
            "success" => true,
            "order_id" => $orderId,
            "payment_intent" => [
                "id" => "pi_mock_" . $orderId,
                "amount" => $input['total_amount'] ?? 0
            ]
        ]);
        
    } elseif ($action === 'confirm_payment') {
        $cardNumber = str_replace(' ', '', $input['card_number'] ?? '');
        
        // Stripe test cards
        $validCards = [
            // Success cards (brand-agnostic mock)
            '4242424242424242' => 'success', // Visa
            '5555555555554444' => 'success', // Mastercard
            '378282246310005'  => 'success', // American Express

            // Decline scenario cards
            '4000000000000002' => 'Your card was declined.',
            '4000000000009995' => 'Your card has insufficient funds.',
            '4000000000009987' => 'Your card was reported lost or stolen.',
        ];
        
        if (isset($validCards[$cardNumber])) {
            if ($validCards[$cardNumber] === 'success') {
                echo json_encode([
                    "success" => true,
                    "message" => "Payment confirmed successfully"
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "error" => $validCards[$cardNumber]
                ]);
            }
        } else {
            echo json_encode([
                "success" => false,
                "error" => "Invalid card number. Use test cards: 4242 4242 4242 4242 (Visa), 5555 5555 5555 4444 (Mastercard), 3782 822463 10005 (AmEx)"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "error" => "Invalid action"
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Server error: " . $e->getMessage()
    ]);
}
?>
