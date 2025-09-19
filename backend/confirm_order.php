<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'db.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$orderId = $input['orderId'] ?? null;
$sellerId = $input['sellerId'] ?? null;
$action = $input['action'] ?? 'confirm'; // 'confirm' or 'cancel'

if (empty($orderId) || empty($sellerId)) {
    echo json_encode([
        "success" => false,
        "message" => "Order ID and Seller ID are required"
    ]);
    exit;
}

if (!in_array($action, ['confirm', 'cancel'])) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid action. Must be 'confirm' or 'cancel'"
    ]);
    exit;
}

try {
    // Start transaction
    $conn->beginTransaction();
    
    // First verify that this order belongs to this seller and is pending
    $verifyStmt = $conn->prepare("
        SELECT o.*, p.stock
        FROM orders o
        JOIN products p ON o.product_id = p.id
    WHERE o.id = ? AND o.seller_id = ? AND o.order_status IN ('pending', 'processing')
    ");
    $verifyStmt->execute([$orderId, $sellerId]);
    $order = $verifyStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$order) {
        throw new Exception("Order not found, not authorized, or already processed");
    }
    
    if ($action === 'confirm') {
        // Check if there's enough stock for confirmation
        if ($order['stock'] < $order['quantity']) {
            throw new Exception("Insufficient stock. Available: {$order['stock']}, Required: {$order['quantity']}");
        }
        
        // Update order status to confirmed
        $updateOrderStmt = $conn->prepare("
            UPDATE orders
            SET order_status = 'confirmed',
                updated_at = NOW()
            WHERE id = ?
        ");
        $updateOrderStmt->execute([$orderId]);
        
        // Update product stock (reduce stock)
        $updateStockStmt = $conn->prepare("
            UPDATE products
            SET stock = stock - ?
            WHERE id = ?
        ");
        $updateStockStmt->execute([$order['quantity'], $order['product_id']]);
        
        $message = "Order confirmed successfully";
            // Notify customer: order is ready to be delivered
            try {
                $notificationData = [
                    'customer_id' => $order['customer_id'],
                    'title' => 'Order Ready for Delivery',
                    'message' => 'Your order #' . $orderId . ' for ' . $order['product_name'] . ' (Qty: ' . $order['quantity'] . ') is ready to be delivered.',
                    'type' => 'order_ready',
                    'related_id' => $orderId
                ];
                $ch = curl_init('http://localhost/Agrilink-Agri-Marketplace/backend/notifications/add_customer_notification.php');
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($notificationData));
                $result = curl_exec($ch);
                curl_close($ch);
                error_log('Customer notified: order ready for delivery: ' . $result);
            } catch (Exception $e) {
                error_log('Failed to notify customer: order ready for delivery: ' . $e->getMessage());
            }
        
    } else { // $action === 'cancel'
        // Update order status to cancelled
        $updateOrderStmt = $conn->prepare("
            UPDATE orders
            SET order_status = 'cancelled',
                updated_at = NOW()
            WHERE id = ?
        ");
        $updateOrderStmt->execute([$orderId]);
        
        // No stock update needed for cancellation since stock wasn't reduced yet
        $message = "Order cancelled successfully";
            // Notify customer: order cancelled
            try {
                $notificationData = [
                    'customer_id' => $order['customer_id'],
                    'title' => 'Order Cancelled',
                    'message' => 'Your order #' . $orderId . ' for ' . $order['product_name'] . ' has been cancelled due to special reasons. Please contact the seller for more information.',
                    'type' => 'order_cancelled',
                    'related_id' => $orderId
                ];
                $ch = curl_init('http://localhost/Agrilink-Agri-Marketplace/backend/notifications/add_customer_notification.php');
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($notificationData));
                $result = curl_exec($ch);
                curl_close($ch);
                error_log('Customer notified: order cancelled: ' . $result);
            } catch (Exception $e) {
                error_log('Failed to notify customer: order cancelled: ' . $e->getMessage());
            }
    }
    
    // Commit transaction
    $conn->commit();
    
    echo json_encode([
        "success" => true,
        "message" => $message,
        "order_id" => $orderId,
        "action" => $action
    ]);
    
} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    
    echo json_encode([
        "success" => false,
        "message" => "Error processing order: " . $e->getMessage()
    ]);
}
?>