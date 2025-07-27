<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");

require 'db.php';

try {
    // Get query parameters
    $seller_id = $_GET['seller_id'] ?? null;
    $product_id = $_GET['product_id'] ?? null;

    if (!$seller_id) {
        echo json_encode(["success" => false, "message" => "Seller ID is required"]);
        exit;
    }

    // Build query based on whether we're checking product or seller flags
    if ($product_id) {
        // Get flags count for specific product
        $stmt = $conn->prepare("SELECT COUNT(*) as flag_count FROM flags WHERE seller_id = ? AND product_id = ?");
        $stmt->execute([$seller_id, $product_id]);
    } else {
        // Get flags count for seller (all products + seller profile flags)
        $stmt = $conn->prepare("SELECT COUNT(*) as flag_count FROM flags WHERE seller_id = ?");
        $stmt->execute([$seller_id]);
    }

    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        "success" => true,
        "flag_count" => (int)$result['flag_count'],
        "seller_id" => $seller_id,
        "product_id" => $product_id
    ]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>