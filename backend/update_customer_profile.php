<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");

require 'db.php';
require 'Customer.php';

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"), true);

$originalEmail = $data['originalEmail'] ?? '';
$email = $data['email'] ?? '';
$full_name = $data['fullName'] ?? '';
$address = $data['address'] ?? '';
$contactno = $data['contactNumber'] ?? '';
$country = $data['country'] ?? '';

if (empty($originalEmail)) {
    echo json_encode(["success" => false, "message" => "Original email is required"]);
    exit;
}

// Email validation (but we won't update it)
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Invalid email format"]);
    exit;
}

// Contact number validation (7-15 digits)
if (!empty($contactno) && !preg_match('/^\d{7,15}$/', $contactno)) {
    echo json_encode(["success" => false, "message" => "Invalid contact number"]);
    exit;
}

try {
    $customer = new Customer($conn);
    
    // Email cannot be changed - always use original email for updates
    $success = $customer->updateProfile($originalEmail, $full_name, $address, $contactno, $country);
    
    if ($success) {
        echo json_encode([
            "success" => true, 
            "message" => "Profile updated successfully (email cannot be changed)",
            "debug" => "Profile updated for email: " . $originalEmail
        ]);
    } else {
        echo json_encode([
            "success" => false, 
            "message" => "Failed to update profile",
            "debug" => "Update failed for email: " . $originalEmail
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false, 
        "message" => "Database error: " . $e->getMessage(),
        "debug" => "PDO Exception occurred"
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false, 
        "message" => "General error: " . $e->getMessage(),
        "debug" => "General Exception occurred"
    ]);
} 