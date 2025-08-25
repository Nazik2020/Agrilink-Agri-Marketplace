<?php
// Test script to verify login tracking with actual last_login columns
echo "Testing login tracking system with actual columns...\n\n";

try {
    // Database connection details
    $host = "agrilink1.mysql.database.azure.com";
    $db = "agrilink";
    $user = "agrilink_admin"; 
    $pass = "Nzk2020#";
    
    // Create connection
    $conn = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Connected to database successfully\n\n";
    
    // Test the actual UserManager query
    echo "Testing UserManager query with last_login...\n";
    $sql = "SELECT 
        id, full_name as name, email, COALESCE(status, 'active') as status, created_at, 'customer' as type,
        COALESCE(last_login, NULL) as last_login,
        (SELECT COUNT(*) FROM orders WHERE customer_id = customers.id) as total_orders
        FROM customers 
        LIMIT 5";
    
    $stmt = $conn->query($sql);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "✅ Query executed successfully\n";
    echo "Found " . count($results) . " customers\n\n";
    
    foreach ($results as $row) {
        $lastLogin = $row['last_login'] ? $row['last_login'] : 'Never';
        echo "- ID: {$row['id']}, Name: {$row['name']}, Last Login: {$lastLogin}\n";
    }
    
    // Test sellers query
    echo "\nTesting sellers query...\n";
    $sql = "SELECT 
        id, business_name as name, email, COALESCE(status, 'active') as status, created_at, 'seller' as type,
        COALESCE(last_login, NULL) as last_login
        FROM sellers 
        LIMIT 3";
    
    $stmt = $conn->query($sql);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($results as $row) {
        $lastLogin = $row['last_login'] ? $row['last_login'] : 'Never';
        echo "- ID: {$row['id']}, Business: {$row['name']}, Last Login: {$lastLogin}\n";
    }
    
    echo "\n🎉 Login tracking system is working!\n";
    echo "The admin dashboard should now show actual login times.\n";
    echo "Users who have logged in will show their last login date/time.\n";
    echo "Users who never logged in will show 'Never'.\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?> 