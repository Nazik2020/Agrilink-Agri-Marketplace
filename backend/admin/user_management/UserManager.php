<?php
// Use absolute path to avoid issues with relative path resolution
require_once dirname(__FILE__) . '/../config/admin_config.php';

class UserManager {
    /**
     * Get user details for customer or seller
     */
    public function getUserDetails($userId, $userType) {
        try {
            if ($userType === 'customer') {
                $sql = "SELECT id, full_name, username, email, address, postal_code, contactno, country, profile_image, status, last_login, created_at FROM customers WHERE id = ? LIMIT 1";
                $stmt = $this->conn->prepare($sql);
                $stmt->execute([$userId]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($user) {
                    return [
                        'success' => true,
                        'user' => $user
                    ];
                } else {
                    return [
                        'success' => false,
                        'message' => 'Customer not found'
                    ];
                }
            } elseif ($userType === 'seller') {
                $sql = "SELECT id, username, business_name, business_description, country, contact_number, email, address, business_logo, status, last_login, created_at FROM sellers WHERE id = ? LIMIT 1";
                $stmt = $this->conn->prepare($sql);
                $stmt->execute([$userId]);
                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($user) {
                    return [
                        'success' => true,
                        'user' => $user
                    ];
                } else {
                    return [
                        'success' => false,
                        'message' => 'Seller not found'
                    ];
                }
            } else {
                return [
                    'success' => false,
                    'message' => 'Invalid user type'
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error fetching user details: ' . $e->getMessage()
            ];
        }
    }
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
            
            // Get customers with search filter
            $customerWhere = '';
            $customerParams = [];
            if ($search !== '') {
                $customerWhere = "WHERE (full_name LIKE ? OR email LIKE ?)";
                $customerParams[] = "%$search%";
                $customerParams[] = "%$search%";
            }
            $customerSql = "SELECT
                id, full_name as name, email, COALESCE(status, 'active') as status, created_at, last_login, 'customer' as type
                FROM customers
                $customerWhere
                ORDER BY created_at DESC";
            $customerStmt = $this->conn->prepare($customerSql);
            $customerStmt->execute($customerParams);
            $customers = $customerStmt->fetchAll(PDO::FETCH_ASSOC);

            // Add default values for missing columns
            foreach ($customers as &$customer) {
                $customer['address'] = '';
                $customer['contactno'] = '';
                $customer['country'] = '';
                $customer['postal_code'] = '';
                if (!isset($customer['last_login'])) {
                    $customer['last_login'] = null;
                }
            }
            $users = array_merge($users, $customers);

            // Get sellers with search filter
            $sellerWhere = '';
            $sellerParams = [];
            if ($search !== '') {
                $sellerWhere = "WHERE (business_name LIKE ? OR email LIKE ?)";
                $sellerParams[] = "%$search%";
                $sellerParams[] = "%$search%";
            }
            $sellerSql = "SELECT
                id, business_name as name, email, COALESCE(status, 'active') as status, created_at, last_login, 'seller' as type
                FROM sellers
                $sellerWhere
                ORDER BY created_at DESC";
            $sellerStmt = $this->conn->prepare($sellerSql);
            $sellerStmt->execute($sellerParams);
            $sellers = $sellerStmt->fetchAll(PDO::FETCH_ASSOC);

            // Add default values for missing columns
            foreach ($sellers as &$seller) {
                $seller['address'] = '';
                $seller['contactno'] = '';
                $seller['country'] = '';
                $seller['postal_code'] = '';
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