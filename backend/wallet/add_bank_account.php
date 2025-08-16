<?php
require_once '../db.php';
require_once '../cors.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$seller_id = $data['seller_id'] ?? null;
$cardholder_name = $data['cardholder_name'] ?? null;
$card_number = $data['card_number'] ?? null;
$expiry = $data['expiry'] ?? null;
$cvc = $data['cvc'] ?? null;

if (!$seller_id || !$cardholder_name || !$card_number || !$expiry || !$cvc) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields.']);
    exit;
}

$db = getDbConnection();
$stmt = $db->prepare('INSERT INTO seller_bank_accounts (seller_id, cardholder_name, card_number, expiry, cvc) VALUES (?, ?, ?, ?, ?)');
$stmt->execute([$seller_id, $cardholder_name, $card_number, $expiry, $cvc]);

echo json_encode(['success' => true]);
