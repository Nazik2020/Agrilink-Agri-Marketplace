<?php
// Simple script to add last_login columns using mysqli
echo "Adding last_login columns to database...\n\n";

// Database connection details
$host = "agrilink1.mysql.database.azure.com";
$db = "agrilink";
$user = "agrilink_admin"; 
$pass = "Nzk2020#";

try {
    // Create connection using mysqli
    $conn = new mysqli($host, $user, $pass, $db);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
    echo "✅ Connected to database successfully\n\n";
    
    // Add last_login to customers table
    echo "Adding last_login to customers table...\n";
    $sql = "ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_login DATETIME NULL";
    if ($conn->query($sql) === TRUE) {
        echo "✅ Added last_login to customers table\n";
    } else {
        echo "❌ Error adding to customers: " . $conn->error . "\n";
    }
    
    // Add last_login to sellers table
    echo "Adding last_login to sellers table...\n";
    $sql = "ALTER TABLE sellers ADD COLUMN IF NOT EXISTS last_login DATETIME NULL";
    if ($conn->query($sql) === TRUE) {
        echo "✅ Added last_login to sellers table\n";
    } else {
        echo "❌ Error adding to sellers: " . $conn->error . "\n";
    }
    
    // Verify the columns exist
    echo "\nVerifying columns...\n";
    $result = $conn->query("SHOW COLUMNS FROM customers LIKE 'last_login'");
    if ($result->num_rows > 0) {
        echo "✅ customers.last_login column exists\n";
    } else {
        echo "❌ customers.last_login column missing\n";
    }
    
    $result = $conn->query("SHOW COLUMNS FROM sellers LIKE 'last_login'");
    if ($result->num_rows > 0) {
        echo "✅ sellers.last_login column exists\n";
    } else {
        echo "❌ sellers.last_login column missing\n";
    }
    
    echo "\n🎉 Last login tracking setup completed!\n";
    echo "Now the admin dashboard will show actual login times.\n";
    
    $conn->close();
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\nPlease run this SQL manually in your database:\n";
    echo "ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_login DATETIME NULL;\n";
    echo "ALTER TABLE sellers ADD COLUMN IF NOT EXISTS last_login DATETIME NULL;\n";
}
?> 