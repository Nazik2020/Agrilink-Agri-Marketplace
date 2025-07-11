<?php
class Database {
    private $host = "localhost";
    private $db = "agrilink";
    private $user = "root";
    private $pass = "";
    public $conn;

    public function __construct() {
        try {
            $this->conn = new PDO("mysql:host=$this->host;dbname=$this->db;charset=utf8mb4", $this->user, $this->pass);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die(json_encode(["success" => false, "message" => "Connection failed: " . $e->getMessage()]));
        }
    }
}
?>
