<?php
require_once '../db.php';
// Add CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');


class ProductManager {
    private $pdo;
    public function __construct($pdo) {
        $this->pdo = $pdo;
    }
    public function deleteProductPermanent($productId) {
        try {
            // Delete the product itself
            $stmt = $this->pdo->prepare('DELETE FROM products WHERE id = ?');
            $stmt->execute([$productId]);
            return ['success' => true, 'message' => 'Product permanently deleted'];
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error deleting product', 'error' => $e->getMessage()];
        }
    }
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get product ID from POST data
$productId = $_POST['productId'] ?? null;
if (!$productId) {
    echo json_encode(['success' => false, 'message' => 'No product ID provided']);
    exit;
}

// Use $conn from db.php as the PDO instance
$productManager = new ProductManager($conn);
$result = $productManager->deleteProductPermanent($productId);
echo json_encode($result);
