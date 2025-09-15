<?php
require 'db.php';

echo "=== CUSTOMER PROFILE ANALYSIS ===\n";

// Check all customers and their profile completeness
$stmt = $conn->query("SELECT id, full_name, email, address, contactno, country, postal_code FROM customers");
$customers = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo "Total customers: " . count($customers) . "\n\n";

foreach ($customers as $customer) {
    echo "Customer ID: " . $customer['id'] . "\n";
    echo "Name: " . ($customer['full_name'] ?: '[EMPTY]') . "\n";
    echo "Email: " . ($customer['email'] ?: '[EMPTY]') . "\n";
    echo "Address: " . ($customer['address'] ?: '[EMPTY]') . "\n";
    echo "Contact: " . ($customer['contactno'] ?: '[EMPTY]') . "\n";
    echo "Country: " . ($customer['country'] ?: '[EMPTY]') . "\n";
    echo "Postal Code: " . ($customer['postal_code'] ?: '[EMPTY]') . "\n";
    
    // Check completeness
    $complete = !empty($customer['full_name']) && !empty($customer['email']);
    $hasAddress = !empty($customer['address']) && !empty($customer['postal_code']);
    
    echo "Profile Status: " . ($complete ? "COMPLETE (name+email)" : "INCOMPLETE") . "\n";
    echo "Address Info: " . ($hasAddress ? "AVAILABLE" : "MISSING") . "\n";
    echo "Can Proceed Payment: " . ($complete ? "YES" : "NO") . "\n";
    echo "Auto-fill Level: " . ($hasAddress ? "FULL" : "PARTIAL") . "\n";
    echo str_repeat("-", 50) . "\n";
}

echo "\n=== SIGNUP FORM ANALYSIS ===\n";

// Check what fields are collected during signup
echo "Checking SignupCustomer.php to see what fields are saved...\n";
?>
