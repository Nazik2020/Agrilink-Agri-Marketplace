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

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $requiredFields = ['customer_id', 'title', 'message', 'type', 'related_id'];
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            echo json_encode([
                'success' => false,
                'message' => "Missing required field: $field"
            ]);
            exit;
        }
    }
    $sql = "INSERT INTO customer_notifications (customer_id, title, message, type, related_id, is_read, status) VALUES (?, ?, ?, ?, ?, 0, 'new')";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        $input['customer_id'],
        $input['title'],
        $input['message'],
        $input['type'],
        $input['related_id']
    ]);
    echo json_encode([
        'success' => true,
        'message' => 'Notification added',
        'notification_id' => $conn->lastInsertId()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
