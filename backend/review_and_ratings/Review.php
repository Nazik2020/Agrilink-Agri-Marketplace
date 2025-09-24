
<?php
// Review.php


class Review {
    private $conn;
    private $table = "reviews";

    public function __construct($db) {
        $this->conn = $db;
    }

    // Add a new review
    public function addReview($productId, $customerId, $rating, $comment) {
        $sql = "INSERT INTO {$this->table} (product_id, customer_id, rating, review_text, created_at) VALUES (?, ?, ?, ?, NOW())";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$productId, $customerId, $rating, $comment]);
    }

    // Update an existing review
    public function updateReview($productId, $customerId, $rating, $comment) {
        $sql = "UPDATE {$this->table} SET rating = ?, review_text = ?, updated_at = NOW() WHERE product_id = ? AND customer_id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$rating, $comment, $productId, $customerId]);
    }

    // Check if a review exists for this product/customer
    public function reviewExists($productId, $customerId) {
        $sql = "SELECT id FROM {$this->table} WHERE product_id = ? AND customer_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$productId, $customerId]);
        return $stmt->fetch(PDO::FETCH_ASSOC) !== false;
    }

    // Get all reviews for a product
    public function getReviewsByProduct($productId) {
        $sql = "SELECT r.*, c.full_name as customer_name FROM {$this->table} r JOIN customers c ON r.customer_id = c.id WHERE r.product_id = ? ORDER BY r.created_at DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$productId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get average rating for a product
    public function getAverageRating($productId) {
        $sql = "SELECT AVG(rating) as avg_rating FROM {$this->table} WHERE product_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$productId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? round($row['avg_rating'], 2) : null;
    }

    // Delete a review (only by the customer who wrote it)
    public function deleteReview($reviewId, $customerId) {
        $sql = "DELETE FROM {$this->table} WHERE id = ? AND customer_id = ?";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$reviewId, $customerId]);
    }
}
