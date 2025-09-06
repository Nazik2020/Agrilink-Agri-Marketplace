<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

require_once __DIR__ . '/../db.php';

$category = isset($_GET['category']) ? $_GET['category'] : null;

try {
    $sql = "SELECT * FROM faq";
    $params = [];
    if ($category) {
        $sql .= " WHERE category = ?";
        $params[] = $category;
    }
    $sql .= " ORDER BY created_at DESC";
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $faqs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["success" => true, "faqs" => $faqs]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
