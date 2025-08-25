<?php
// Test script to verify login tracking system
echo "Testing login tracking system...\n\n";

// Database connection details
$host = "agrilink1.mysql.database.azure.com";
$db = "agrilink";
$user = "agrilink_admin"; 
$pass = "Nzk2020#";

try {
    // Create connection
    $conn = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "✅ Connected to database successfully\n\n";
    
    // Check if last_login columns exist
    echo "Checking database structure...\n";
    
    $stmt = $conn->query("SHOW COLUMNS FROM customers LIKE 'last_login'");
    $customerHasLastLogin = $stmt->rowCount() > 0;
    echo "Customers table has last_login: " . ($customerHasLastLogin ? "✅ Yes" : "❌ No") . "\n";
    
    $stmt = $conn->query("SHOW COLUMNS FROM sellers LIKE 'last_login'");
    $sellerHasLastLogin = $stmt->rowCount() > 0;
    echo "Sellers table has last_login: " . ($sellerHasLastLogin ? "✅ Yes" : "❌ No") . "\n";
    
    if (!$customerHasLastLogin || !$sellerHasLastLogin) {
        echo "\n⚠️  Last login columns are missing!\n";
        echo "Please run this SQL in your database:\n";
        echo "ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_login DATETIME NULL;\n";
        echo "ALTER TABLE sellers ADD COLUMN IF NOT EXISTS last_login DATETIME NULL;\n";
        echo "\nAfter adding the columns, the login tracking will work properly.\n";
    } else {
        echo "\n✅ Last login columns exist!\n";
        
        // Show sample data
        echo "\nSample customer data:\n";
        $stmt = $conn->query("SELECT id, full_name, email, last_login FROM customers LIMIT 3");
        $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($customers as $customer) {
            echo "- ID: {$customer['id']}, Name: {$customer['full_name']}, Last Login: " . 
                 ($customer['last_login'] ? $customer['last_login'] : 'Never') . "\n";
        }
        
        echo "\nSample seller data:\n";
        $stmt = $conn->query("SELECT id, business_name, email, last_login FROM sellers LIMIT 3");
        $sellers = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($sellers as $seller) {
            echo "- ID: {$seller['id']}, Business: {$seller['business_name']}, Last Login: " . 
                 ($seller['last_login'] ? $seller['last_login'] : 'Never') . "\n";
        }
        
        echo "\n🎉 Login tracking system is ready!\n";
        echo "Now when users log in, their last_login will be updated.\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\nPlease add the last_login columns manually to your database.\n";
}
?> 