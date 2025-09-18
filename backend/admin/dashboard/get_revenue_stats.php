<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
require_once '../../db.php';

try {
    $conn = getDbConnection();
    // Get total commission from withdrawals table
    $stmt = $conn->prepare("SELECT SUM(commission) AS total_commission FROM withdrawals WHERE status = 'completed'");
    $stmt->execute();
    $row = $stmt->fetch();
    $total_commission = $row && $row['total_commission'] !== null ? floatval($row['total_commission']) : 0.0;

    echo json_encode([
        'success' => true,
        'revenue' => $total_commission,
        'change' => '' // You can add month-over-month change logic here if needed
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
