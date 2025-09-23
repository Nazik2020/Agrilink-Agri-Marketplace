<?php
require_once '../db.php';

class CustomizedProduct {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * Create a customized product from a customization request
     */
    public function createFromRequest($requestId, $customizationData) {
        try {
            // First, get the original request details
            $sql = "SELECT cr.*, p.product_name, p.product_description, p.category, p.product_images
                    FROM customization_requests cr
                    JOIN products p ON cr.product_id = p.id
                    WHERE cr.id = ?";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$requestId]);
            $request = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$request) {
                return [
                    'success' => false,
                    'message' => 'Customization request not found'
                ];
            }
            
            // Create the customized product (special_offer removed)
            $sql = "INSERT INTO customized_products (
                        original_product_id, customization_request_id, seller_id, customer_id,
                        product_name, product_description, customization_description,
                        price, stock, category, product_images
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                $request['product_id'],
                $requestId,
                $request['seller_id'],
                $request['customer_id'],
                $customizationData['product_name'],
                $customizationData['product_description'],
                $customizationData['customization_description'],
                $customizationData['price'],
                $customizationData['stock'],
                $customizationData['category'],
                $request['product_images'] // Use original product images
            ]);
            
            $customizedProductId = $this->conn->lastInsertId();
            
            // After creating the customized product, mark the request as 'customized'
            try {
                $updateReq = $this->conn->prepare("UPDATE customization_requests SET status = 'customized' WHERE id = ?");
                $updateReq->execute([$requestId]);
            } catch (PDOException $e) {
                error_log('Failed to update customization request status to customized: ' . $e->getMessage());
            }

            // Send notification to customer that their customized product is available
            try {
                $notificationUrl = 'http://localhost/Agrilink-Agri-Marketplace/backend/notifications/add_customer_notification.php';
                $payload = [
                    'customer_id' => $request['customer_id'],
                    'title' => 'Your Customization Product is Ready!',
                    'message' => 'Your new customization product "' . $customizationData['product_name'] . '" is now available under Customized Products. You can buy it now.',
                    'type' => 'customized_product_available',
                    'related_id' => $customizedProductId
                ];
                $ch = curl_init($notificationUrl);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
                curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
                $response = curl_exec($ch);
                curl_close($ch);
            } catch (Exception $e) {
                error_log('Failed to send customized product notification: ' . $e->getMessage());
            }

            return [
                'success' => true,
                'message' => 'Customized product created successfully',
                'customized_product_id' => $customizedProductId
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error creating customized product: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Get customized products for a specific customer
     */
    public function getCustomerProducts($customerId) {
        try {
            $sql = "SELECT cp.*, s.business_name as seller_name
                    FROM customized_products cp
                    JOIN sellers s ON cp.seller_id = s.id
                    WHERE cp.customer_id = ? AND cp.status = 'active' AND cp.stock > 0
                    ORDER BY cp.created_at DESC";

            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$customerId]);

            return [
                'success' => true,
                'products' => $stmt->fetchAll(PDO::FETCH_ASSOC)
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching customized products: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Get customized products for a seller
     */
    public function getSellerProducts($sellerId) {
        try {
            $sql = "SELECT cp.*, c.full_name as customer_name, c.email as customer_email
                    FROM customized_products cp
                    JOIN customers c ON cp.customer_id = c.id
                    WHERE cp.seller_id = ? AND cp.status = 'active'
                    ORDER BY cp.created_at DESC";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$sellerId]);
            
            return [
                'success' => true,
                'products' => $stmt->fetchAll(PDO::FETCH_ASSOC)
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching seller customized products: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Get customized product by ID
     */
    public function getById($productId) {
        try {
            $sql = "SELECT cp.*, s.business_name as seller_name, c.full_name as customer_name
                    FROM customized_products cp
                    JOIN sellers s ON cp.seller_id = s.id
                    JOIN customers c ON cp.customer_id = c.id
                    WHERE cp.id = ? AND cp.status = 'active'";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$productId]);
            
            $product = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($product) {
                return [
                    'success' => true,
                    'product' => $product
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Customized product not found'
                ];
            }
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching customized product: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Update customized product
     */
    public function update($productId, $updateData) {
        try {
            $sql = "UPDATE customized_products SET 
                        product_name = ?, 
                        product_description = ?, 
                        customization_description = ?,
                        price = ?, 
                        stock = ?, 
                        category = ?, 
                        updated_at = CURRENT_TIMESTAMP
                    WHERE id = ?";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                $updateData['product_name'],
                $updateData['product_description'],
                $updateData['customization_description'],
                $updateData['price'],
                $updateData['stock'],
                $updateData['category'],
                $productId
            ]);
            
            return [
                'success' => true,
                'message' => 'Customized product updated successfully'
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error updating customized product: ' . $e->getMessage()
            ];
        }
    }
}
?>
