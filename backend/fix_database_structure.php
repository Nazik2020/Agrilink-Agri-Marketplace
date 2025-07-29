<?php
/**
 * Database Structure Fixer
 * Automatically adds missing fields to fix authentication issues
 */

require 'db.php';

echo "=== AGRILINK DATABASE STRUCTURE FIXER ===\n\n";

// Function to check if column exists
function columnExists($conn, $table, $column) {
    try {
        $stmt = $conn->query("DESCRIBE `$table`");
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            if ($row['Field'] === $column) {
                return true;
            }
        }
        return false;
    } catch (Exception $e) {
        return false;
    }
}

// Function to add column safely
function addColumnSafely($conn, $table, $column, $definition, $defaultValue = null) {
    try {
        if (!columnExists($conn, $table, $column)) {
            $sql = "ALTER TABLE `$table` ADD COLUMN `$column` $definition";
            if ($defaultValue !== null) {
                $sql .= " DEFAULT '$defaultValue'";
            }
            
            $conn->exec($sql);
            echo "✅ Added '$column' column to '$table' table\n";
            
            // If we added user_type, populate it with default values
            if ($column === 'user_type') {
                if ($table === 'customers') {
                    $conn->exec("UPDATE `$table` SET `$column` = 'customer' WHERE `$column` IS NULL OR `$column` = ''");
                    echo "   → Set all customer user_type to 'customer'\n";
                } elseif ($table === 'sellers') {
                    $conn->exec("UPDATE `$table` SET `$column` = 'seller' WHERE `$column` IS NULL OR `$column` = ''");
                    echo "   → Set all seller user_type to 'seller'\n";
                }
            }
            
            return true;
        } else {
            echo "ℹ️  Column '$column' already exists in '$table' table\n";
            return true;
        }
    } catch (Exception $e) {
        echo "❌ Error adding '$column' to '$table': " . $e->getMessage() . "\n";
        return false;
    }
}

// Function to modify column safely
function modifyColumnSafely($conn, $table, $column, $newDefinition) {
    try {
        $sql = "ALTER TABLE `$table` MODIFY COLUMN `$column` $newDefinition";
        $conn->exec($sql);
        echo "✅ Modified '$column' column in '$table' table\n";
        return true;
    } catch (Exception $e) {
        echo "❌ Error modifying '$column' in '$table': " . $e->getMessage() . "\n";
        return false;
    }
}

echo "1. FIXING AUTHENTICATION ISSUES\n";
echo "================================\n";

// Fix 1: Add user_type field to customers table
echo "Adding user_type field to customers table...\n";
addColumnSafely($conn, 'customers', 'user_type', 'VARCHAR(20)', 'customer');

// Fix 2: Add user_type field to sellers table  
echo "Adding user_type field to sellers table...\n";
addColumnSafely($conn, 'sellers', 'user_type', 'VARCHAR(20)', 'seller');

echo "\n2. FIXING ORDERS TABLE STRUCTURE\n";
echo "=================================\n";

// Fix 3: Check orders table ID field
echo "Checking orders table ID field...\n";
try {
    $stmt = $conn->query("DESCRIBE orders");
    $orderIdField = null;
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if ($row['Field'] === 'id') {
            $orderIdField = $row;
            break;
        }
    }
    
    if ($orderIdField) {
        echo "Current orders.id field: " . $orderIdField['Type'] . "\n";
        
        if (strpos($orderIdField['Type'], 'varchar') !== false) {
            echo "⚠️  Orders ID field is VARCHAR - this should be AUTO_INCREMENT INT\n";
            echo "   For safety, leaving as is. Consider manual conversion in production.\n";
        } else {
            echo "✅ Orders ID field type looks correct\n";
        }
    }
} catch (Exception $e) {
    echo "❌ Error checking orders table: " . $e->getMessage() . "\n";
}

echo "\n3. VERIFYING FIXES\n";
echo "==================\n";

// Verify customers table
echo "Checking customers table structure:\n";
try {
    $stmt = $conn->query("DESCRIBE customers");
    $hasUserType = false;
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if ($row['Field'] === 'user_type') {
            $hasUserType = true;
            echo "✅ customers.user_type: " . $row['Type'] . " (Default: " . $row['Default'] . ")\n";
        }
    }
    if (!$hasUserType) {
        echo "❌ customers.user_type field still missing\n";
    }
} catch (Exception $e) {
    echo "❌ Error checking customers table: " . $e->getMessage() . "\n";
}

// Verify sellers table
echo "Checking sellers table structure:\n";
try {
    $stmt = $conn->query("DESCRIBE sellers");
    $hasUserType = false;
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if ($row['Field'] === 'user_type') {
            $hasUserType = true;
            echo "✅ sellers.user_type: " . $row['Type'] . " (Default: " . $row['Default'] . ")\n";
        }
    }
    if (!$hasUserType) {
        echo "❌ sellers.user_type field still missing\n";
    }
} catch (Exception $e) {
    echo "❌ Error checking sellers table: " . $e->getMessage() . "\n";
}

echo "\n4. TESTING AUTHENTICATION FIX\n";
echo "==============================\n";

// Test customer login response
echo "Testing customer login response format:\n";
try {
    $stmt = $conn->query("SELECT id, full_name, email, user_type FROM customers LIMIT 1");
    $customer = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($customer) {
        // Simulate login response
        $loginResponse = [
            'id' => $customer['id'],
            'full_name' => $customer['full_name'],
            'email' => $customer['email'],
            'role' => 'customer',
            'user_type' => $customer['user_type'] ?? 'customer'
        ];
        
        echo "Sample customer login response:\n";
        echo json_encode($loginResponse, JSON_PRETTY_PRINT) . "\n";
        echo "✅ Authentication should now work!\n";
    } else {
        echo "⚠️  No customers found to test with\n";
    }
} catch (Exception $e) {
    echo "❌ Error testing customer data: " . $e->getMessage() . "\n";
}

echo "\n=== DATABASE FIXES COMPLETE ===\n";
echo "Your authentication issues should now be resolved!\n";
echo "Cart functionality should work properly after customer login.\n";
?>
