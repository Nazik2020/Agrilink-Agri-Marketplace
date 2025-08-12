<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    require_once '../db.php';
    $conn = getDbConnection();
    
    // Test database connection
    $stmt = $conn->query("SELECT COUNT(*) as total FROM customers");
    $customers = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $stmt = $conn->query("SELECT COUNT(*) as total FROM sellers");
    $sellers = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'message' => 'Backend connection successful',
        'data' => [
            'customers_count' => $customers['total'],
            'sellers_count' => $sellers['total'],
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Backend connection failed: ' . $e->getMessage()
    ]);
}
?> 