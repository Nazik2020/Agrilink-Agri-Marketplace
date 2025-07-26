<?php
$host = "localhost";
$db = "agrilink";
$user = "root";
$pass = "";

function getDbConnection() {
  global $host, $db, $user, $pass;
  try {
    $conn = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $conn;
  } catch (PDOException $e) {
    throw new Exception("Connection failed: " . $e->getMessage());
  }
}

// Legacy support - create global connection
try {
  $conn = getDbConnection();
} catch (Exception $e) {
  die(json_encode(["success" => false, "message" => $e->getMessage()]));
}
?>
