<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once __DIR__ . '/../config/admin_config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

try {
    $input = file_get_contents("php://input");
    $data = json_decode($input, true);

    if (!isset($data['productId'])) {
        echo json_encode(["success" => false, "message" => "Missing productId"]);
        exit;
    }

    $productId = intval($data['productId']);
    $adminConfig = new AdminConfig();
    $conn = $adminConfig->getConnection();

    // Remove all flags for this product
    $sql = "DELETE FROM flags WHERE product_id = :productId";
    $stmt = $conn->prepare($sql);
    $stmt->bindValue(':productId', $productId, PDO::PARAM_INT);
    $stmt->execute();
    $rowsAffected = $stmt->rowCount();

    echo json_encode([
        "success" => true,
        "message" => "Flags removed for deleted product",
        "flags_removed" => $rowsAffected
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Server error occurred",
        "error" => $e->getMessage()
    ]);
}
