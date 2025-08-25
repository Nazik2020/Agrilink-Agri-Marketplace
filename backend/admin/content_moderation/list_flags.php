<?php
// Enable verbose error reporting for debugging (remove/disable in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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
    if (!extension_loaded('pdo_mysql')) {
        throw new Exception('pdo_mysql extension not loaded. Install/enable it in your PHP environment.');
    }
    $adminConfig = new AdminConfig();
    $conn = $adminConfig->getConnection();

    // Optional: enforce admin auth (uncomment when frontend sends token)
    // $adminConfig->requireAdminAuth();

    $limit = isset($_GET['limit']) ? max(1, (int)$_GET['limit']) : 100;

    // Detect if status column exists
    $hasStatus = false;
    try {
        $colCheck = $conn->query("SHOW COLUMNS FROM flags LIKE 'status'");
        $hasStatus = $colCheck && $colCheck->rowCount() > 0;
    } catch (Exception $ignored) {}

    $statusSelect = $hasStatus ? 'f.status' : "'pending' AS status";

    $sql = "SELECT f.flag_id, f.category, f.reason, $statusSelect, f.created_at,
             c.full_name AS reporter_name, c.email AS reporter_email,
             s.business_name AS seller_name, s.email AS seller_email,
             p.product_name, p.product_description,
             f.product_id,
             f.dismissed_at, f.removed_at
         FROM flags f
         LEFT JOIN customers c ON f.flagged_by_customer_id = c.id
         LEFT JOIN sellers s ON f.seller_id = s.id
         LEFT JOIN products p ON f.product_id = p.id
         ORDER BY f.created_at DESC
         LIMIT :limit";

    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'count' => count($rows),
        'flags' => $rows
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to load flags: ' . $e->getMessage(),
        'trace' => (isset($_GET['debug']) ? $e->getTraceAsString() : null)
    ]);
}
