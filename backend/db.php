<?php
// $host = "localhost";
// $db = "agrilink";
// $user = "root";
// $pass = "";



$host = "agrilink1.mysql.database.azure.com";
$db = "agrilink";
$user = "agrilink_admin"; 
$pass = "Nzk2020#";

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

try {
  $conn = getDbConnection();
} catch (Exception $e) {
  die(json_encode(["success" => false, "message" => $e->getMessage()]));
}
?>
