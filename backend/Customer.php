<?php
class Customer {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getByEmail($email) {
        $stmt = $this->conn->prepare("SELECT full_name, email, address, contactno, country FROM customers WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function updateProfile($email, $full_name, $address, $contactno, $country) {
        $stmt = $this->conn->prepare("UPDATE customers SET full_name = ?, address = ?, contactno = ?, country = ? WHERE email = ?");
        return $stmt->execute([$full_name, $address, $contactno, $country, $email]);
    }
} 