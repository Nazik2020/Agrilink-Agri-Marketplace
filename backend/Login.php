<?php

// Include centralized CORS configuration
require_once 'cors_config.php';

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'db.php';

// Get and validate input
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

// Check for JSON parsing errors
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        "success" => false, 
        "message" => "Invalid JSON data: " . json_last_error_msg()
    ]);
    exit;
}

// Validate required fields
if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode([
        "success" => false, 
        "message" => "Email and password are required"
    ]);
    exit;
}

$email = $data['email'];
$password = $data['password'];
$rememberMe = isset($data['rememberMe']) && $data['rememberMe'] === true;

try {
  // Admin login check (hardcoded)
  if ($email === 'agrilink@gmail.com' && $password === 'admin123') {
    // Set session variables for admin
    $_SESSION['user_id'] = 'admin';
    $_SESSION['role'] = 'admin';
    $_SESSION['name'] = 'Admin';
    $_SESSION['email'] = $email;
    
    // Create remember token if requested
    if ($rememberMe) {
      createRememberToken('admin', 'admin');
    }
    
    echo json_encode([
      "success" => true,
      "message" => "Admin login successful",
      "user" => [
        "email" => $email,
        "role" => "admin",
        "user_type" => "admin"
      ]
    ]);
    exit;
  }

  // Try seller first
  $stmt = $conn->prepare("SELECT * FROM sellers WHERE email = ?");
  $stmt->execute([$email]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($user && password_verify($password, $user['password'])) {
    // Only allow active sellers to login
    if (isset($user['status']) && $user['status'] !== 'active') {
      echo json_encode(["success" => false, "message" => "Account is not active."]);
      exit;
    }
    // Format profile picture URL
    $logo_url = null;
    if (!empty($user['business_logo'])) {
      $logo_path = preg_replace('#^https?://[^/]+/#', '', $user['business_logo']);
      $logo_path = ltrim($logo_path, '/');
      if (!str_starts_with($logo_path, 'uploads/')) {
        $logo_path = 'uploads/' . $logo_path;
      }
      $logo_url = "http://localhost/Agrilink-Agri-Marketplace/backend/get_image.php?path=" . urlencode($logo_path);
    }

    // Set session variables
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role'] = 'seller';
    $_SESSION['name'] = $user['business_name'];
    $_SESSION['profile_picture'] = $logo_url;
    $_SESSION['email'] = $user['email'];

    // Create remember token if requested
    if ($rememberMe) {
      createRememberToken($user['id'], 'seller');
    }

    // Create complete user object for frontend
    $userResponse = [
      "id" => $user['id'],
      "name" => $user['business_name'],
      "business_name" => $user['business_name'],
      "username" => $user['business_name'], // For sidebar compatibility
      "email" => $user['email'],
      "phone" => $user['phone'] ?? '',
      "business_address" => $user['business_address'] ?? '',
      "business_description" => $user['business_description'] ?? '',
      "role" => 'seller',
      "user_type" => 'seller',
      "profile_picture" => $logo_url,
      "business_logo" => $logo_url, // For sidebar compatibility
      // Include all seller fields that might be needed
      "business_type" => $user['business_type'] ?? '',
      "tax_id" => $user['tax_id'] ?? '',
      "bank_account" => $user['bank_account'] ?? '',
      "created_at" => $user['created_at'] ?? '',
      "updated_at" => $user['updated_at'] ?? ''
    ];

    // Return formatted user
    echo json_encode([
      "success" => true,
      "message" => "Login successful",
      "user" => $userResponse
    ]);
    exit;
  }

  // Try customer if not found in sellers
  $stmt = $conn->prepare("SELECT * FROM customers WHERE email = ?");
  $stmt->execute([$email]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($user && password_verify($password, $user['password'])) {
    // Only allow active customers to login
    if (isset($user['status']) && $user['status'] !== 'active') {
      echo json_encode(["success" => false, "message" => "Account is not active."]);
      exit;
    }
    // Set session variables
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['role'] = 'customer';
    $_SESSION['name'] = $user['full_name'];
    $_SESSION['email'] = $user['email'];

    // Create remember token if requested
    if ($rememberMe) {
      createRememberToken($user['id'], 'customer');
    }

    // Create complete user object for frontend
    $userResponse = [
      "id" => $user['id'],
      "name" => $user['full_name'],
      "username" => $user['username'] ?? '',
      "email" => $user['email'],
      "phone" => $user['contactno'] ?? '',
      "address" => $user['address'] ?? '',
      "country" => $user['country'] ?? '',
      "postal_code" => $user['postal_code'] ?? '',
      "profile_image" => $user['profile_image'] ?? '',
      "role" => 'customer',
      "user_type" => 'customer',
      "created_at" => $user['created_at'] ?? '',
      "updated_at" => $user['updated_at'] ?? ''
    ];

    // Return formatted user
    echo json_encode([
      "success" => true,
      "message" => "Login successful",
      "user" => $userResponse
    ]);
    exit;
  }

  echo json_encode(["success" => false, "message" => "Invalid credentials"]);
} catch (PDOException $e) {
  error_log("Database error in login.php: " . $e->getMessage());
  echo json_encode([
    "success" => false, 
    "message" => "Database connection error. Please try again later."
  ]);
} catch (Exception $e) {
  error_log("General error in login.php: " . $e->getMessage());
  echo json_encode([
    "success" => false, 
    "message" => "An unexpected error occurred. Please try again."
  ]);
}

/**
 * Create a secure remember token for persistent login
 */
function createRememberToken($userId, $userType) {
  global $conn;
  
  try {
    // Generate secure random token
    $token = bin2hex(random_bytes(32));
    $tokenHash = hash('sha256', $token);
    
    // Set expiration to 30 days from now
    $expiresAt = date('Y-m-d H:i:s', strtotime('+30 days'));
    
    // Delete any existing tokens for this user
    $deleteStmt = $conn->prepare("DELETE FROM remember_tokens WHERE user_id = ? AND user_type = ?");
    $deleteStmt->execute([$userId, $userType]);
    
    // Insert new token
    $insertStmt = $conn->prepare("INSERT INTO remember_tokens (user_id, user_type, token_hash, expires_at) VALUES (?, ?, ?, ?)");
    $insertStmt->execute([$userId, $userType, $tokenHash, $expiresAt]);
    
    // Set secure HTTP-only cookie
    setcookie('remember_token', $token, [
      'expires' => strtotime('+30 days'),
      'path' => '/',
      'domain' => '', // Empty domain allows subdomains and ports
      'secure' => false, // Set to true in production with HTTPS
      'httponly' => true,
      'samesite' => 'Lax'
    ]);
    
    return true;
  } catch (Exception $e) {
    error_log("Error creating remember token: " . $e->getMessage());
    return false;
  }
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