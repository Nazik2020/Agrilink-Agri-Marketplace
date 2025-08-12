<?php
require_once __DIR__ . '/../../db.php';

class FlagService
{
    private ?PDO $conn = null;

    public function __construct()
    {
        $this->conn = getDbConnection();
        if ($this->conn === null) {
            throw new Exception("Database connection failed");
        }
    }

    public function createFlag(int $customerId, int $sellerId, ?int $productId, string $category, string $reason): array
    {
        $reason = trim($reason);
        $category = trim($category);

        if ($customerId <= 0 || $sellerId <= 0 || $category === '' || $reason === '') {
            return [
                'success' => false,
                'message' => 'All fields are required'
            ];
        }

        $validCategories = ['Misleading claims', 'Inappropriate content', 'Other'];
        if (!in_array($category, $validCategories, true)) {
            return [
                'success' => false,
                'message' => 'Invalid category'
            ];
        }

        if ($this->hasExistingFlag($customerId, $sellerId, $productId)) {
            return [
                'success' => false,
                'message' => 'You have already flagged this content'
            ];
        }

        $sql = 'INSERT INTO flags (flagged_by_customer_id, seller_id, product_id, category, reason)
                VALUES (:customer_id, :seller_id, :product_id, :category, :reason)';
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':customer_id', $customerId, PDO::PARAM_INT);
        $stmt->bindValue(':seller_id', $sellerId, PDO::PARAM_INT);
        if ($productId === null) {
            $stmt->bindValue(':product_id', null, PDO::PARAM_NULL);
        } else {
            $stmt->bindValue(':product_id', $productId, PDO::PARAM_INT);
        }
        $stmt->bindValue(':category', $category, PDO::PARAM_STR);
        $stmt->bindValue(':reason', $reason, PDO::PARAM_STR);
        $stmt->execute();

        return [
            'success' => true,
            'message' => 'Flag submitted successfully',
            'flag_id' => (int) $this->conn->lastInsertId(),
        ];
    }

    public function hasExistingFlag(int $customerId, int $sellerId, ?int $productId): bool
    {
        $base = 'SELECT flag_id FROM flags WHERE flagged_by_customer_id = :customer_id AND seller_id = :seller_id';
        if ($productId === null) {
            $sql = $base . ' AND product_id IS NULL LIMIT 1';
            $stmt = $this->conn->prepare($sql);
        } else {
            $sql = $base . ' AND product_id = :product_id LIMIT 1';
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(':product_id', $productId, PDO::PARAM_INT);
        }
        $stmt->bindValue(':customer_id', $customerId, PDO::PARAM_INT);
        $stmt->bindValue(':seller_id', $sellerId, PDO::PARAM_INT);
        $stmt->execute();
        return (bool) $stmt->fetchColumn();
    }
}
?>


