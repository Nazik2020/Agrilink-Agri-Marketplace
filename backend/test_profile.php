<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';
require 'Customer.php';

echo "<h2>Database Connection Test</h2>";

try {
    // Test database connection
    echo "<p>✅ Database connection successful</p>";
    
    // Test if customers table exists and has the right structure
    $stmt = $conn->prepare("DESCRIBE customers");
    $stmt->execute();
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h3>Customers Table Structure:</h3>";
    echo "<ul>";
    foreach ($columns as $column) {
        echo "<li>{$column['Field']} - {$column['Type']}</li>";
    }
    echo "</ul>";
    
    // Test if there are any customers in the database
    $stmt = $conn->prepare("SELECT COUNT(*) as count FROM customers");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo "<p>Total customers in database: {$result['count']}</p>";
    
    // Show sample customer data
    $stmt = $conn->prepare("SELECT id, full_name, email, address, contactno, country FROM customers LIMIT 3");
    $stmt->execute();
    $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "<h3>Sample Customer Data:</h3>";
    echo "<pre>";
    print_r($customers);
    echo "</pre>";
    
    // Test the Customer class
    if (!empty($customers)) {
        $testEmail = $customers[0]['email'];
        echo "<h3>Testing Customer Class with email: {$testEmail}</h3>";
        
        $customer = new Customer($conn);
        $profile = $customer->getByEmail($testEmail);
        
        echo "<p>Profile data retrieved:</p>";
        echo "<pre>";
        print_r($profile);
        echo "</pre>";
    }
    
} catch (PDOException $e) {
    echo "<p>❌ Database error: " . $e->getMessage() . "</p>";
} catch (Exception $e) {
    echo "<p>❌ General error: " . $e->getMessage() . "</p>";
}
?> 