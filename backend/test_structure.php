<?php
require 'db.php';

echo "Customers table structure:\n";
echo "=========================\n";

$stmt = $conn->query('DESCRIBE customers');
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach($results as $row) {
    echo $row['Field'] . ' - ' . $row['Type'] . "\n";
}

?>
