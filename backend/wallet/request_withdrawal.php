<?php
require_once '../db.php';
require_once '../cors.php';
header('Content-Type: application/json');

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
$seller_id = isset($data['seller_id']) ? intval($data['seller_id']) : 0;
$amount = isset($data['amount']) ? floatval($data['amount']) : 0.0;
$bank_account = isset($data['bank_account']) ? trim($data['bank_account']) : '';

if ($seller_id <= 0 || $amount <= 0 || empty($bank_account)) {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit;
}

try {
    $conn = getDbConnection();
    
    // Check if seller has saved card details
    $stmt = $conn->prepare("SELECT COUNT(*) as card_count FROM seller_bank_accounts WHERE seller_id = ?");
    $stmt->execute([$seller_id]);
    $cardResult = $stmt->fetch();
    
    if ($cardResult['card_count'] == 0) {
        echo json_encode(['success' => false, 'error' => 'You must save your card details before withdrawing. Please click "Save Card Details" first.']);
        exit;
    }
    
    // Get available balance
    $stmt = $conn->prepare("SELECT SUM(total_amount) - IFNULL((SELECT SUM(amount) FROM withdrawals WHERE seller_id = ? AND status = 'completed'), 0) AS available_balance FROM orders WHERE seller_id = ? AND payment_status = 'completed'");
    $stmt->execute([$seller_id, $seller_id]);
    $row = $stmt->fetch();
    $available_balance = $row ? floatval($row['available_balance']) : 0.0;

    // Calculate commission (2.5%)
    $commission = round($amount * 0.025, 2);
    $final_amount = $amount - $commission;

    if ($final_amount <= 0 || $final_amount > $available_balance) {
        echo json_encode(['success' => false, 'error' => 'Insufficient balance or invalid amount after commission']);
        exit;
    }

    // Insert withdrawal with commission
    $stmt = $conn->prepare("INSERT INTO withdrawals (seller_id, amount, commission, withdrawal_date, status) VALUES (?, ?, ?, NOW(), 'completed')");
    $stmt->execute([$seller_id, $final_amount, $commission]);

    echo json_encode(['success' => true, 'message' => 'Withdrawal completed', 'commission' => $commission, 'withdrawn_amount' => $final_amount]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
