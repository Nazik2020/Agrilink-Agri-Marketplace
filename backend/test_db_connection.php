<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Content-Type: application/json");

require_once 'db.php';

try {
    $pdo = getDBConnection();
    if ($pdo) {
        echo json_encode([
            'success' => true,
            'message' => 'Database connected successfully',
            'pdo_type' => get_class($pdo)
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Database connection failed - PDO is null'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database connection error',
        'error' => $e->getMessage()
    ]);
}
?>
