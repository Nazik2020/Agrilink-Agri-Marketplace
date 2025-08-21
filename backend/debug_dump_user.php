<?php
require_once 'db.php';

$email = $argv[1] ?? 'banned_test@example.com';

try {
  $conn = getDbConnection();
  $stmt = $conn->prepare('SELECT * FROM customers WHERE email = ?');
  $stmt->execute([$email]);
  $row = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!$row) {
    echo "No customer found for $email\n";
    exit(0);
  }
  foreach ($row as $k => $v) {
    if (is_null($v)) { $v = 'NULL'; }
    echo $k . ': ' . (string)$v . "\n";
  }
} catch (Exception $e) {
  echo 'Error: ' . $e->getMessage() . "\n";
}






