<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db.php';

$seller_id = $_POST['seller_id'];
$business_name = $_POST['business_name'];
$business_description = $_POST['business_description'];
$country = $_POST['country'];
$email = $_POST['email'];

$logo_path = null;
if (isset($_FILES['business_logo']) && $_FILES['business_logo']['error'] == 0) {
    $target_dir = "uploads/logos/";
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }
    $target_file = $target_dir . basename($_FILES["business_logo"]["name"]);
    if (move_uploaded_file($_FILES["business_logo"]["tmp_name"], $target_file)) {
        $logo_path = $target_file;
    }
}

try {
    if ($logo_path) {
        $sql = "UPDATE sellers SET business_name=?, business_description=?, country=?, email=?, business_logo=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $result = $stmt->execute([$business_name, $business_description, $country, $email, $logo_path, $seller_id]);
    } else {
        $sql = "UPDATE sellers SET business_name=?, business_description=?, country=?, email=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $result = $stmt->execute([$business_name, $business_description, $country, $email, $seller_id]);
    }
    echo json_encode(["success" => $result]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}

