<?php
require_once __DIR__ . '/../db.php';

/**
 * User Status Middleware Class
 * Validates user session and status for protected routes
 */
class UserStatusMiddleware {
    private $conn;
    
    public function __construct() {
        // Do not connect here; defer connection until needed
        $this->conn = null;
    }
    
    private function ensureConnection() {
        if ($this->conn instanceof PDO) {
            return;
        }
        // May throw; caller catch
        $this->conn = getDbConnection();
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
    
    /**
     * Validate user session and status
     * 
     * @param array $userData User data from session
     * @return array Validation result
     */
    public function validateUserSession($userData) {
        try {
            // For admin users, no database validation needed
            if (isset($userData['role']) && $userData['role'] === 'admin') {
                return [
                    'valid' => true,
                    'allowed' => true,
                    'status' => 'active',
                    'message' => 'Admin session valid'
                ];
            }
            
            // For non-admin users, validate against database
            // Determine user type and table
            $userType = $userData['user_type'] ?? $userData['role'] ?? 'customer';
            $table = ($userType === 'seller') ? 'sellers' : 'customers';
            $userId = $userData['id'] ?? null;
            
            if (!$userId) {
                return [
                    'valid' => false,
                    'allowed' => false,
                    'message' => 'User ID not found in session',
                    'error_type' => 'session_invalid'
                ];
            }
            
            // Ensure database connection
            try {
                $this->ensureConnection();
                if (!$this->conn instanceof PDO) {
                    return [
                        'valid' => false,
                        'allowed' => false,
                        'message' => 'Database connection error. Please try again later.',
                        'error_type' => 'database_error'
                    ];
                }
            } catch (Exception $e) {
                return [
                    'valid' => false,
                    'allowed' => false,
                    'message' => 'Database connection error. Please try again later.',
                    'error_type' => 'database_error'
                ];
            }
            
            // Get user from database
            $stmt = $this->conn->prepare("SELECT * FROM $table WHERE id = ?");
            $stmt->execute([$userId]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$user) {
                return [
                    'valid' => false,
                    'allowed' => false,
                    'message' => 'User not found in database',
                    'error_type' => 'user_not_found'
                ];
            }
            
            // Check user status
            $status = $this->getCanonicalStatus($user);
            
            if ($status === 'banned') {
                return [
                    'valid' => false,
                    'allowed' => false,
                    'message' => '🚫 Your account has been suspended. Please contact support at support@agrilink.com for assistance.',
                    'error_type' => 'account_banned'
                ];
            }
            
            return [
                'valid' => true,
                'allowed' => true,
                'status' => $status,
                'message' => 'Session valid'
            ];
            
        } catch (Exception $e) {
            error_log("Session validation error: " . $e->getMessage());
            return [
                'valid' => false,
                'allowed' => false,
                'message' => 'System error occurred during validation',
                'error_type' => 'system_error'
            ];
        }
    }
}
?>