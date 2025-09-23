<?php
/**
 * CustomizationRequest service
 * Implements CRUD helpers used by API endpoints.
 */

class CustomizationRequest {
    /** @var PDO */
    private $conn;

    public function __construct(PDO $conn) {
        $this->conn = $conn;
    }

    /**
     * Create a new customization request
     */
    public function createRequest(int $customerId, int $sellerId, int $productId, string $details, int $quantity, string $notes = ''): array {
        try {
            $sql = "INSERT INTO customization_requests (customer_id, seller_id, product_id, customization_details, quantity, notes) VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$customerId, $sellerId, $productId, $details, $quantity, $notes]);

            return [
                'success' => true,
                'message' => 'Customization request submitted successfully',
                'request_id' => (int)$this->conn->lastInsertId(),
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error creating request: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Return all requests for a seller (excluding deleted)
     */
    public function getSellerRequests(int $sellerId): array {
        try {
            $sql = "SELECT cr.*, p.product_name, p.product_description, p.category, p.price AS original_price, p.special_offer,
                           c.full_name AS customer_name, c.email AS customer_email
                    FROM customization_requests cr
                    JOIN products p ON cr.product_id = p.id
                    JOIN customers c ON cr.customer_id = c.id
                    WHERE cr.seller_id = ? AND (cr.status_of_request IS NULL OR cr.status_of_request <> 'deleted')
                    ORDER BY cr.created_at DESC";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$sellerId]);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Enrich with effective_price if there is a percentage or BxGy offer
            foreach ($rows as &$row) {
                $row['effective_price'] = $this->calculateEffectivePrice($row['original_price'], $row['special_offer'] ?? '');
            }

            return [
                'success' => true,
                'requests' => $rows,
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching seller requests: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Update status (pending | accepted | declined)
     */
    public function updateStatus(int $requestId, string $status): array {
        try {
            $valid = ['pending', 'accepted', 'declined'];
            if (!in_array($status, $valid, true)) {
                return [
                    'success' => false,
                    'message' => 'Invalid status',
                ];
            }

            $stmt = $this->conn->prepare("UPDATE customization_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $stmt->execute([$status, $requestId]);

            return [
                'success' => true,
                'message' => 'Request status updated successfully',
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error updating status: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Get request by ID with basic joins for notifications
     */
    public function getRequestById(int $requestId): array {
        try {
            $sql = "SELECT cr.*, p.product_name, s.business_name AS seller_name
                    FROM customization_requests cr
                    JOIN products p ON cr.product_id = p.id
                    JOIN sellers s ON cr.seller_id = s.id
                    WHERE cr.id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$requestId]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$row) {
                return [
                    'success' => false,
                    'message' => 'Request not found',
                ];
            }

            return [
                'success' => true,
                'request' => $row,
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching request: ' . $e->getMessage(),
            ];
        }
    }

    private function calculateEffectivePrice($originalPrice, $offer) {
        if ($originalPrice === null) return null;
        $price = (float)$originalPrice;
        if (!$offer) return $price;

        // Handle "10% Off" etc.
        if (preg_match('/^(\d{1,2})%\s*Off$/i', trim($offer), $m)) {
            $percent = (float)$m[1];
            if ($percent >= 0 && $percent <= 90) {
                return round($price * (1 - $percent / 100), 2);
            }
            return $price;
        }

        // Handle "Buy X Get Y Free"
        if (preg_match('/^Buy\s*(\d+)\s*Get\s*(\d+)\s*Free$/i', trim($offer), $m)) {
            $buy = (int)$m[1];
            $free = (int)$m[2];
            if ($buy > 0) {
                $unit = $price * $buy / ($buy + $free);
                return round($unit, 2);
            }
            return $price;
        }

        // Unknown offers -> keep original
        return $price;
    }
}

?>


