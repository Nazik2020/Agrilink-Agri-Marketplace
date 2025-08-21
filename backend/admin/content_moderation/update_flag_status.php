<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/admin_config.php';

try {
    $adminConfig = new AdminConfig();
    $conn = $adminConfig->getConnection();

    // $adminConfig->requireAdminAuth(); // enable when auth wired

    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        throw new Exception('Invalid JSON body');
    }

    $flagId = isset($input['flag_id']) ? (int)$input['flag_id'] : 0;
    $status = isset($input['status']) ? trim($input['status']) : '';

    $valid = ['pending','resolved','dismissed'];
    if ($flagId <= 0 || !in_array($status, $valid, true)) {
        throw new Exception('Invalid flag_id or status');
    }

    $stmt = $conn->prepare('UPDATE flags SET status = :status, updated_at = NOW() WHERE flag_id = :id');
    $stmt->bindValue(':status', $status, PDO::PARAM_STR);
    $stmt->bindValue(':id', $flagId, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode([
        'success' => true,
        'message' => 'Flag updated',
        'flag_id' => $flagId,
        'status' => $status
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to update flag: ' . $e->getMessage(),
        'trace' => (isset($_GET['debug']) ? $e->getTraceAsString() : null)
    ]);
}
