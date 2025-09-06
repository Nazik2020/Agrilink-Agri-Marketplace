<?php
// Utility script to add status column to flags if missing
ini_set('display_errors', 1); ini_set('display_startup_errors', 1); error_reporting(E_ALL);
header('Content-Type: application/json');

require_once __DIR__ . '/../config/admin_config.php';

try {
    $adminConfig = new AdminConfig();
    $conn = $adminConfig->getConnection();
    $col = $conn->query("SHOW COLUMNS FROM flags LIKE 'status'");
    if ($col->rowCount() === 0) {
        $conn->exec("ALTER TABLE flags ADD COLUMN status ENUM('pending','resolved','dismissed') DEFAULT 'pending' AFTER reason");
        echo json_encode(['success' => true, 'changed' => true, 'message' => 'status column added']);
    } else {
        echo json_encode(['success' => true, 'changed' => false, 'message' => 'status column already exists']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
