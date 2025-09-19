<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Only POST method allowed'
    ]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$message = $input['message'] ?? '';
$type = $input['type'] ?? 'global_alert';


if (!$message) {
    echo json_encode([
        'success' => false,
        'message' => 'Message is required.'
    ]);
    exit;
}

try {
    $conn = getDbConnection();
    // Save alert in global_alerts table
    $alertStmt = $conn->prepare("INSERT INTO global_alerts (message, alert_type) VALUES (?, ?)");
    $alertResult = $alertStmt->execute([$message, $type]);
    $alertError = $alertStmt->errorInfo();

    // Fetch all customer IDs
    $customerStmt = $conn->query("SELECT id FROM customers");
    $customerIds = $customerStmt->fetchAll(PDO::FETCH_COLUMN);
    // Fetch all seller IDs
    $sellerStmt = $conn->query("SELECT id FROM sellers");
    $sellerIds = $sellerStmt->fetchAll(PDO::FETCH_COLUMN);
    $successCount = 0;
    $failCount = 0;
    // Send to all customers
    foreach ($customerIds as $customerId) {
        $stmt = $conn->prepare("INSERT INTO customer_notifications (customer_id, title, message, type, related_id, is_read, status) VALUES (?, ?, ?, ?, ?, 0, 'new')");
        $result = $stmt->execute([$customerId, $type, $message, $type, 0]);
        if ($result) $successCount++; else $failCount++;
    }
    // Send to all sellers
    foreach ($sellerIds as $sellerId) {
        $stmt = $conn->prepare("INSERT INTO seller_notifications (seller_id, title, message, type, related_id, is_read, status) VALUES (?, ?, ?, ?, ?, 0, 'new')");
        $result = $stmt->execute([$sellerId, $type, $message, $type, 0]);
        if ($result) $successCount++; else $failCount++;
    }
    echo json_encode([
        'success' => $alertResult,
        'message' => $alertResult ? 'Alert saved and sent to all users.' : 'Alert NOT saved.',
        'alert_error' => $alertError,
        'sent' => $successCount,
        'failed' => $failCount
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
