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

// Support both JSON and form-data (for file upload)
if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') === 0) {
    $data = json_decode(file_get_contents("php://input"), true);
    if (is_array($data)) {
        $_POST = $data;
    }
}

// DEBUG: Output all POST and FILES fields for troubleshooting
file_put_contents(__DIR__ . '/debug_update_customer_profile.log', print_r([
    'POST' => $_POST,
    'FILES' => array_map(function($f) { return is_array($f) ? array_keys($f) : $f; }, $_FILES)
], true));

$originalEmail = $_POST['originalEmail'] ?? '';
$email = $_POST['email'] ?? '';
$full_name = $_POST['fullName'] ?? '';
$address = $_POST['address'] ?? '';
$contactno = $_POST['contactNumber'] ?? '';
$country = $_POST['country'] ?? '';
$postal_code = $_POST['postalCode'] ?? '';

// Profile image upload handling
$profile_image_path = null;
$profile_upload_debug = [];
if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] == 0) {
    $target_dir = __DIR__ . "/uploads/customer_profile/";
    $relative_dir = "uploads/customer_profile/";
    if (!is_dir($target_dir)) {
        if (!mkdir($target_dir, 0777, true)) {
            $profile_upload_debug[] = "Failed to create directory: $target_dir";
        } else {
            $profile_upload_debug[] = "Directory created: $target_dir";
        }
    }
    if (!is_writable($target_dir)) {
        $profile_upload_debug[] = "Directory not writable: $target_dir";
    }
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $filetype = mime_content_type($_FILES["profile_image"]["tmp_name"]);
    if (!in_array($filetype, $allowed_types)) {
        $profile_upload_debug[] = "File type not allowed: $filetype";
    } else {
        $file_extension = pathinfo($_FILES["profile_image"]["name"], PATHINFO_EXTENSION);
        $filename = uniqid('profile_', true) . '.' . $file_extension;
        $target_file = $target_dir . $filename;
        $relative_file = $relative_dir . $filename;
        $profile_upload_debug[] = "Attempting to move file to: $target_file";
        if (move_uploaded_file($_FILES["profile_image"]["tmp_name"], $target_file)) {
            $profile_upload_debug[] = "File moved successfully: $target_file";
            $profile_image_path = $relative_file;
        } else {
            $profile_upload_debug[] = "Failed to move file: " . $_FILES["profile_image"]["name"] . " to $target_file";
        }
    }
}

if (empty($originalEmail)) {
    echo json_encode([
        "success" => false,
        "message" => "Original email is required",
        "debug_post" => $_POST,
        "debug_files" => array_keys($_FILES)
    ]);
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

// Postal code validation (3-10 alphanumeric characters, spaces, hyphens)
if (!empty($postal_code) && !preg_match('/^[A-Za-z0-9\- ]{3,10}$/', $postal_code)) {
    echo json_encode(["success" => false, "message" => "Invalid postal code format"]);
    exit;
}

try {
    $customer = new Customer($conn);
    
    // Email cannot be changed - always use original email for updates
    // Pass profile_image_path to updateProfile if available
    $success = $customer->updateProfile($originalEmail, $full_name, $address, $contactno, $country, $postal_code, $profile_image_path);
    if ($success) {
        echo json_encode([
            "success" => true, 
            "message" => "Profile updated successfully (email cannot be changed)",
            "profile_image_path" => $profile_image_path,
            "profile_upload_debug" => $profile_upload_debug,
            "debug" => "Profile updated for email: " . $originalEmail
        ]);
    } else {
        echo json_encode([
            "success" => false, 
            "message" => "Failed to update profile",
            "profile_upload_debug" => $profile_upload_debug,
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