<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';
require_once 'Review.php';

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

    $review = new Review($conn);
    try {
        if ($review->reviewExists($productId, $customerId)) {
            // Update existing review
            $result = $review->updateReview($productId, $customerId, $rating, $comment);
            if ($result) {
                echo json_encode([
                    "success" => true,
                    "message" => "Review updated successfully."
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to update review."
                ]);
            }
        } else {
            // Add new review
            $result = $review->addReview($productId, $customerId, $rating, $comment);
            if ($result) {
                echo json_encode([
                    "success" => true,
                    "message" => "Review added successfully."
                ]);
            } else {
                echo json_encode([
                    "success" => false,
                    "message" => "Failed to add review."
                ]);
            }
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
