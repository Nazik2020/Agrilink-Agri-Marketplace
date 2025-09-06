<?php
class Product {
    private $conn;
    private $table = "products";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getByCategory($category) {
        $sql = "SELECT * FROM {$this->table} WHERE category = :category";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':category', $category, PDO::PARAM_STR);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $products;
    }

    public function addProduct($seller_id, $product_name, $product_description, $price, $special_offer, $product_images, $category, $stock) {
        $sql = "INSERT INTO {$this->table} (seller_id, product_name, product_description, price, stock, special_offer, category, product_images) VALUES (:seller_id, :product_name, :product_description, :price, :stock, :special_offer, :category, :product_images)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(':seller_id', $seller_id);
        $stmt->bindValue(':product_name', $product_name);
        $stmt->bindValue(':product_description', $product_description);
        $stmt->bindValue(':price', $price);
        $stmt->bindValue(':stock', (int)$stock, PDO::PARAM_INT);
        $stmt->bindValue(':special_offer', $special_offer);
        $stmt->bindValue(':category', $category);
        $stmt->bindValue(':product_images', $product_images);
        // Debug: log stock value and type
        file_put_contents(__DIR__ . '/add_product_debug.log', "STOCK VALUE: " . var_export($stock, true) . " TYPE: " . gettype($stock) . "\n", FILE_APPEND);
        $result = $stmt->execute();
        file_put_contents(__DIR__ . '/add_product_debug.log', "PDO ERROR: " . var_export($stmt->errorInfo(), true) . "\n", FILE_APPEND);
        return $result;
    }
}
?>