<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$flagged_by_customer_id = $data['flagged_by_customer_id'];
$seller_id = $data['seller_id'];
$product_id = $data['product_id'] ?? null;
$category = $data['category'];
$reason = trim($data['reason']);

// Validate required fields
if (empty($flagged_by_customer_id) || empty($seller_id) || empty($category) || empty($reason)) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}

// Validate category
$valid_categories = ['Misleading claims', 'Inappropriate content', 'Other'];
if (!in_array($category, $valid_categories)) {
    echo json_encode(["success" => false, "message" => "Invalid category"]);
    exit;
}

try {
    // Check if customer already flagged this seller/product
    $checkSql = "SELECT flag_id FROM flags WHERE flagged_by_customer_id = ? AND seller_id = ?";
    $checkParams = [$flagged_by_customer_id, $seller_id];
    
    if ($product_id) {
        $checkSql .= " AND product_id = ?";
        $checkParams[] = $product_id;
    } else {
        $checkSql .= " AND product_id IS NULL";
    }
    
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->execute($checkParams);
    
    if ($checkStmt->fetch()) {
        echo json_encode(["success" => false, "message" => "You have already flagged this content"]);
        exit;
    }

    // Insert the flag
    $stmt = $conn->prepare("INSERT INTO flags (flagged_by_customer_id, seller_id, product_id, category, reason) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$flagged_by_customer_id, $seller_id, $product_id, $category, $reason]);

    echo json_encode([
        "success" => true, 
        "message" => "Flag submitted successfully",
        "flag_id" => $conn->lastInsertId()
    ]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>