<?php
/**
 * Create Sample Order Data for Testing
 * This will create test orders for customer ID 1
 */

require_once __DIR__ . '/db.php';

try {
    $connection = getConnection();
    
    echo "🔧 Creating sample order data...\n\n";
    
    // Check if orders table exists
    $checkTable = $connection->query("SHOW TABLES LIKE 'orders'");
    if ($checkTable->rowCount() == 0) {
        echo "❌ Orders table doesn't exist. Creating it...\n";
        
        $createTable = "
        CREATE TABLE orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            customer_id INT NOT NULL,
            product_id INT NOT NULL,
            order_id VARCHAR(50) NOT NULL,
            product_name VARCHAR(255) NOT NULL,
            quantity INT NOT NULL DEFAULT 1,
            price DECIMAL(10,2) NOT NULL,
            total_amount DECIMAL(10,2) NOT NULL,
            order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
            INDEX(customer_id),
            INDEX(order_id)
        )";
        
        $connection->exec($createTable);
        echo "✅ Orders table created\n\n";
    }
    
    // Insert sample orders for customer ID 1
    $sampleOrders = [
        [
            'customer_id' => 1,
            'product_id' => 101,
            'order_id' => 'ORD-001',
            'product_name' => 'Organic Tomatoes',
            'quantity' => 2,
            'price' => 12.50,
            'total_amount' => 25.00,
            'order_date' => '2024-01-15 10:30:00',
            'status' => 'delivered'
        ],
        [
            'customer_id' => 1,
            'product_id' => 102,
            'order_id' => 'ORD-001',
            'product_name' => 'Fresh Spinach',
            'quantity' => 1,
            'price' => 8.75,
            'total_amount' => 8.75,
            'order_date' => '2024-01-15 10:30:00',
            'status' => 'delivered'
        ],
        [
            'customer_id' => 1,
            'product_id' => 103,
            'order_id' => 'ORD-002',
            'product_name' => 'Premium Carrots',
            'quantity' => 3,
            'price' => 6.50,
            'total_amount' => 19.50,
            'order_date' => '2024-01-12 14:20:00',
            'status' => 'shipped'
        ],
        [
            'customer_id' => 1,
            'product_id' => 104,
            'order_id' => 'ORD-003',
            'product_name' => 'Organic Lettuce',
            'quantity' => 2,
            'price' => 4.25,
            'total_amount' => 8.50,
            'order_date' => '2024-01-10 16:45:00',
            'status' => 'processing'
        ]
    ];
    
    // Clear existing test data
    $stmt = $connection->prepare("DELETE FROM orders WHERE customer_id = 1");
    $stmt->execute();
    echo "🧹 Cleared existing test data\n";
    
    // Insert sample data
    $insertSQL = "INSERT INTO orders (customer_id, product_id, order_id, product_name, quantity, price, total_amount, order_date, status) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $connection->prepare($insertSQL);
    
    foreach ($sampleOrders as $order) {
        $stmt->execute([
            $order['customer_id'],
            $order['product_id'],
            $order['order_id'],
            $order['product_name'],
            $order['quantity'],
            $order['price'],
            $order['total_amount'],
            $order['order_date'],
            $order['status']
        ]);
        echo "✅ Added: {$order['product_name']} (Order: {$order['order_id']})\n";
    }
    
    echo "\n🎉 Sample data created successfully!\n";
    echo "📊 Total orders for customer 1: " . count($sampleOrders) . "\n";
    
    // Test the data
    $testQuery = $connection->prepare("SELECT * FROM orders WHERE customer_id = 1 ORDER BY order_date DESC");
    $testQuery->execute();
    $orders = $testQuery->fetchAll(PDO::FETCH_ASSOC);
    
    echo "\n🔍 Verification - Orders in database:\n";
    foreach ($orders as $order) {
        echo "  • {$order['product_name']} - {$order['order_id']} - {$order['status']} - ${$order['total_amount']}\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "📍 File: " . $e->getFile() . " Line: " . $e->getLine() . "\n";
}
?>
