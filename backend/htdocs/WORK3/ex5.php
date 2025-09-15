<?php
$errors = [];
$validNumbers = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve and validate each number
    for ($i = 1; $i <= 5; $i++) {
        $key = "number$i";
        $value = isset($_POST[$key]) ? trim($_POST[$key]) : '';

        if (!is_numeric($value) || $value < 1 || $value > 100) {
            $errors[] = "Number $i must be a valid number between 1 and 100.";
        } else {
            $validNumbers[] = (int)$value;
        }
    }

    // If there are errors, display them
    if (!empty($errors)) {
        echo "<h3>Errors:</h3><ul>";
        foreach ($errors as $error) {
            echo "<li>" . htmlspecialchars($error) . "</li>";
        }
        echo "</ul>";
        echo "<a href='favorite_numbers.php'>Try Again</a>";
        exit;
    }

    // Display up to 3 numbers, skipping those divisible by 3
    echo "<h3>Your Valid Favorite Numbers (Skipping those divisible by 3):</h3><ul>";
    $printed = 0;
    foreach ($validNumbers as $num) {
        if ($num % 3 == 0) continue;

        echo "<li>$num</li>";
        $printed++;
        if ($printed == 3) break;
    }

    // If none printed
    if ($printed === 0) {
        echo "<li>No numbers displayed (all divisible by 3).</li>";
    }

    echo "</ul>";
    echo "<a href='favorite_numbers.php'>Submit Again</a>";
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Favorite Numbers</title>
</head>
<body>
    <h2>Enter Your Five Favorite Numbers (Between 1 and 100)</h2>
    <form method="post" action="">
        <?php for ($i = 1; $i <= 5; $i++): ?>
            <label>Number <?= $i ?>:</label>
            <input type="text" name="number<?= $i ?>" required><br><br>
        <?php endfor; ?>
        <input type="submit" value="Submit">
    </form>
</body>
</html>
