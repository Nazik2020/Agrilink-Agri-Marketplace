<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require_once "../config/Database.php";
require_once "../models/Product.php";

// Get category ID from query
$category_id = isset($_GET['category_id']) ? intval($_GET['category_id']) : 0;

// Initialize DB and Product
$database = new Database();
$db = $database->connect();

$product = new Product($db);
$products = $product->getByCategory($category_id);

// Return JSON
echo json_encode($products);
?>
