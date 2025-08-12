<?php
require_once '../db.php';

echo "Setting up Admin Dashboard System...\n\n";

try {
    $conn = getDbConnection();
    
    // Read and execute the SQL file
    $sqlFile = 'create_admin_tables.sql';
    if (file_exists($sqlFile)) {
        $sql = file_get_contents($sqlFile);
        
        // Split SQL into individual statements
        $statements = array_filter(array_map('trim', explode(';', $sql)));
        
        foreach ($statements as $statement) {
            if (!empty($statement)) {
                try {
                    $conn->exec($statement);
                    echo "✅ Executed: " . substr($statement, 0, 50) . "...\n";
                } catch (PDOException $e) {
                    echo "⚠️  Warning: " . $e->getMessage() . "\n";
                }
            }
        }
        
        echo "\n✅ Admin system setup completed!\n";
        echo "\n📋 Next steps:\n";
        echo "1. Test the API endpoints using the test file: backend/admin/user_management/test_user_management.html\n";
        echo "2. Access your admin dashboard and check the User Management tab\n";
        echo "3. The system will now show real users from your database\n";
        
    } else {
        echo "❌ SQL file not found: $sqlFile\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error setting up admin system: " . $e->getMessage() . "\n";
}
?> 