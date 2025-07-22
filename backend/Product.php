<?php
class Product {
    private $conn;
    private $table = "products";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getByCategory($category_id) {
        $sql = "SELECT * FROM {$this->table} WHERE category_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $category_id);
        $stmt->execute();

        $result = $stmt->get_result();
        $products = [];

        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }

        return $products;
    }
}
?>

<?php
class Product {
    private $conn;
    private $table = "products";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getByCategory($category_id) {
        $sql = "SELECT * FROM {$this->table} WHERE category_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $category_id);
        $stmt->execute();

        $result = $stmt->get_result();
        $products = [];

        while ($row = $result->fetch_assoc()) {
            $products[] = $row;
        }

        return $products;
    }

    public function addProduct($seller_id, $product_name, $product_description, $price, $special_offer, $product_image, $category) {
        $sql = "INSERT INTO {$this->table} (seller_id, product_name, product_description, price, special_offer, product_image, category) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$seller_id, $product_name, $product_description, $price, $special_offer, $product_image, $category]);
    }
}
?>
