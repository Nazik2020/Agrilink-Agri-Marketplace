<?php
/**
 * Logout Endpoint - Clear session and remember tokens
 */

// Include centralized CORS configuration
require_once 'cors_config.php';

require 'db.php';

// Start session BEFORE touching $_SESSION
if (session_status() === PHP_SESSION_NONE) {
  session_start();
}

try {
  // Clear remember token if it exists
  if (isset($_COOKIE['remember_token'])) {
    $token = $_COOKIE['remember_token'];
    $tokenHash = hash('sha256', $token);
    
    // Delete token from database
    $stmt = $conn->prepare("DELETE FROM remember_tokens WHERE token_hash = ?");
    $stmt->execute([$tokenHash]);
    
    // Clear the HTTP-only cookie using matching attributes
    setcookie('remember_token', '', [
      'expires' => time() - 3600,
      'path' => '/',
      'domain' => '',
      'secure' => false,
      'httponly' => true,
      'samesite' => 'Lax'
    ]);
  }
  
  // Clear all remember tokens for current user if session exists
  if (isset($_SESSION['user_id']) && isset($_SESSION['role'])) {
    $userId = $_SESSION['user_id'];
    $userType = $_SESSION['role'];
    
    // Delete all tokens for this user
    $stmt = $conn->prepare("DELETE FROM remember_tokens WHERE user_id = ? AND user_type = ?");
    $stmt->execute([$userId, $userType]);
  }
  
  // Destroy session
  $_SESSION = [];
  // Proactively remove all tokens for the user if known
  if (isset($userId) && isset($userType)) {
    try {
      $stmt = $conn->prepare("DELETE FROM remember_tokens WHERE user_id = ? AND user_type = ?");
      $stmt->execute([$userId, $userType]);
    } catch (Exception $e) {}
  }
  if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
  }
  session_destroy();
  
  // CORS is handled globally in cors_config.php

  echo json_encode([
    "success" => true,
    "message" => "Logged out successfully"
  ]);
  
} catch (Exception $e) {
  error_log("Logout error: " . $e->getMessage());
  echo json_encode([
    "success" => false,
    "message" => "Logout failed"
  ]);
}
?>
