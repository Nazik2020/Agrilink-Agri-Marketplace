<?php
// Simple test to add a new order and verify instant updates
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db.php';

$input = json_decode(file_get_contents('php://input'), true);
$customer_id = $input['customer_id'] ?? 4; // Default to customer 4

try {
    // Add a test order
    $sql = "INSERT INTO orders (
        customer_id, 
        seller_id, 
        product_id, 
        product_name, 
        quantity, 
        unit_price, 
        total_amount, 
        order_status, 
        payment_status, 
        payment_method,
        billing_name,
        billing_email,
        transaction_id,
        created_at
    ) VALUES (?, 1, 999, 'Test Product - Live Update', 1, 10.00, 10.00, 'pending', 'pending', 'test', 'Test Customer', 'test@example.com', ?, NOW())";
    
    $transaction_id = 'test_' . time();
    $stmt = $conn->prepare($sql);
    $stmt->execute([$customer_id, $transaction_id]);
    
    $order_id = $conn->lastInsertId();
    
    // Get updated count
    $count_sql = "SELECT COUNT(*) as count FROM orders WHERE customer_id = ?";
    $count_stmt = $conn->prepare($count_sql);
    $count_stmt->execute([$customer_id]);
    $count_result = $count_stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'message' => 'Test order added successfully',
        'order_id' => $order_id,
        'customer_id' => $customer_id,
        'new_order_count' => $count_result['count'],
        'timestamp' => date('Y-m-d H:i:s')
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
