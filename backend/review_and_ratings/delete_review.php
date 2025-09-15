
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
require_once __DIR__ . '/Review.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $reviewId = $input['review_id'] ?? null;
    $customerId = $input['customer_id'] ?? null;

    if (!$reviewId || !$customerId) {
        echo json_encode([
            "success" => false,
            "message" => "Review ID and Customer ID are required."
        ]);
        exit;
    }

    $review = new Review($conn);
    $result = $review->deleteReview($reviewId, $customerId);

    if ($result) {
        echo json_encode([
            "success" => true,
            "message" => "Review deleted successfully."
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Failed to delete review."
        ]);
    }
} catch (Exception $e) {
    error_log("Error in delete_review API: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Internal server error."
    ]);
}
