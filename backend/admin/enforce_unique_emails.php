<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: text/plain');

try {
    echo "Ensuring unique email across sellers and customers...\n";

    // Create unique indexes on individual tables if not present
    $conn->exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_sellers_email ON sellers(email)");
    $conn->exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_email ON customers(email)");

    echo "Per-table unique indexes ensured.\n";
    echo "Note: Cross-table uniqueness cannot be enforced with a single index in MySQL.\n";
    echo "Application-level checks were added in SignupCustomer.php and SignupSeller.php.\n";
    echo "If duplicates already exist, resolve them before adding the index.\n";
} catch (PDOException $e) {
    http_response_code(500);
    echo "Error: " . $e->getMessage();
}

?>
