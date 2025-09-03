<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../db.php';

$input = json_decode(file_get_contents('php://input'), true);
$faq_id = $input['faq_id'] ?? null;
$category = $input['category'] ?? null;

if (!$faq_id || !$category) {
    echo json_encode(["success" => false, "message" => "FAQ ID and category are required."]);
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE faq SET category = ?, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$category, $faq_id]);
    echo json_encode(["success" => true, "message" => "Category updated successfully."]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
