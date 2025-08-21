<?php
require_once '../config/admin_config.php';

class UserStats {
    private $conn;
    
    public function __construct() {
        $this->conn = getDbConnection();
    }
    
    /**
     * Get total users count (customers + sellers)
     */
    public function getTotalUsers() {
        try {
            // Get customers count
            $stmt = $this->conn->prepare("SELECT COUNT(*) as count FROM customers");
            $stmt->execute();
            $customersCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            // Get sellers count
            $stmt = $this->conn->prepare("SELECT COUNT(*) as count FROM sellers");
            $stmt->execute();
            $sellersCount = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            $totalUsers = $customersCount + $sellersCount;
            
            return [
                'success' => true,
                'total_users' => $totalUsers,
                'customers' => $customersCount,
                'sellers' => $sellersCount
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error getting user count: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Get active sellers count
     */
    public function getActiveSellers() {
        try {
            $stmt = $this->conn->prepare("SELECT COUNT(*) as count FROM sellers WHERE COALESCE(status, 'active') = 'active'");
            $stmt->execute();
            $activeSellers = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            return [
                'success' => true,
                'active_sellers' => $activeSellers
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error getting active sellers: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Get all user statistics
     */
    public function getAllStats() {
        try {
            $totalUsers = $this->getTotalUsers();
            $activeSellers = $this->getActiveSellers();
            
            if (!$totalUsers['success'] || !$activeSellers['success']) {
                return [
                    'success' => false,
                    'message' => 'Failed to get user statistics'
                ];
            }
            
            return [
                'success' => true,
                'stats' => [
                    'total_users' => $totalUsers['total_users'],
                    'active_sellers' => $activeSellers['active_sellers'],
                    'customers' => $totalUsers['customers'],
                    'sellers' => $totalUsers['sellers']
                ]
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error getting all stats: ' . $e->getMessage()
            ];
        }
    }
}
?> 