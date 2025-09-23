<?php
require_once '../db.php';
require_once '../cors.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$seller_id = $data['seller_id'] ?? null;
$account_name = $data['account_name'] ?? null;
$account_number = $data['account_number'] ?? null;
$bank_name = $data['bank_name'] ?? null;
$branch_name = $data['branch_name'] ?? null;

if (!$seller_id || !$account_name || !$account_number || !$bank_name || !$branch_name) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields. Account name, account number, bank name, and branch name are required.']);
    exit;
}

$db = getDbConnection();
$stmt = $db->prepare('INSERT INTO seller_bank_accounts (seller_id, account_name, account_number, bank_name, branch_name) VALUES (?, ?, ?, ?, ?)');
$stmt->execute([$seller_id, $account_name, $account_number, $bank_name, $branch_name]);

echo json_encode(['success' => true]);
