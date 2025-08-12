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

    public function addProduct($seller_id, $product_name, $product_description, $price, $special_offer, $product_images, $category) {
        $sql = "INSERT INTO {$this->table} (seller_id, product_name, product_description, price, special_offer, product_images, category) VALUES (:seller_id, :product_name, :product_description, :price, :special_offer, :product_images, :category)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([
            ':seller_id' => $seller_id,
            ':product_name' => $product_name,
            ':product_description' => $product_description,
            ':price' => $price,
            ':special_offer' => $special_offer,
            ':product_images' => $product_images,
            ':category' => $category
        ]);
    }
}
?>
