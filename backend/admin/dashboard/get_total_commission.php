<?php
// backend/admin/dashboard/get_total_commission.php
header('Content-Type: application/json');
require_once '../../db.php';
require_once '../../cors.php';

try {
    $conn = getDbConnection();
    $stmt = $conn->prepare("SELECT COALESCE(SUM(commission), 0) AS total_commission FROM withdrawals WHERE status = 'completed'");
    $stmt->execute();
    $row = $stmt->fetch();
    $total_commission = $row ? floatval($row['total_commission']) : 0.0;
    echo json_encode(['success' => true, 'total_commission' => $total_commission]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
