<?php
// Database configuration
$host = "127.0.0.1";
$db = "agrilink";
$user = "root";
$pass = "";

function getDbConnection() {
  // Check if PDO MySQL driver is available
  if (!extension_loaded('pdo_mysql')) {
    throw new Exception("PDO MySQL driver is not available. Please install php-mysql extension.");
  }

  // Try local MySQL first, then fall back to Azure
  $attempts = [
    [
      'name' => 'local',
      'dsn' => 'mysql:host=127.0.0.1;dbname=agrilink;charset=utf8mb4',
      'user' => 'root',
      'pass' => ''
    ],
    [
      'name' => 'azure',
      'dsn' => 'mysql:host=agrilink1.mysql.database.azure.com;dbname=agrilink;charset=utf8mb4',
      'user' => 'agrilink_admin',
      'pass' => 'Nzk2020#'
    ]
  ];

  $lastError = null;

  foreach ($attempts as $attempt) {
    try {
      $conn = new PDO($attempt['dsn'], $attempt['user'], $attempt['pass']);
      $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      return $conn;
    } catch (PDOException $e) {
      $lastError = $e;
      continue;
    }
  }

  // If all attempts failed, rethrow the last error
  throw new Exception("Database connection failed: " . ($lastError ? $lastError->getMessage() : 'Unknown error'));
}

// Attempt to create a shared connection but do NOT terminate if it fails
try {
  $conn = getDbConnection();
} catch (Exception $e) {
  // Leave $conn as null; callers should handle lack of connection
  $conn = null;
  error_log("Database connection failed: " . $e->getMessage());
}
?>
