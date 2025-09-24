<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/review_and_ratings/Review.php';
require_once __DIR__ . '/utils/purchase_guard.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $productId = $input['product_id'] ?? null;
    $customerId = $input['customer_id'] ?? null;
    $rating = $input['rating'] ?? null;
    $comment = $input['comment'] ?? '';

    if (!$productId || !$customerId || !$rating) {
        echo json_encode([
            "success" => false,
            "message" => "Product ID, Customer ID, and Rating are required."
        ]);
        exit;
    }

    // Validate rating range (1-5)
    if (!is_numeric($rating) || $rating < 1 || $rating > 5) {
        echo json_encode([
            "success" => false,
            "message" => "Rating must be between 1 and 5."
        ]);
        exit;
    }

    // Restrict reviews to buyers with successful payment only
    enforcePurchasedOrFail($conn, (int)$customerId, (int)$productId);

    $review = new Review($conn);
    try {
        // Allow multiple reviews: always add a new review
        $result = $review->addReview($productId, $customerId, $rating, $comment);
        if ($result) {
            // Calculate new average rating
            $avgRating = $review->getAverageRating($productId);
            echo json_encode([
                "success" => true,
                "message" => "Review submitted successfully.",
                "average_rating" => $avgRating
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Failed to add review."
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
} catch (Exception $e) {
    error_log("Error in add_review API: " . $e->getMessage());
    echo json_encode([
        "success" => false,
        "message" => "Internal server error."
    ]);
}
