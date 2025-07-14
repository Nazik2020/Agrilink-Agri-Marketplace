<?php
$host = "localhost";
$db = "agrilink";
$user = "root";
$pass = "";

try {
  $conn = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  die(json_encode(["success" => false, "message" => "Connection failed: " . $e->getMessage()]));
}
?>
