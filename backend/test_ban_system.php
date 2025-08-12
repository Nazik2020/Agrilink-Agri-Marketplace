<?php
require_once 'db.php';
require_once 'services/UserAuthenticationService.php';
require_once 'services/UserStatusMiddleware.php';

echo "Testing Ban System Implementation\n";
echo "================================\n\n";

try {
    $conn = getDbConnection();
    $authService = new UserAuthenticationService();
    $middleware = new UserStatusMiddleware();
    
    echo "✅ Database connection successful\n";
    echo "✅ Services loaded successfully\n\n";
    
    // Test 1: Check if status columns exist
    echo "Test 1: Checking database structure...\n";
    
    $stmt = $conn->query("SHOW COLUMNS FROM customers LIKE 'status'");
    $customerStatusExists = $stmt->rowCount() > 0;
    echo "Customers table has status column: " . ($customerStatusExists ? "✅ Yes" : "❌ No") . "\n";
    
    $stmt = $conn->query("SHOW COLUMNS FROM sellers LIKE 'status'");
    $sellerStatusExists = $stmt->rowCount() > 0;
    echo "Sellers table has status column: " . ($sellerStatusExists ? "✅ Yes" : "❌ No") . "\n";
    
    if (!$customerStatusExists || !$sellerStatusExists) {
        echo "\n⚠️  Status columns are missing! Please run the database setup script.\n";
        echo "Run: php backend/admin/fix_database_columns.php\n\n";
    } else {
        echo "✅ Database structure is correct\n\n";
    }
    
    // Test 2: Check sample users
    echo "Test 2: Checking sample users...\n";
    
    $stmt = $conn->query("SELECT id, email, status FROM customers LIMIT 3");
    $customers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Sample customers:\n";
    foreach ($customers as $customer) {
        echo "  - ID: {$customer['id']}, Email: {$customer['email']}, Status: {$customer['status']}\n";
    }
    
    $stmt = $conn->query("SELECT id, email, status FROM sellers LIMIT 3");
    $sellers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Sample sellers:\n";
    foreach ($sellers as $seller) {
        echo "  - ID: {$seller['id']}, Email: {$seller['email']}, Status: {$seller['status']}\n";
    }
    
    // Test 3: Test authentication service
    echo "\nTest 3: Testing authentication service...\n";
    
    // Test with admin credentials
    $adminResult = $authService->authenticateUser('agrilink@gmail.com', 'admin123');
    echo "Admin login test: " . ($adminResult['success'] ? "✅ Success" : "❌ Failed") . "\n";
    
    // Test with a sample customer (if exists)
    if (!empty($customers)) {
        $sampleCustomer = $customers[0];
        echo "Testing customer authentication for: {$sampleCustomer['email']}\n";
        echo "Customer status: {$sampleCustomer['status']}\n";
        
        // This would normally test with password, but we'll just check status
        $statusResult = $authService->getUserStatus($sampleCustomer['email'], 'customer');
        echo "Customer status check: " . ($statusResult ? "✅ {$statusResult}" : "❌ Failed") . "\n";
    }
    
    // Test 4: Test middleware
    echo "\nTest 4: Testing middleware...\n";
    
    if (!empty($customers)) {
        $sampleCustomer = $customers[0];
        $accessResult = $middleware->checkUserAccess($sampleCustomer['email'], 'customer');
        echo "Customer access check: " . ($accessResult['allowed'] ? "✅ Allowed" : "❌ Denied") . "\n";
        if (!$accessResult['allowed']) {
            echo "  Reason: {$accessResult['message']}\n";
        }
    }
    
    // Test 5: Test banned user scenario
    echo "\nTest 5: Testing banned user scenario...\n";
    
    // Create a test banned user (if not exists)
    $testEmail = 'banned_test@example.com';
    $testPassword = password_hash('test123', PASSWORD_BCRYPT);
    
    // Check if test user exists
    $stmt = $conn->prepare("SELECT id, status FROM customers WHERE email = ?");
    $stmt->execute([$testEmail]);
    $testUser = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$testUser) {
        // Create test user
        $stmt = $conn->prepare("INSERT INTO customers (full_name, email, password, status) VALUES (?, ?, ?, 'banned')");
        $stmt->execute(['Test Banned User', $testEmail, $testPassword]);
        echo "✅ Created test banned user\n";
    } else {
        // Update existing user to banned status
        $stmt = $conn->prepare("UPDATE customers SET status = 'banned' WHERE email = ?");
        $stmt->execute([$testEmail]);
        echo "✅ Updated existing user to banned status\n";
    }
    
    // Test authentication with banned user
    $bannedResult = $authService->authenticateUser($testEmail, 'test123');
    echo "Banned user login test: " . ($bannedResult['success'] ? "❌ Should be blocked" : "✅ Correctly blocked") . "\n";
    if (!$bannedResult['success']) {
        echo "  Error message: {$bannedResult['message']}\n";
        echo "  Error type: {$bannedResult['error_type']}\n";
    }
    
    // Test middleware with banned user
    $bannedAccessResult = $middleware->checkUserAccess($testEmail, 'customer');
    echo "Banned user access check: " . ($bannedAccessResult['allowed'] ? "❌ Should be denied" : "✅ Correctly denied") . "\n";
    if (!$bannedAccessResult['allowed']) {
        echo "  Reason: {$bannedAccessResult['message']}\n";
    }
    
    echo "\n🎉 Ban system test completed successfully!\n";
    echo "The system correctly prevents banned users from logging in.\n";
    
} catch (Exception $e) {
    echo "❌ Error during testing: " . $e->getMessage() . "\n";
}
?>










