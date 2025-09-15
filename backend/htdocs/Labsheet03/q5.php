<?php
// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $errors = [];
    $validNumbers = [];

    // Validate each of the five inputs
    for ($i = 0; $i < 5; $i++) {
        $key = "num$i";
        if (!isset($_POST[$key]) || !is_numeric($_POST[$key])) {
            $errors[] = "Input #".($i+1)." must be a number.";
        } else {
            $num = (int)$_POST[$key];
            if ($num < 1 || $num > 100) {
                $errors[] = "Number #".($i+1)." must be between 1 and 100.";
            } else {
                $validNumbers[] = $num;
            }
        }
    }

    // Display errors or process the valid numbers
    if (!empty($errors)) {
        echo "<ul style='color: red;'>";
        foreach ($errors as $error) {
            echo "<li>$error</li>";
        }
        echo "</ul>";
    } else {
        echo "<h3>Your Valid Numbers:</h3><ul>";
        $count = 0;
        foreach ($validNumbers as $n) {
            if ($n % 3 != 0) {
                echo "<li>$n</li>";
                $count++;
            }
            if ($count >= 3) break;
        }
        echo "</ul>";
    }
}
?>

<!-- Form HTML -->
<form method="post">
    <h3>Enter Your 5 Favorite Numbers (1-100):</h3>
    <?php for ($i = 0; $i < 5; $i++): ?>
        <label for="num<?= $i ?>">Number <?= $i + 1 ?>:</label>
        <input type="text" name="num<?= $i ?>" id="num<?= $i ?>"><br>
    <?php endfor; ?>
    <input type="submit" value="Submit">
</form>
