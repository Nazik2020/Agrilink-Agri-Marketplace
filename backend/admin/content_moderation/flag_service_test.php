<?php
require_once __DIR__ . '/FlagService.php';
require_once __DIR__ . '/../../db.php';

try {
  $conn = getDbConnection();
  echo "DB OK\n";

  // Prepare a test customer and seller if needed
  $customerEmail = 'flag_test_customer@example.com';
  $sellerEmail = 'flag_test_seller@example.com';

  // Ensure customer exists
  $conn->exec("CREATE TABLE IF NOT EXISTS customers_like (id INT) "); // no-op to keep script simple

  $stmt = $conn->prepare('SELECT id FROM customers WHERE email = ?');
  $stmt->execute([$customerEmail]);
  $customerId = $stmt->fetchColumn();
  if (!$customerId) {
    $pwd = password_hash('test123', PASSWORD_BCRYPT);
    $conn->prepare('INSERT INTO customers (full_name, email, password, status) VALUES (?,?,?,"active")')->execute(['Flag Test', $customerEmail, $pwd]);
    $customerId = $conn->lastInsertId();
  }

  // Ensure seller exists
  $stmt = $conn->prepare('SELECT id FROM sellers WHERE email = ?');
  $stmt->execute([$sellerEmail]);
  $sellerId = $stmt->fetchColumn();
  if (!$sellerId) {
    $pwd = password_hash('test123', PASSWORD_BCRYPT);
    $conn->prepare('INSERT INTO sellers (full_name, email, password, status) VALUES (?,?,?,"active")')->execute(['Flag Seller', $sellerEmail, $pwd]);
    $sellerId = $conn->lastInsertId();
  }

  $service = new FlagService();
  $r1 = $service->createFlag((int)$customerId, (int)$sellerId, null, 'Inappropriate content', 'Test reason');
  var_dump($r1);
  $r2 = $service->createFlag((int)$customerId, (int)$sellerId, null, 'Inappropriate content', 'Test reason');
  var_dump($r2);

} catch (Throwable $e) {
  echo 'Error: ' . $e->getMessage() . "\n";
}
