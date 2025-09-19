<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
require_once '../db.php';
header('Content-Type: application/json');

$sql = "SELECT id, author, title, quote, rating, created_at FROM testimonials ORDER BY rating DESC, created_at DESC LIMIT 5";
$result = $conn->query($sql);
$testimonials = [];
if ($result) {
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        $testimonials[] = $row;
    }
    echo json_encode(['success' => true, 'testimonials' => $testimonials]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to fetch testimonials.']);
}
?>
