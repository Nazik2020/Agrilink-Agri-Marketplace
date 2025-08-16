<?php
require_once 'SellerWallet.php';
require_once '../db.php';
header('Content-Type: application/json');
require_once '../cors.php';

$seller_id = isset($_GET['seller_id']) ? intval($_GET['seller_id']) : 0;
if ($seller_id <= 0) {
    echo json_encode(['success' => false, 'error' => 'Invalid seller_id']);
    exit;
}

$wallet = new SellerWallet($seller_id);

// Check if seller has saved card details
$db = getDbConnection();
$stmt = $db->prepare('SELECT COUNT(*) as card_count FROM seller_bank_accounts WHERE seller_id = ?');
$stmt->execute([$seller_id]);
$cardResult = $stmt->fetch();
$hasCardDetails = $cardResult['card_count'] > 0;

$response = [
    'success' => true,
    'products_sold' => $wallet->getProductsSold(),
    'total_earnings' => $wallet->getTotalEarnings(),
    'available_balance' => $wallet->getAvailableBalance(),
    'transaction_history' => $wallet->getTransactionHistory(),
    'has_card_details' => $hasCardDetails
];
echo json_encode($response);
