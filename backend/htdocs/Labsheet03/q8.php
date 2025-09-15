<!DOCTYPE html>
<html>
<head>
    <title>Item Summary with Tax</title>
    <style>
        table { border-collapse: collapse; width: 60%; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>

<h2>Enter Item Details</h2>
<form method="POST" action="">
    <?php
    $numItems = 3; // Number of items user can input
    for ($i = 0; $i < $numItems; $i++) {
        echo "<fieldset>";
        echo "<legend>Item " . ($i + 1) . "</legend>";
        echo '<label>Name: <input type="text" name="items['.$i.'][name]"></label><br>';
        echo '<label>Price ($): <input type="text" name="items['.$i.'][price]"></label>';
        echo "</fieldset><br>";
    }
    ?>
    <input type="submit" value="Submit">
</form>

<?php
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['items'])) {
    $items = $_POST['items'];
    $validItems = [];
    $subtotal = 0.0;
    $TAX_RATE = 0.0825;

    foreach ($items as $item) {
        $name = isset($item['name']) ? trim($item['name']) : '';
        $price = isset($item['price']) ? trim($item['price']) : '';

        if ($name !== '' && is_numeric($price) && $price > 0) {
            $name = htmlspecialchars($name);
            $price = round((float)$price, 2);
            $total = round($price + ($price * $TAX_RATE), 2);
            $validItems[] = [
                'name' => $name,
                'price' => $price,
                'total' => $total
            ];
            $subtotal += $price;
        }
    }

    if (count($validItems) > 0) {
        $tax = round($subtotal * $TAX_RATE, 2);
        $grandTotal = round($subtotal + $tax, 2);

        echo "<h3>Summary</h3>";
        echo "<table>";
        echo "<tr><th>Item Name</th><th>Price ($)</th><th>Total with Tax ($)</th></tr>";

        foreach ($validItems as $item) {
            echo "<tr>";
            echo "<td>{$item['name']}</td>";
            echo "<td>\${$item['price']}</td>";
            echo "<td>\${$item['total']}</td>";
            echo "</tr>";
        }

        echo "<tr><td><strong>Subtotal</strong></td><td colspan='2'>\$$subtotal</td></tr>";
        echo "<tr><td><strong>Tax (8.25%)</strong></td><td colspan='2'>\$$tax</td></tr>";
        echo "<tr><td><strong>Total</strong></td><td colspan='2'>\$$grandTotal</td></tr>";
        echo "</table>";
    } else {
        echo "<p style='color:red;'>❌ Please enter at least one valid item with name and numeric price greater than 0.</p>";
    }
}
?>

</body>
</html>

