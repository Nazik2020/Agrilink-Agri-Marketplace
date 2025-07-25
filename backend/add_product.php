<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db.php';
require_once 'Product.php';

$product = new Product($conn);

// Use $_POST for text fields and $_FILES for image

$seller_id = isset($_POST['seller_id']) ? $_POST['seller_id'] : null;
$product_name = isset($_POST['product_name']) ? $_POST['product_name'] : null;
$product_description = isset($_POST['product_description']) ? $_POST['product_description'] : null;
$price = isset($_POST['price']) ? $_POST['price'] : null;
$special_offer = isset($_POST['special_offer']) ? $_POST['special_offer'] : null;
$category = isset($_POST['category']) ? $_POST['category'] : null;


// Handle multiple image uploads
$image_paths = [];
if (isset($_FILES['product_images'])) {
    $target_dir = "uploads/products/";
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }
    $files = $_FILES['product_images'];
    for ($i = 0; $i < count($files['name']); $i++) {
        if ($files['error'][$i] === 0) {
            $filename = uniqid() . '_' . basename($files['name'][$i]);
            $target_file = $target_dir . $filename;
            if (move_uploaded_file($files['tmp_name'][$i], $target_file)) {
                $image_paths[] = $target_file;
            }
        }
    }
}
$image_paths_json = json_encode($image_paths);



$success = false;
$errorInfo = null;
try {
    $success = $product->addProduct(
        $seller_id,
        $product_name,
        $product_description,
        $price,
        $special_offer,
        $image_paths_json,
        $category
    );
    if (!$success && isset($product->conn)) {
        $errorInfo = $product->conn->errorInfo();
    }
} catch (Exception $e) {
    $errorInfo = $e->getMessage();
}

echo json_encode([
    "success" => $success,
    "error" => $errorInfo,
    "debug" => [
        "seller_id" => $seller_id,
        "product_name" => $product_name,
        "product_description" => $product_description,
        "price" => $price,
        "special_offer" => $special_offer,
        "category" => $category,
        "image_paths_json" => $image_paths_json,
        "_POST" => $_POST,
        "_FILES" => $_FILES
    ]
]);
