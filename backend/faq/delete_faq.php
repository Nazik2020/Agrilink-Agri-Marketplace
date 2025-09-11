<?php
// backend/faq/delete_faq.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../db.php';

$data = json_decode(file_get_contents('php://input'), true);
$faq_id = $data['faq_id'] ?? null;

if (!$faq_id) {
    echo json_encode(['success' => false, 'message' => 'FAQ ID missing.']);
    exit;
}

try {
    $stmt = $conn->prepare('DELETE FROM faq WHERE id = ?');
    $stmt->execute([$faq_id]);
    echo json_encode(['success' => true, 'message' => 'FAQ deleted.']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>
