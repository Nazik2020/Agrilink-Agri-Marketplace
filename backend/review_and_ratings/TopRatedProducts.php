<?php
// OOP class to fetch top rated products
class TopRatedProducts {
    private $conn;
    private $productTable = "products";
    private $reviewTable = "reviews";
    private $sellerTable = "sellers";

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Get top N products by average rating (with at least 1 review)
     * @param int $limit
     * @return array
     */
    public function getTopRated($limit = 6) {
        $sql = "SELECT p.*, s.business_name as seller_name, 
                       ROUND(AVG(r.rating),2) as average_rating, COUNT(r.id) as review_count
                FROM {$this->productTable} p
                LEFT JOIN {$this->sellerTable} s ON p.seller_id = s.id
                LEFT JOIN {$this->reviewTable} r ON p.id = r.product_id
                GROUP BY p.id
                HAVING review_count > 0
                ORDER BY average_rating DESC
                LIMIT :limit";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        // Decode images and ensure average_rating is always a number
        foreach ($products as &$product) {
            $product['product_images'] = $product['product_images'] ? json_decode($product['product_images'], true) : [];
            if (!isset($product['average_rating']) || $product['average_rating'] === null) {
                $product['average_rating'] = 0;
            } else {
                $product['average_rating'] = floatval($product['average_rating']);
            }
        }
        return $products;
    }
}
