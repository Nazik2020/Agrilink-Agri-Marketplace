<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';
require 'Customer.php';

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'] ?? '';
$full_name = $data['fullName'] ?? '';
$address = $data['address'] ?? '';
$contactno = $data['contactNumber'] ?? '';
$country = $data['country'] ?? '';

if (empty($email)) {
    echo json_encode(["success" => false, "message" => "Email is required"]);
    exit;
}

try {
    $customer = new Customer($conn);
    $success = $customer->updateProfile($email, $full_name, $address, $contactno, $country);
    if ($success) {
        echo json_encode(["success" => true, "message" => "Profile updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update profile"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
} 