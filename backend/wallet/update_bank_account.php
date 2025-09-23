<?php
require_once '../db.php';
require_once '../cors.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;
$seller_id = $data['seller_id'] ?? null;
$account_name = $data['account_name'] ?? null;
$account_number = $data['account_number'] ?? null;
$bank_name = $data['bank_name'] ?? null;
$branch_name = $data['branch_name'] ?? null;

if (!$id || !$seller_id || !$account_name || !$account_number || !$bank_name || !$branch_name) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields. All fields are required.']);
    exit;
}

try {
    $db = getDbConnection();
    
    // Verify the bank account belongs to the seller
    $stmt = $db->prepare('SELECT seller_id FROM seller_bank_accounts WHERE id = ?');
    $stmt->execute([$id]);
    $existing = $stmt->fetch();
    
    if (!$existing) {
        echo json_encode(['success' => false, 'error' => 'Bank account not found.']);
        exit;
    }
    
    if ($existing['seller_id'] != $seller_id) {
        echo json_encode(['success' => false, 'error' => 'Unauthorized access.']);
        exit;
    }
    
    // Update the bank account
    $stmt = $db->prepare('UPDATE seller_bank_accounts SET account_name = ?, account_number = ?, bank_name = ?, branch_name = ? WHERE id = ? AND seller_id = ?');
    $result = $stmt->execute([$account_name, $account_number, $bank_name, $branch_name, $id, $seller_id]);
    
    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Bank account updated successfully.']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to update bank account.']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
}
?>