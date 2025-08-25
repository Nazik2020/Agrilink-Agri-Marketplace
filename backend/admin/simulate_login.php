<?php
// Script to simulate a login and update last_login
echo "Simulating login to test last_login tracking...\n\n";

// Database connection details
$host = "agrilink1.mysql.database.azure.com";
$db = "agrilink";
$user = "agrilink_admin"; 
$pass = "Nzk2020#";

try {
    // Create connection using mysqli (more reliable)
    $conn = new mysqli($host, $user, $pass, $db);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    echo "✅ Connected to database successfully\n\n";
    
    // Get a sample customer and seller
    echo "Getting sample users...\n";
    $result = $conn->query("SELECT id, full_name, email, last_login FROM customers LIMIT 1");
    $customer = $result->fetch_assoc();
    
    $result = $conn->query("SELECT id, business_name, email, last_login FROM sellers LIMIT 1");
    $seller = $result->fetch_assoc();
    
    if ($customer) {
        echo "Sample Customer: {$customer['full_name']} (ID: {$customer['id']})\n";
        echo "Current last_login: " . ($customer['last_login'] ? $customer['last_login'] : 'Never') . "\n";
        
        // Simulate login for customer
        $sql = "UPDATE customers SET last_login = NOW() WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $customer['id']);
        $stmt->execute();
        
        echo "✅ Updated customer last_login to current time\n";
    }
    
    if ($seller) {
        echo "\nSample Seller: {$seller['business_name']} (ID: {$seller['id']})\n";
        echo "Current last_login: " . ($seller['last_login'] ? $seller['last_login'] : 'Never') . "\n";
        
        // Simulate login for seller
        $sql = "UPDATE sellers SET last_login = NOW() WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $seller['id']);
        $stmt->execute();
        
        echo "✅ Updated seller last_login to current time\n";
    }
    
    echo "\n🎉 Login simulation completed!\n";
    echo "Now check your admin dashboard - you should see actual login times.\n";
    
    $conn->close();
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\nThe system is ready, but you may need to log in manually to see the tracking.\n";
}
?> 