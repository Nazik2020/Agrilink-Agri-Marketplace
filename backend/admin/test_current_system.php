<?php
// Test the current system without last_login columns
echo "Testing current system...\n\n";

try {
    // Test the UserManager query without last_login column
    $host = "agrilink1.mysql.database.azure.com";
    $db = "agrilink";
    $user = "agrilink_admin"; 
    $pass = "Nzk2020#";
    
    // Try to connect and test a simple query
    $conn = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Database connection successful\n\n";
    
    // Test the current query (without last_login)
    echo "Testing current query...\n";
    $sql = "SELECT 
        id, full_name as name, email, COALESCE(status, 'active') as status, created_at, 'customer' as type,
        NULL as last_login,
        (SELECT COUNT(*) FROM orders WHERE customer_id = customers.id) as total_orders
        FROM customers 
        LIMIT 3";
    
    $stmt = $conn->query($sql);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "✅ Query executed successfully\n";
    echo "Found " . count($results) . " customers\n\n";
    
    foreach ($results as $row) {
        echo "- ID: {$row['id']}, Name: {$row['name']}, Last Login: Never\n";
    }
    
    echo "\n🎉 Current system is working!\n";
    echo "The admin dashboard should load without errors.\n";
    echo "All users will show 'Never' for last login until you add the columns.\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\nThe system needs the last_login columns to be added manually.\n";
}
?> 