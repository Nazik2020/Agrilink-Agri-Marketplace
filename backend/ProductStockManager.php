<?php
// ProductStockManager.php - Handles stock checking and updating for products
class ProductStockManager {
    private $conn;
    private $table = "products";

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get current stock for a product
    public function getStock($product_id) {
        $sql = "SELECT stock FROM {$this->table} WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':id', $product_id, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? intval($row['stock']) : null;
    }

    // Decrease stock for a product by a given quantity
    public function decreaseStock($product_id, $quantity) {
        $sql = "UPDATE {$this->table} SET stock = stock - :qty WHERE id = :id AND stock >= :qty";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':qty', $quantity, PDO::PARAM_INT);
        $stmt->bindParam(':id', $product_id, PDO::PARAM_INT);

        // Check autocommit mode
        $autocommit = null;
        try {
            $autocommit = $this->conn->getAttribute(PDO::ATTR_AUTOCOMMIT);
            error_log("[StockManager] PDO autocommit mode: " . var_export($autocommit, true));
        } catch (Exception $e) {
            error_log("[StockManager] Could not get autocommit mode: " . $e->getMessage());
        }

        $success = $stmt->execute();
        $affectedRows = $stmt->rowCount();
        $errorInfo = $stmt->errorInfo();
        $stockCheck = $this->getStock($product_id);

        if (!$success) {
            error_log("[StockManager] SQL execution failed: " . print_r($errorInfo, true));
        }
        if ($affectedRows === 0) {
            error_log("[StockManager] No rows affected when decreasing stock for product_id=$product_id, quantity=$quantity. Current stock: $stockCheck. ErrorInfo: " . print_r($errorInfo, true));
        }

        return [
            'success' => $affectedRows > 0,
            'affected_rows' => $affectedRows,
            'current_stock' => $stockCheck,
            'product_id' => $product_id,
            'quantity' => $quantity,
            'autocommit' => $autocommit,
            'errorInfo' => $errorInfo
        ];
    }
}
?>
