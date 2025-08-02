<?php
require 'db.php';

try {
    echo "Connected to database\n";
    
    $stmt = $conn->query('SELECT id, full_name, email, address, country, postal_code FROM customers LIMIT 10');
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Found " . count($results) . " customers:\n";
    echo "================================\n";
    
    foreach($results as $customer) {
        echo "ID: " . $customer['id'] . "\n";
        echo "Name: " . ($customer['full_name'] ?: 'N/A') . "\n";
        echo "Email: " . ($customer['email'] ?: 'N/A') . "\n";
        echo "Address: " . ($customer['address'] ?: 'N/A') . "\n";
        echo "Country: " . ($customer['country'] ?: 'N/A') . "\n";
        echo "Postal Code: " . ($customer['postal_code'] ?: 'N/A') . "\n";
        echo "------------------------\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
