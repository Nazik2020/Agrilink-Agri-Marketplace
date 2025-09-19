<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Content-Type: application/json");
require_once '../db.php';

$customerId = $_GET['customerId'] ?? null;
if (!$customerId) {
    echo json_encode([
        'success' => false,
        'message' => 'Customer ID is required'
    ]);
    exit;
}
try {
    $sql = "SELECT * FROM customer_notifications WHERE customer_id = ? ORDER BY is_read ASC, id DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$customerId]);
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode([
        'success' => true,
        'notifications' => $notifications
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
