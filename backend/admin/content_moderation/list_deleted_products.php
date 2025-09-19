<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once '../../db.php';

try {
	// PDO version
	if ($conn instanceof PDO) {
		$sql = "SELECT p.*, s.business_name as seller_name FROM products p LEFT JOIN sellers s ON p.seller_id = s.id WHERE p.status = 'deleted' ORDER BY p.updated_at DESC, p.id DESC";
		$stmt = $conn->prepare($sql);
		$stmt->execute();
		$products = $stmt->fetchAll(PDO::FETCH_ASSOC);
	} else {
		// MySQLi version
		$sql = "SELECT p.*, s.business_name as seller_name FROM products p LEFT JOIN sellers s ON p.seller_id = s.id WHERE p.status = 'deleted' ORDER BY p.updated_at DESC, p.id DESC";
		$stmt = $conn->prepare($sql);
		$stmt->execute();
		$result = $stmt->get_result();
		$products = [];
		while ($row = $result->fetch_assoc()) {
			$products[] = $row;
		}
		$stmt->close();
	}

	// Format product images if present
	function format_image_url($image_path) {
		$image_path = preg_replace('#^https?://[^/]+/#', '', $image_path);
		$image_path = ltrim($image_path, '/');
		if (!str_starts_with($image_path, 'uploads/')) {
			$image_path = 'uploads/' . $image_path;
		}
		return "http://localhost/Agrilink-Agri-Marketplace/backend/get_image.php?path=" . urlencode($image_path);
	}
	foreach ($products as &$product) {
		if (isset($product['product_images']) && $product['product_images']) {
			$image_paths = json_decode($product['product_images'], true);
			if (is_array($image_paths)) {
				$product['product_images'] = array_map('format_image_url', $image_paths);
			} else {
				$product['product_images'] = [];
			}
		} else {
			$product['product_images'] = [];
		}
	}

	echo json_encode([
		"success" => true,
		"products" => $products
	]);
} catch (Exception $e) {
	echo json_encode([
		"success" => false,
		"message" => "Server error: " . $e->getMessage()
	]);
}
