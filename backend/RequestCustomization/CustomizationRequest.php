<?php
require_once '../db.php';

class CustomizationRequest {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * Create a new customization request
     */
    public function createRequest($customerId, $sellerId, $productId, $customizationDetails, $quantity, $notes = '') {
        try {
            $sql = "INSERT INTO customization_requests (customer_id, seller_id, product_id, customization_details, quantity, notes) 
                    VALUES (?, ?, ?, ?, ?, ?)";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$customerId, $sellerId, $productId, $customizationDetails, $quantity, $notes]);
            
            return [
                'success' => true,
                'message' => 'Customization request submitted successfully',
                'request_id' => $this->conn->lastInsertId()
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error creating customization request: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Get all customization requests for a seller
     */
    public function getSellerRequests($sellerId) {
        try {
            $sql = "SELECT cr.*, p.product_name, p.product_description, p.price as original_price, 
                           c.full_name as customer_name, c.email as customer_email
                    FROM customization_requests cr
                    JOIN products p ON cr.product_id = p.id
                    JOIN customers c ON cr.customer_id = c.id
                    WHERE cr.seller_id = ?
                    ORDER BY cr.created_at DESC";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$sellerId]);
            
            return [
                'success' => true,
                'requests' => $stmt->fetchAll(PDO::FETCH_ASSOC)
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching customization requests: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Get customization requests for a customer
     */
    public function getCustomerRequests($customerId) {
        try {
            $sql = "SELECT cr.*, p.product_name, p.product_description, p.price as original_price,
                           s.business_name as seller_name
                    FROM customization_requests cr
                    JOIN products p ON cr.product_id = p.id
                    JOIN sellers s ON cr.seller_id = s.id
                    WHERE cr.customer_id = ?
                    ORDER BY cr.created_at DESC";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$customerId]);
            
            return [
                'success' => true,
                'requests' => $stmt->fetchAll(PDO::FETCH_ASSOC)
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching customer requests: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Update request status (accept/decline)
     */
    public function updateStatus($requestId, $status) {
        try {
            $sql = "UPDATE customization_requests SET status = ? WHERE id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$status, $requestId]);
            
            return [
                'success' => true,
                'message' => 'Request status updated successfully'
            ];
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error updating request status: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Get request by ID
     */
    public function getRequestById($requestId) {
        try {
            $sql = "SELECT cr.*, p.product_name, p.product_description, p.price as original_price,
                           c.full_name as customer_name, c.email as customer_email,
                           s.business_name as seller_name
                    FROM customization_requests cr
                    JOIN products p ON cr.product_id = p.id
                    JOIN customers c ON cr.customer_id = c.id
                    JOIN sellers s ON cr.seller_id = s.id
                    WHERE cr.id = ?";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$requestId]);
            
            $request = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($request) {
                return [
                    'success' => true,
                    'request' => $request
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Request not found'
                ];
            }
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching request: ' . $e->getMessage()
            ];
        }
    }
}
?>
