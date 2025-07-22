<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db.php';
require_once 'Product.php';

$product = new Product($conn);

// Use $_POST for text fields and $_FILES for image
$seller_id = $_POST['seller_id'];
$product_name = $_POST['product_name'];
$product_description = $_POST['product_description'];
$price = $_POST['price'];
$special_offer = $_POST['special_offer'] ?? null;
$category = $_POST['category'];

$image_path = null;
if (isset($_FILES['product_image']) && $_FILES['product_image']['error'] == 0) {
    $target_dir = "uploads/products/";
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }
    $target_file = $target_dir . basename($_FILES["product_image"]["name"]);
    if (move_uploaded_file($_FILES["product_image"]["tmp_name"], $target_file)) {
        $image_path = $target_file;
    }
}

$success = $product->addProduct(
    $seller_id,
    $product_name,
    $product_description,
    $price,
    $special_offer,
    $image_path,
    $category
);

echo json_encode(["success" => $success]);

