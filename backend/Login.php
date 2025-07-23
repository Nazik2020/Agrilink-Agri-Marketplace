<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'];
$password = $data['password'];

try {


// Try seller first
$stmt = $conn->prepare("SELECT * FROM sellers WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password'])) {
  $user['role'] = 'seller';
  echo json_encode(["success" => true, "message" => "Login successful", "user" => $user]);
  exit;
}

// Try customer if not found in sellers
$stmt = $conn->prepare("SELECT * FROM customers WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($password, $user['password'])) {
  $user['role'] = 'customer';
  echo json_encode(["success" => true, "message" => "Login successful", "user" => $user]);
  exit;
}

echo json_encode(["success" => false, "message" => "Invalid credentials"]);
} catch (PDOException $e) {
  echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>


