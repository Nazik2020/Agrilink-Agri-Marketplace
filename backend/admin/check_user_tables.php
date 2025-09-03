<?php
require_once '../config/admin_config.php';

try {
    $adminConfig = new AdminConfig();
    $conn = $adminConfig->getConnection();
    
    // Check if customers table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'customers'");
    $customersTableExists = $stmt->rowCount() > 0;
    
    // Check if sellers table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'sellers'");
    $sellersTableExists = $stmt->rowCount() > 0;
    
    echo "=== TABLE EXISTENCE CHECK ===\n";
    echo "Customers table exists: " . ($customersTableExists ? "YES" : "NO") . "\n";
    echo "Sellers table exists: " . ($sellersTableExists ? "YES" : "NO") . "\n\n";
    
    if ($customersTableExists) {
        echo "=== CUSTOMERS TABLE STRUCTURE ===\n";
        $stmt = $conn->query("DESCRIBE customers");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($columns as $column) {
            echo $column['Field'] . " " . $column['Type'] . " " . ($column['Null'] === 'YES' ? 'NULL' : 'NOT NULL');
            if ($column['Key'] === 'PRI') echo " PRIMARY KEY";
            if ($column['Extra']) echo " " . $column['Extra'];
            echo "\n";
        }
        echo "\n";
        
        // Count customers
        $stmt = $conn->query("SELECT COUNT(*) as count FROM customers");
        $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        echo "Total customers: $count\n\n";
    }
    
    if ($sellersTableExists) {
        echo "=== SELLERS TABLE STRUCTURE ===\n";
        $stmt = $conn->query("DESCRIBE sellers");
        $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($columns as $column) {
            echo $column['Field'] . " " . $column['Type'] . " " . ($column['Null'] === 'YES' ? 'NULL' : 'NOT NULL');
            if ($column['Key'] === 'PRI') echo " PRIMARY KEY";
            if ($column['Extra']) echo " " . $column['Extra'];
            echo "\n";
        }
        echo "\n";
        
        // Count sellers
        $stmt = $conn->query("SELECT COUNT(*) as count FROM sellers");
        $count = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        echo "Total sellers: $count\n\n";
    }
    
    // Check for any users in the database
    if ($customersTableExists || $sellersTableExists) {
        $totalUsers = 0;
        if ($customersTableExists) {
            $stmt = $conn->query("SELECT COUNT(*) as count FROM customers");
            $totalUsers += $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        }
        if ($sellersTableExists) {
            $stmt = $conn->query("SELECT COUNT(*) as count FROM sellers");
            $totalUsers += $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        }
        echo "Total users in database: $totalUsers\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>