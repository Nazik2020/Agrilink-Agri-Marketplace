<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';
require 'User.php';

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['userName'] ?? '';
$business_name = $data['businessName'] ?? '';
$business_description = $data['businessDescription'] ?? '';
$country = $data['country'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

if (empty($username) || empty($business_name) || empty($business_description) || empty($country) || empty($email) || empty($password)) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

$db = new Database();
$seller = new User($db->conn, "sellers");

try {
    $seller->create($data);
    echo json_encode(["success" => true, "message" => "Seller registered successfully"]);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) {
        echo json_encode(["success" => false, "message" => "Email already exists"]);
    } else {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
}
