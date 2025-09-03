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
$question = $input['question'] ?? null;
$category = $input['category'] ?? null;



if (!$question || !$category) {
    if (!$question) {
        echo json_encode(["success" => false, "message" => "Question is required."]);
        exit;
    }
}

try {
    if ($category) {
        $stmt = $conn->prepare("INSERT INTO faq (question, category) VALUES (?, ?)");
        $stmt->execute([$question, $category]);
    } else {
        $stmt = $conn->prepare("INSERT INTO faq (question) VALUES (?)");
        $stmt->execute([$question]);
    }
    echo json_encode(["success" => true, "message" => "Question submitted successfully."]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
