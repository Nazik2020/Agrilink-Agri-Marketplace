<?php
require_once __DIR__ . '/../db.php';

/**
 * User Authentication Service Class
 * Handles user authentication with status validation
 */
class UserAuthenticationService {
    private $conn;
    
    public function __construct() {
        // Do not connect here; defer connection until needed
        $this->conn = null;
    }

    /**
     * Normalize and determine user status from row
     * Supports multiple possible schema variants
     */
    private function getCanonicalStatus(array $user): string {
        $candidates = [
            'status',
            'user_status',
            'account_status',
        ];
        foreach ($candidates as $key) {
            if (array_key_exists($key, $user) && $user[$key] !== null && $user[$key] !== '') {
                return strtolower(trim((string)$user[$key]));
            }
        }
        // Boolean-style flags
        if (array_key_exists('is_banned', $user)) {
            $flag = (string)$user['is_banned'];
            if ($flag === '1' || strtolower($flag) === 'true' || strtolower($flag) === 'yes') {
                return 'banned';
            }
        }
        return 'active';
    }

    private function ensureConnection() {
        if ($this->conn instanceof PDO) {
            return;
        }
        // May throw; caller catch
        $this->conn = getDbConnection();
    }
    
    /**
     * Authenticate user with status validation
     * 
     * @param string $email User email
     * @param string $password User password
     * @return array Authentication result
     */
    public function authenticateUser($email, $password) {
        try {
            // First, try to authenticate as admin (no DB required)
            $adminResult = $this->authenticateAdmin($email, $password);
            if (!empty($adminResult['success'])) {
                return $adminResult;
            }
            
            // Try to authenticate as seller
            $sellerResult = $this->authenticateSeller($email, $password);
            if (!empty($sellerResult['success'])) {
                return $sellerResult;
            }
            // Preserve specific failure reasons (e.g., account_banned, database_error)
            if (isset($sellerResult['error_type'])) {
                return $sellerResult;
            }
            
            // Try to authenticate as customer
            $customerResult = $this->authenticateCustomer($email, $password);
            if (!empty($customerResult['success'])) {
                return $customerResult;
            }
            if (isset($customerResult['error_type'])) {
                return $customerResult;
            }
            
            // If no authentication succeeded
            return [
                'success' => false,
                'message' => 'Invalid credentials'
            ];
            
        } catch (Exception $e) {
            error_log("Authentication error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'Authentication error occurred'
            ];
        }
    }
    
    /**
     * Authenticate admin user
     */
    private function authenticateAdmin($email, $password) {
        // Hardcoded admin credentials (in production, this should be in database)
        if ($email === 'agrilink@gmail.com' && $password === 'admin123') {
            return [
                'success' => true,
                'message' => 'Admin login successful',
                'user' => [
                    'email' => $email,
                    'role' => 'admin',
                    'user_type' => 'admin',
                    'status' => 'active'
                ]
            ];
        }
        
        return ['success' => false];
    }
    
    /**
     * Authenticate seller user
     */
    private function authenticateSeller($email, $password) {
        try {
            $this->ensureConnection();
        } catch (Exception $e) {
            // If database is not available, we can't check if user is banned
            // Return a more specific message for database connection issues
            return [
                'success' => false,
                'message' => 'Database connection error. Please try again later.',
                'error_type' => 'database_error'
            ];
        }
        
        // First check if user exists and get their status
        $stmt = $this->conn->prepare("SELECT * FROM sellers WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            return ['success' => false];
        }
        
        // Check user status BEFORE password verification
        $status = $this->getCanonicalStatus($user);
        
        if ($status === 'banned') {
            return [
                'success' => false,
                'message' => '🚫 Your account has been suspended. Please contact support at support@agrilink.com for assistance.',
                'error_type' => 'account_banned'
            ];
        }
        
        // Now verify password
        if (password_verify($password, $user['password'])) {
            // Update last login
            $this->updateLastLogin('sellers', $user['id']);
            
            $user['role'] = 'seller';
            $user['user_type'] = 'seller';
            
            return [
                'success' => true,
                'message' => 'Login successful',
                'user' => $user
            ];
        }
        
        return ['success' => false];
    }
    
    /**
     * Authenticate customer user
     */
    private function authenticateCustomer($email, $password) {
        try {
            $this->ensureConnection();
        } catch (Exception $e) {
            // If database is not available, we can't check if user is banned
            // Return a more specific message for database connection issues
            return [
                'success' => false,
                'message' => 'Database connection error. Please try again later.',
                'error_type' => 'database_error'
            ];
        }
        
        // First check if user exists and get their status
        $stmt = $this->conn->prepare("SELECT * FROM customers WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            return ['success' => false];
        }
        
        // Check user status BEFORE password verification
        $status = $this->getCanonicalStatus($user);
        
        if ($status === 'banned') {
            return [
                'success' => false,
                'message' => '🚫 Your account has been suspended. Please contact support at support@agrilink.com for assistance.',
                'error_type' => 'account_banned'
            ];
        }
        
        // Now verify password
        if (password_verify($password, $user['password'])) {
            // Update last login
            $this->updateLastLogin('customers', $user['id']);
            
            $user['role'] = 'customer';
            $user['user_type'] = 'customer';
            
            return [
                'success' => true,
                'message' => 'Login successful',
                'user' => $user
            ];
        }
        
        return ['success' => false];
    }
    
    /**
     * Update last login timestamp for user
     */
    private function updateLastLogin($table, $userId) {
        try {
            if (!$this->conn instanceof PDO) {
                return false;
            }
            $stmt = $this->conn->prepare("UPDATE $table SET last_login = NOW() WHERE id = ?");
            return $stmt->execute([$userId]);
        } catch (Exception $e) {
            error_log("Error updating last login: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Check if user is banned
     */
    public function isUserBanned($email, $userType) {
        try {
            $this->ensureConnection();
            $table = ($userType === 'customer') ? 'customers' : 'sellers';
            $stmt = $this->conn->prepare("SELECT status FROM $table WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return $user && ($user['status'] ?? 'active') === 'banned';
        } catch (Exception $e) {
            error_log("Error checking user ban status: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Get user status
     */
    public function getUserStatus($email, $userType) {
        try {
            $this->ensureConnection();
            $table = ($userType === 'customer') ? 'customers' : 'sellers';
            $stmt = $this->conn->prepare("SELECT status FROM $table WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return $user ? ($user['status'] ?? 'active') : 'not_found';
        } catch (Exception $e) {
            error_log("Error getting user status: " . $e->getMessage());
            return 'error';
        }
    }
}
?>



