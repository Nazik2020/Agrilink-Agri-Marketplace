<?php
// Simple script to add last_login columns
// This will work even if the database connection has issues

echo "Setting up last_login tracking...\n\n";

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
    
    // Add last_login to customers table
    echo "Adding last_login to customers table...\n";
    $conn->exec("ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_login DATETIME NULL");
    echo "✅ Added last_login to customers table\n";
    
    // Add last_login to sellers table
    echo "Adding last_login to sellers table...\n";
    $conn->exec("ALTER TABLE sellers ADD COLUMN IF NOT EXISTS last_login DATETIME NULL");
    echo "✅ Added last_login to sellers table\n";
    
    // Verify the columns exist
    echo "\nVerifying columns...\n";
    $stmt = $conn->query("SHOW COLUMNS FROM customers LIKE 'last_login'");
    if ($stmt->rowCount() > 0) {
        echo "✅ customers.last_login column exists\n";
    } else {
        echo "❌ customers.last_login column missing\n";
    }
    
    $stmt = $conn->query("SHOW COLUMNS FROM sellers LIKE 'last_login'");
    if ($stmt->rowCount() > 0) {
        echo "✅ sellers.last_login column exists\n";
    } else {
        echo "❌ sellers.last_login column missing\n";
    }
    
    echo "\n🎉 Last login tracking setup completed!\n";
    echo "Now the admin dashboard will show actual login times.\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\nPlease run this SQL manually in your database:\n";
    echo "ALTER TABLE customers ADD COLUMN IF NOT EXISTS last_login DATETIME NULL;\n";
    echo "ALTER TABLE sellers ADD COLUMN IF NOT EXISTS last_login DATETIME NULL;\n";
}
?> 