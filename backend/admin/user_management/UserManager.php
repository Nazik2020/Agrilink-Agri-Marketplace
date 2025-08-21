<?php
// Use absolute path to avoid issues with relative path resolution
require_once dirname(__FILE__) . '/../config/admin_config.php';

class UserManager {
    private $conn;
    private $adminConfig;
    
    public function __construct() {
        $this->adminConfig = new AdminConfig();
        $this->conn = $this->adminConfig->getConnection();
    }
    
    /**
     * Get all users (customers and sellers) with pagination
     */
    public function getAllUsers($page = 1, $limit = 10, $search = '', $filter = 'all') {
        try {
            $offset = ($page - 1) * $limit;
            $users = [];
            $totalCount = 0;
            
            // Get customers count
            $customerCountSql = "SELECT COUNT(*) as total FROM customers";
            $customerCountStmt = $this->conn->prepare($customerCountSql);
            $customerCountStmt->execute();
            $customerCount = $customerCountStmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Get sellers count
            $sellerCountSql = "SELECT COUNT(*) as total FROM sellers";
            $sellerCountStmt = $this->conn->prepare($sellerCountSql);
            $sellerCountStmt->execute();
            $sellerCount = $sellerCountStmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            $totalCount = $customerCount + $sellerCount;
            
            // Get customers
            $customerSql = "SELECT
                id, full_name as name, email, COALESCE(status, 'active') as status, created_at, last_login, 'customer' as type
                FROM customers
                ORDER BY created_at DESC";
            
            $customerStmt = $this->conn->prepare($customerSql);
            $customerStmt->execute();
            $customers = $customerStmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Add default values for missing columns
            foreach ($customers as &$customer) {
                $customer['address'] = '';
                $customer['contactno'] = '';
                $customer['country'] = '';
                $customer['postal_code'] = '';
                // Ensure last_login is not overwritten
                if (!isset($customer['last_login'])) {
                    $customer['last_login'] = null;
                }
            }
            
            $users = array_merge($users, $customers);
            
            // Get sellers
            $sellerSql = "SELECT
                id, business_name as name, email, COALESCE(status, 'active') as status, created_at, last_login, 'seller' as type
                FROM sellers
                ORDER BY created_at DESC";
            
            $sellerStmt = $this->conn->prepare($sellerSql);
            $sellerStmt->execute();
            $sellers = $sellerStmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Add default values for missing columns
            foreach ($sellers as &$seller) {
                $seller['address'] = '';
                $seller['contactno'] = '';
                $seller['country'] = '';
                $seller['postal_code'] = '';
                // Ensure last_login is not overwritten
                if (!isset($seller['last_login'])) {
                    $seller['last_login'] = null;
                }
            }
            
            $users = array_merge($users, $sellers);
            
            // Sort by created_at and apply pagination
            usort($users, function($a, $b) {
                return strtotime($b['created_at']) - strtotime($a['created_at']);
            });
            
            $users = array_slice($users, $offset, $limit);
            
            return [
                'success' => true,
                'users' => $users,
                'pagination' => [
                    'current_page' => $page,
                    'total_pages' => ceil($totalCount / $limit),
                    'total_records' => $totalCount,
                    'per_page' => $limit
                ]
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error fetching users: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Update user status (active, banned, pending)
     */
    public function updateUserStatus($userId, $userType, $status) {
        try {
            $table = ($userType === 'customer') ? 'customers' : 'sellers';
            $sql = "UPDATE $table SET status = ? WHERE id = ?";
            
            $stmt = $this->conn->prepare($sql);
            $result = $stmt->execute([$status, $userId]);
            
            if ($result && $stmt->rowCount() > 0) {
                return ['success' => true, 'message' => 'User status updated successfully'];
            } else {
                return ['success' => false, 'message' => 'User not found or no changes made'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error updating user status: ' . $e->getMessage()];
        }
    }
    
    /**
     * Ban a user
     */
    public function banUser($userId, $userType, $reason = '') {
        try {
            $table = ($userType === 'customer') ? 'customers' : 'sellers';
            
            $sql = "UPDATE $table SET status = 'banned', banned_reason = ?, banned_at = NOW() WHERE id = ?";
            $stmt = $this->conn->prepare($sql);
            $result = $stmt->execute([$reason, $userId]);
            
            if ($result && $stmt->rowCount() > 0) {
                return [
                    'success' => true,
                    'message' => 'User banned successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'User not found or already banned'
                ];
            }
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error banning user: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Unban a user
     */
    public function unbanUser($userId, $userType) {
        try {
            $table = ($userType === 'customer') ? 'customers' : 'sellers';
            
            $sql = "UPDATE $table SET status = 'active', banned_reason = NULL, banned_at = NULL WHERE id = ?";
            $stmt = $this->conn->prepare($sql);
            $result = $stmt->execute([$userId]);
            
            if ($result && $stmt->rowCount() > 0) {
                return [
                    'success' => true,
                    'message' => 'User unbanned successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'User not found or not banned'
                ];
            }
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error unbanning user: ' . $e->getMessage()
            ];
        }
    }
}
?>