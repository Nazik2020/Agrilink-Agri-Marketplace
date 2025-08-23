<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
require_once 'db.php';

$sellerId = $_GET['sellerId'] ?? null;

if (empty($sellerId)) {
    echo json_encode([
        "success" => false,
        "message" => "Seller ID is required"
    ]);
    exit;
}

try {
    // Get all pending or processing orders for this seller
    $stmt = $conn->prepare("
        SELECT 
            o.id,
            o.customer_id,
            o.product_id,
            o.product_name,
            o.quantity,
            o.unit_price,
            o.total_amount,
            o.order_status,
            o.payment_status,
            o.billing_name,
            o.billing_email,
            o.billing_address,
            o.billing_postal_code,
            o.billing_country,
            o.created_at,
            p.product_images
        FROM orders o
        JOIN products p ON o.product_id = p.id
        WHERE o.seller_id = ? AND o.order_status IN ('pending', 'processing')
        ORDER BY o.created_at DESC
    ");
    
    
    $stmt->execute([$sellerId]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "orders" => $orders
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>