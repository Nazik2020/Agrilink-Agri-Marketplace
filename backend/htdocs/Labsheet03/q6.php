
<!DOCTYPE html>
<html>
<head>
    <title>Favorite Programming Languages</title>
</head>
<body>

<?php
// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get selected languages
    $selected = isset($_POST['languages']) ? $_POST['languages'] : [];

    // Validate the number of selections
    if (count($selected) == 3) {
        echo "<h3>Your favorite programming languages are:</h3><ul>";
        foreach ($selected as $lang) {
            echo "<li>" . htmlspecialchars($lang) . "</li>";
        }
        echo "</ul>";
    } else {
        echo "<p style='color:red;'>Please select exactly three programming languages.</p>";
    }
}
?>

<!-- The Form -->
<h2>Select Your Three Favorite Programming Languages</h2>
<form method="POST" action="">
    <label><input type="checkbox" name="languages[]" value="Python"> Python</label><br>
    <label><input type="checkbox" name="languages[]" value="JavaScript"> JavaScript</label><br>
    <label><input type="checkbox" name="languages[]" value="Java"> Java</label><br>
    <label><input type="checkbox" name="languages[]" value="C++"> C++</label><br>
    <label><input type="checkbox" name="languages[]" value="PHP"> PHP</label><br>
    <label><input type="checkbox" name="languages[]" value="Ruby"> Ruby</label><br>
    <label><input type="checkbox" name="languages[]" value="Go"> Go</label><br><br>

    <input type="submit" value="Submit">
</form>

</body>
</html>
