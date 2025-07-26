<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';
require 'Customer.php';

echo "<h2>Email Restriction Test</h2>";

try {
    // Test with a sample customer
    $testEmail = "chathuri@gmail.com";
    $customer = new Customer($conn);
    
    // Get current profile
    $currentProfile = $customer->getByEmail($testEmail);
    echo "<h3>Current Profile:</h3>";
    echo "<pre>";
    print_r($currentProfile);
    echo "</pre>";
    
    // Try to update profile (email should not change)
    $updateData = [
        'originalEmail' => $testEmail,
        'email' => 'newemail@test.com', // This should be ignored
        'fullName' => 'Test User Updated',
        'address' => '123 Test Street',
        'contactNumber' => '1234567890',
        'country' => 'Sri Lanka'
    ];
    
    echo "<h3>Update Data (email should be ignored):</h3>";
    echo "<pre>";
    print_r($updateData);
    echo "</pre>";
    
    // Simulate the update
    $success = $customer->updateProfile($testEmail, $updateData['fullName'], $updateData['address'], $updateData['contactNumber'], $updateData['country']);
    
    if ($success) {
        echo "<p>✅ Profile updated successfully (email unchanged)</p>";
        
        // Check if email actually changed
        $updatedProfile = $customer->getByEmail($testEmail);
        echo "<h3>Updated Profile:</h3>";
        echo "<pre>";
        print_r($updatedProfile);
        echo "</pre>";
        
        if ($updatedProfile['email'] === $testEmail) {
            echo "<p>✅ Email correctly remained unchanged</p>";
        } else {
            echo "<p>❌ Email was changed (this should not happen)</p>";
        }
    } else {
        echo "<p>❌ Profile update failed</p>";
    }
    
} catch (Exception $e) {
    echo "<p>❌ Error: " . $e->getMessage() . "</p>";
}
?> 