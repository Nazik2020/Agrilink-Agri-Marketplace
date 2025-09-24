<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);


// Validate required fields
if (
  empty($data['userName']) ||
  empty($data['businessName']) ||
  empty($data['businessDescription']) ||
  empty($data['country']) ||
  empty($data['email']) ||
  empty($data['password'])
) {
  echo json_encode(["success" => false, "message" => "All fields are required."]);
  exit;
}

$username = $data['userName'];
$business_name = $data['businessName'];
$business_description = $data['businessDescription'];
$country = $data['country'];
$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_BCRYPT);

try {
  // Cross-table uniqueness: prevent email reuse across sellers and customers
  $check = $conn->prepare("SELECT 1 FROM sellers WHERE email = ? UNION ALL SELECT 1 FROM customers WHERE email = ? LIMIT 1");
  $check->execute([$email, $email]);
  if ($check->fetch()) {
    echo json_encode(["success" => false, "message" => "Email already exists"]);
    exit;
  }

  $stmt = $conn->prepare("INSERT INTO sellers (username, business_name, business_description, country, email, password)
                          VALUES (?, ?, ?, ?, ?, ?)");
  $stmt->execute([$username, $business_name, $business_description, $country, $email, $password]);
  echo json_encode(["success" => true, "message" => "Seller registered successfully"]);
} catch (PDOException $e) {
  if ($e->getCode() == 23000) {
    echo json_encode(["success" => false, "message" => "Email already exists"]);
  } else {
    echo json_encode(["success" => false, "message" => "Registration failed: " . $e->getMessage()]);
  }
}
?>
