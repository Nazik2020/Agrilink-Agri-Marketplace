<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

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

try {
  // Admin login check (hardcoded)
  if ($email === 'agrilink@gmail.com' && $password === 'admin123') {
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
    $user['role'] = 'seller';
    $user['user_type'] = 'seller';
    echo json_encode(["success" => true, "message" => "Login successful", "user" => $user]);
    exit;
  }

  // Try customer if not found in sellers
  $stmt = $conn->prepare("SELECT * FROM customers WHERE email = ?");
  $stmt->execute([$email]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($user && password_verify($password, $user['password'])) {
    $user['role'] = 'customer';
    $user['user_type'] = 'customer';
    echo json_encode(["success" => true, "message" => "Login successful", "user" => $user]);
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
?>