
<?php
// backend/notifications/get_global_alerts.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
require_once '../db.php';

// Fetch recent global alerts (limit to last 10)

$sql = "SELECT message, alert_type, created_at FROM global_alerts ORDER BY created_at DESC LIMIT 10";
$stmt = $conn->prepare($sql);
$stmt->execute();

$alerts = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $alerts[] = [
        'message' => $row['message'],
        'type' => $row['alert_type'],
        'time' => $row['created_at']
    ];
}

echo json_encode(['alerts' => $alerts]);
