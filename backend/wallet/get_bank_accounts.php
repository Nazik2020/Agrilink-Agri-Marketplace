<?php
require_once '../db.php';
require_once '../cors.php';

header('Content-Type: application/json');

$seller_id = $_GET['seller_id'] ?? null;
if (!$seller_id) {
    echo json_encode(['success' => false, 'error' => 'Missing seller_id.']);
    exit;
}

$db = getDbConnection();
    $stmt = $db->prepare('SELECT id, account_name, account_number, bank_name, branch_name FROM seller_bank_accounts WHERE seller_id = ?');
    $stmt->execute([$seller_id]);
    $accounts = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['success' => true, 'accounts' => $accounts]);
