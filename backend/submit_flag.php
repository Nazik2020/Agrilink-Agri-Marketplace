<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require 'db.php';
require_once __DIR__ . '/utils/purchase_guard.php';

$data = json_decode(file_get_contents("php://input"), true);

$flagged_by_customer_id = $data['flagged_by_customer_id'];
$seller_id = $data['seller_id'];
$product_id = $data['product_id'] ?? null;
$category = $data['category'];
$reason = trim($data['reason']);

// Validate required fields
if (empty($flagged_by_customer_id) || empty($seller_id) || empty($product_id) || empty($category) || empty($reason)) {
    echo json_encode(["success" => false, "message" => "All fields are required (including product_id)"]);
    exit;
}

// Validate category
$valid_categories = ['Misleading claims', 'Inappropriate content', 'Other'];
if (!in_array($category, $valid_categories)) {
    echo json_encode(["success" => false, "message" => "Invalid category"]);
    exit;
}

try {
    // Check if the customer has purchased the product
    enforcePurchasedOrFail($conn, (int)$flagged_by_customer_id, (int)$product_id);

    // Insert the flag
    $stmt = $conn->prepare("INSERT INTO flags (flagged_by_customer_id, seller_id, product_id, category, reason) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$flagged_by_customer_id, $seller_id, $product_id, $category, $reason]);
    $flag_id = $conn->lastInsertId();

    // Notify seller about the flag (no customer details)
    try {
        $notificationData = [
            'seller_id' => $seller_id,
            'title' => 'Product Flagged',
            'message' => 'Your product (ID: ' . $product_id . ') has been flagged for "' . $category . '". Reason: ' . $reason,
            'type' => 'product_flagged',
            'related_id' => $flag_id
        ];
        $ch = curl_init('http://localhost/Agrilink-Agri-Marketplace/backend/notifications/add_notification.php');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($notificationData));
        $result = curl_exec($ch);
        curl_close($ch);
        error_log('Seller notified about product flag: ' . $result);
    } catch (Exception $e) {
        error_log('Failed to notify seller about product flag: ' . $e->getMessage());
    }

    echo json_encode([
        "success" => true, 
        "message" => "Flag submitted successfully",
        "flag_id" => $flag_id
    ]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>