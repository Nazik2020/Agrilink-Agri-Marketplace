<?php
// Test database connection and orders
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once 'db.php';

try {
    $pdo = getDbConnection();
    
    // Check if orders table exists and has data
    $stmt = $pdo->query("SHOW TABLES LIKE 'orders'");
    if ($stmt->rowCount() > 0) {
        // Count total orders
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM orders");
        $total = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Get orders for customer 4
        $stmt = $pdo->prepare("SELECT COUNT(*) as customer_orders FROM orders WHERE customer_id = 4");
        $stmt->execute();
        $customerOrders = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Get sample order data
        $stmt = $pdo->prepare("SELECT * FROM orders WHERE customer_id = 4 LIMIT 3");
        $stmt->execute();
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            'success' => true,
            'database_connected' => true,
            'orders_table_exists' => true,
            'total_orders' => $total['total'],
            'customer_4_orders' => $customerOrders['customer_orders'],
            'sample_orders' => $orders
        ], JSON_PRETTY_PRINT);
    } else {
        echo json_encode([
            'success' => false,
            'database_connected' => true,
            'orders_table_exists' => false,
            'message' => 'Orders table does not exist'
        ], JSON_PRETTY_PRINT);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'database_connected' => false,
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT);
}
?>
