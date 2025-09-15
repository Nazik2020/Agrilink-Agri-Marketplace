<?php
class User {
    protected $conn;
    protected $table;

    public function __construct($conn, $table) {
        $this->conn = $conn;
        $this->table = $table;
    }

    public function findByEmail($email) {
        $stmt = $this->conn->prepare("SELECT * FROM {$this->table} WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function create($data) {
        if ($this->table === 'sellers') {
            $stmt = $this->conn->prepare("INSERT INTO sellers (username, business_name, business_description, country, email, password) VALUES (?, ?, ?, ?, ?, ?)");
            return $stmt->execute([
                $data['userName'],
                $data['businessName'],
                $data['businessDescription'],
                $data['country'],
                $data['email'],
                password_hash($data['password'], PASSWORD_BCRYPT)
            ]);
        } elseif ($this->table === 'customers') {
            $stmt = $this->conn->prepare("INSERT INTO customers (full_name, username, email, password, address, contactno, country, postal_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            return $stmt->execute([
                $data['fullName'],
                $data['userName'],
                $data['email'],
                password_hash($data['password'], PASSWORD_BCRYPT),
                $data['address'] ?? '',
                $data['contactno'] ?? '',
                $data['country'] ?? '',
                $data['postal_code'] ?? ''
            ]);
        }
        return false;
    }
} 