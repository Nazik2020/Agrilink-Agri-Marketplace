<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db.php';

$seller_id = $_GET['seller_id'] ?? null;

if (empty($seller_id)) {
    echo json_encode(["success" => false, "message" => "Seller ID is required"]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT * FROM sellers WHERE id = ?");
    $stmt->execute([$seller_id]);
    $seller = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($seller) {
        echo json_encode([
            "success" => true, 
            "seller" => $seller
        ]);
    } else {
        echo json_encode([
            "success" => false, 
            "message" => "Seller not found"
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false, 
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
