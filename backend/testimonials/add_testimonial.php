<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once '../db.php';
header('Content-Type: application/json');

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);
$author = $data['author'] ?? '';
$title = $data['title'] ?? '';
$quote = $data['quote'] ?? '';
$rating = floatval($data['rating'] ?? 0);

if (!$author || !$quote) {
    echo json_encode(['success' => false, 'message' => 'Author and quote are required.']);
    exit;
}

try {
    $stmt = $conn->prepare("INSERT INTO testimonials (author, title, quote, rating) VALUES (?, ?, ?, ?)");
    $stmt->execute([$author, $title, $quote, $rating]);
    echo json_encode(['success' => true, 'message' => 'Testimonial added successfully.']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to add testimonial.']);
}
?>
