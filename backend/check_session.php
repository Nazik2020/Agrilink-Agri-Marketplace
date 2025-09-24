<?php
/**
 * Session Check Endpoint - Check if user is logged in via session or remember token
 * Used for auto-login functionality across tabs/windows
 */

// Include centralized CORS configuration
require_once 'cors_config.php';

require 'db.php';

try {
  // Helper: build complete user payload from DB based on role
  $buildUserPayload = function($role, $userId) use ($conn) {
    if ($role === 'customer') {
      $stmt = $conn->prepare("SELECT id, full_name, email, profile_image, address, contactno, country, postal_code FROM customers WHERE id = ? LIMIT 1");
      $stmt->execute([$userId]);
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      if ($row) {
        return [
          'id' => $row['id'],
          'role' => 'customer',
          'full_name' => $row['full_name'] ?? '',
          'email' => $row['email'] ?? '',
          'profile_image' => $row['profile_image'] ?? null,
          'address' => $row['address'] ?? '',
          'contactno' => $row['contactno'] ?? '',
          'country' => $row['country'] ?? '',
          'postal_code' => $row['postal_code'] ?? ''
        ];
      }
    }
    if ($role === 'seller') {
      $stmt = $conn->prepare("SELECT id, business_name, email, business_logo FROM sellers WHERE id = ? LIMIT 1");
      $stmt->execute([$userId]);
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      if ($row) {
        return [
          'id' => $row['id'],
          'role' => 'seller',
          'business_name' => $row['business_name'] ?? '',
          'email' => $row['email'] ?? '',
          // normalize to profile_image so frontends that expect it can use it
          'profile_image' => $row['business_logo'] ?? null
        ];
      }
    }
    if ($role === 'admin') {
      return [
        'id' => 'admin',
        'role' => 'admin',
        'full_name' => 'Admin',
        'email' => 'agrilink@gmail.com',
        'profile_image' => null
      ];
    }
    return null;
  };

  // Check if user is already logged in via session
  if (isset($_SESSION['user_id']) && isset($_SESSION['role'])) {
    $userId = $_SESSION['user_id'];
    $role = $_SESSION['role'];

    $userPayload = $buildUserPayload($role, $userId);
    if (!$userPayload) {
      // Fallback minimal payload from session
      $userPayload = [
        'id' => $userId,
        'role' => $role,
        'full_name' => $_SESSION['name'] ?? '',
        'email' => $_SESSION['email'] ?? '',
        'profile_image' => null
      ];
    }

    echo json_encode([
      'success' => true,
      'logged_in' => true,
      'user' => $userPayload
    ]);
    exit;
  }
  
  // If no session, try to restore from remember token
  if (verifyRememberToken()) {
    $userId = $_SESSION['user_id'];
    $role = $_SESSION['role'];

    $userPayload = $buildUserPayload($role, $userId);
    if (!$userPayload) {
      $userPayload = [
        'id' => $userId,
        'role' => $role,
        'full_name' => $_SESSION['name'] ?? '',
        'email' => $_SESSION['email'] ?? '',
        'profile_image' => null
      ];
    }

    echo json_encode([
      'success' => true,
      'logged_in' => true,
      'auto_logged_in' => true,
      'user' => $userPayload
    ]);
    exit;
  }
  
  // No valid session or remember token
  echo json_encode([
    "success" => true,
    "logged_in" => false
  ]);
  
} catch (Exception $e) {
  error_log("Session check error: " . $e->getMessage());
  echo json_encode([
    "success" => false,
    "message" => "Session check failed"
  ]);
}

/**
 * Verify remember token and create session if valid
 */
function verifyRememberToken() {
  global $conn;
  
  if (!isset($_COOKIE['remember_token'])) {
    return false;
  }
  
  try {
    $token = $_COOKIE['remember_token'];
    $tokenHash = hash('sha256', $token);
    
    // Find valid token
    $stmt = $conn->prepare("SELECT user_id, user_type FROM remember_tokens WHERE token_hash = ? AND expires_at > NOW()");
    $stmt->execute([$tokenHash]);
    $tokenData = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$tokenData) {
      // Token is invalid or expired, clear cookie
      setcookie('remember_token', '', time() - 3600, '/');
      return false;
    }
    
    // Get user data based on type
    $userId = $tokenData['user_id'];
    $userType = $tokenData['user_type'];
    
    if ($userType === 'admin') {
      // Admin login
      $_SESSION['user_id'] = 'admin';
      $_SESSION['role'] = 'admin';
      $_SESSION['name'] = 'Admin';
      $_SESSION['email'] = 'agrilink@gmail.com';
      return true;
    } elseif ($userType === 'seller') {
      // Get seller data
      $stmt = $conn->prepare("SELECT * FROM sellers WHERE id = ?");
      $stmt->execute([$userId]);
      $user = $stmt->fetch(PDO::FETCH_ASSOC);
      
      if ($user) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = 'seller';
        $_SESSION['name'] = $user['business_name'];
        $_SESSION['email'] = $user['email'];
        return true;
      }
    } elseif ($userType === 'customer') {
      // Get customer data
      $stmt = $conn->prepare("SELECT * FROM customers WHERE id = ?");
      $stmt->execute([$userId]);
      $user = $stmt->fetch(PDO::FETCH_ASSOC);
      
      if ($user) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = 'customer';
        $_SESSION['name'] = $user['full_name'];
        $_SESSION['email'] = $user['email'];
        return true;
      }
    }
    
    return false;
  } catch (Exception $e) {
    error_log("Error verifying remember token: " . $e->getMessage());
    return false;
  }
}
?>
