<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Content-Type: application/json");
require_once '../db.php';

$sellerId = $_GET['sellerId'] ?? null;
if (!$sellerId) {
    echo json_encode([
        'success' => false,
        'message' => 'Seller ID is required'
    ]);
    exit;
}
try {
    $sql = "SELECT sn.*, 
        CASE 
            WHEN sn.type = 'new_order' THEN o.product_name 
            ELSE p.product_name 
        END AS product_name,
        CASE 
            WHEN sn.type = 'new_order' THEN cu.full_name 
            ELSE c.full_name 
        END AS customer_name,
        CASE 
            WHEN sn.type = 'new_order' THEN o.quantity 
            ELSE cr.quantity 
        END AS quantity
    FROM seller_notifications sn
    LEFT JOIN customization_requests cr ON sn.related_id = cr.id
    LEFT JOIN products p ON cr.product_id = p.id
    LEFT JOIN customers c ON cr.customer_id = c.id
    LEFT JOIN orders o ON sn.related_id = o.id AND sn.type = 'new_order'
    LEFT JOIN customers cu ON o.customer_id = cu.id AND sn.type = 'new_order'
    WHERE sn.seller_id = ?
    ORDER BY sn.is_read ASC, sn.id DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$sellerId]);
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode([
        'success' => true,
        'notifications' => $notifications
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
