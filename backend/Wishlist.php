<?php
require_once __DIR__ . '/services/OfferPricing.php';

class Wishlist {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    /**
     * Add a product to customer's wishlist
     * @param int $customerId
     * @param int $productId
     * @return bool
     */
    public function addToWishlist($customerId, $productId) {
        try {
            // Check if product exists
            if (!$this->productExists($productId)) {
                throw new Exception("Product does not exist");
            }

            // Check if already in wishlist
            if ($this->isInWishlist($customerId, $productId)) {
                return true; // Already exists, consider it successful
            }

            $stmt = $this->conn->prepare("INSERT INTO wishlist (customer_id, product_id) VALUES (?, ?)");
            return $stmt->execute([$customerId, $productId]);
        } catch (PDOException $e) {
            error_log("Error adding to wishlist: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Remove a product from customer's wishlist
     * @param int $customerId
     * @param int $productId
     * @return bool
     */
    public function removeFromWishlist($customerId, $productId) {
        try {
            $stmt = $this->conn->prepare("DELETE FROM wishlist WHERE customer_id = ? AND product_id = ?");
            return $stmt->execute([$customerId, $productId]);
        } catch (PDOException $e) {
            error_log("Error removing from wishlist: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get customer's wishlist with product details
     * @param int $customerId
     * @return array
     */
    public function getCustomerWishlist($customerId) {
        try {
            $stmt = $this->conn->prepare("
                SELECT w.id, w.product_id, w.added_at, 
                       p.product_name, p.product_description, p.price, 
                       p.special_offer, p.category, p.product_images
                FROM wishlist w
                INNER JOIN products p ON w.product_id = p.id
                WHERE w.customer_id = ?
                ORDER BY w.added_at DESC
            ");
            $stmt->execute([$customerId]);
            $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($items as &$item) {
                $basePrice = isset($item['price']) ? (float)$item['price'] : 0.0;
                $specialOffer = $item['special_offer'] ?? null;
                $pricing = OfferPricing::compute($basePrice, 1, $specialOffer);
                $item['effective_price'] = $pricing['unit_price'];
            }

            return $items;
        } catch (PDOException $e) {
            error_log("Error getting wishlist: " . $e->getMessage());
            return [];
        }
    }

    /**
     * Check if product is in customer's wishlist
     * @param int $customerId
     * @param int $productId
     * @return bool
     */
    public function isInWishlist($customerId, $productId) {
        try {
            $stmt = $this->conn->prepare("SELECT COUNT(*) FROM wishlist WHERE customer_id = ? AND product_id = ?");
            $stmt->execute([$customerId, $productId]);
            return $stmt->fetchColumn() > 0;
        } catch (PDOException $e) {
            error_log("Error checking wishlist: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Sync guest wishlist items to customer account
     * @param int $customerId
     * @param array $productIds
     * @return array
     */
    public function syncGuestWishlist($customerId, $productIds) {
        $results = [
            'success' => [],
            'failed' => [],
            'already_exists' => []
        ];

        foreach ($productIds as $productId) {
            try {
                if ($this->addToWishlist($customerId, $productId)) {
                    if ($this->isInWishlist($customerId, $productId)) {
                        $results['already_exists'][] = $productId;
                    } else {
                        $results['success'][] = $productId;
                    }
                } else {
                    $results['failed'][] = $productId;
                }
            } catch (Exception $e) {
                $results['failed'][] = $productId;
            }
        }

        return $results;
    }

    /**
     * Get wishlist count for customer
     * @param int $customerId
     * @return int
     */
    public function getWishlistCount($customerId) {
        try {
            $stmt = $this->conn->prepare("SELECT COUNT(*) FROM wishlist WHERE customer_id = ?");
            $stmt->execute([$customerId]);
            return $stmt->fetchColumn();
        } catch (PDOException $e) {
            error_log("Error getting wishlist count: " . $e->getMessage());
            return 0;
        }
    }

    /**
     * Check if product exists
     * @param int $productId
     * @return bool
     */
    private function productExists($productId) {
        try {
            $stmt = $this->conn->prepare("SELECT COUNT(*) FROM products WHERE id = ?");
            $stmt->execute([$productId]);
            return $stmt->fetchColumn() > 0;
        } catch (PDOException $e) {
            error_log("Error checking product existence: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Clear customer's entire wishlist
     * @param int $customerId
     * @return bool
     */
    public function clearWishlist($customerId) {
        try {
            $stmt = $this->conn->prepare("DELETE FROM wishlist WHERE customer_id = ?");
            return $stmt->execute([$customerId]);
        } catch (PDOException $e) {
            error_log("Error clearing wishlist: " . $e->getMessage());
            return false;
        }
    }
} 