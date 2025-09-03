<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/admin_config.php';

try {
    $adminConfig = new AdminConfig();
    $conn = $adminConfig->getConnection();

    // Count active flags (not removed or dismissed)
    $activeSql = "SELECT COUNT(*) AS flag_count FROM flags WHERE status NOT IN ('removed', 'dismissed')";
    $activeStmt = $conn->prepare($activeSql);
    $activeStmt->execute();
    $activeRow = $activeStmt->fetch(PDO::FETCH_ASSOC);

    // Count total flags
    $totalSql = "SELECT COUNT(*) AS total_flag_count FROM flags";
    $totalStmt = $conn->prepare($totalSql);
    $totalStmt->execute();
    $totalRow = $totalStmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'flag_count' => $activeRow['flag_count'] ?? 0,
        'total_flag_count' => $totalRow['total_flag_count'] ?? 0
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to get flag count: ' . $e->getMessage()
    ]);
}
