<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $customizedProductId = isset($input['customized_product_id']) ? (int)$input['customized_product_id'] : 0;

    if ($customizedProductId <= 0) {
        echo json_encode(['success' => false, 'message' => 'customized_product_id is required']);
        exit;
    }

    // Get related request id
    $stmt = $conn->prepare("SELECT customization_request_id FROM customized_products WHERE id = ? LIMIT 1");
    $stmt->execute([$customizedProductId]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        echo json_encode(['success' => false, 'message' => 'Customized product not found']);
        exit;
    }
    $requestId = (int)$row['customization_request_id'];

    // Mark customized product inactive
    $u1 = $conn->prepare("UPDATE customized_products SET status = 'inactive' WHERE id = ?");
    $u1->execute([$customizedProductId]);

    // If column allows, move request to delivered; if not present in enum, this will be ignored by DB layer
    try {
        $u2 = $conn->prepare("UPDATE customization_requests SET status = 'delivered' WHERE id = ?");
        $u2->execute([$requestId]);
    } catch (Exception $e) {
        // fallback to 'customized' if enum not updated yet
        $u2 = $conn->prepare("UPDATE customization_requests SET status = 'customized' WHERE id = ?");
        $u2->execute([$requestId]);
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>





