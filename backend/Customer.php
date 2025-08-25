<?php
class Customer {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getByEmail($email) {
        try {
            $stmt = $this->conn->prepare("SELECT full_name, email, address, contactno, country, postal_code, profile_image FROM customers WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error in getByEmail: " . $e->getMessage());
            return false;
        }
    }

    public function updateProfile($email, $full_name, $address, $contactno, $country, $postal_code = '', $profile_image = null) {
        try {
            if ($profile_image) {
                $stmt = $this->conn->prepare("UPDATE customers SET full_name = ?, address = ?, contactno = ?, country = ?, postal_code = ?, profile_image = ?, updated_at = NOW() WHERE email = ?");
                return $stmt->execute([$full_name, $address, $contactno, $country, $postal_code, $profile_image, $email]);
            } else {
                $stmt = $this->conn->prepare("UPDATE customers SET full_name = ?, address = ?, contactno = ?, country = ?, postal_code = ?, updated_at = NOW() WHERE email = ?");
                return $stmt->execute([$full_name, $address, $contactno, $country, $postal_code, $email]);
            }
        } catch (PDOException $e) {
            error_log("Error in updateProfile: " . $e->getMessage());
            return false;
        }
    }
} 