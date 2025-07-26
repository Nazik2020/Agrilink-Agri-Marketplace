<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['userName'];
$business_name = $data['businessName'];
$business_description = $data['businessDescription'];
$country = $data['country'];
$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_BCRYPT);

try {
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
