
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
    // Accept product_id from GET (for frontend) or POST/JSON (for flexibility)
    $productId = null;
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $productId = isset($_GET['product_id']) ? $_GET['product_id'] : null;
    } else {
        $input = json_decode(file_get_contents('php://input'), true);
        $productId = $input['product_id'] ?? null;
    }

    if (!$productId) {
        echo json_encode([
            "success" => false,
            "message" => "Product ID is required."
        ]);
        exit;
    }

    $review = new Review($conn);
    $reviews = $review->getReviewsByProduct($productId);
    $avgRating = $review->getAverageRating($productId);

    echo json_encode([
        "success" => true,
        "reviews" => $reviews,
        "average_rating" => $avgRating
    ]);
} catch (Exception $e) {
    error_log("Error in get_reviews API: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Internal server error."
    ]);
}
