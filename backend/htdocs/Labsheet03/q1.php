
<?php
// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['submit'])) {
    $selectedColor = isset($_GET['color']) ? trim($_GET['color']) : '';

    if ($selectedColor !== '') {
        echo "<p style='color:$selectedColor;'>You selected: <strong>$selectedColor</strong></p>";
    } else {
        echo "<p style='color:red;'>Please select a color from the dropdown list.</p>";
    }
}

?>
<!DOCTYPE html>
<html>

<body>

<!-- Form using GET method -->
<h2>Select Your Favorite Color</h2>
<form method="GET" action="">
    <label for="color">Choose a color:</label>
    <select name="color" id="color">
        <option value="">--Select--</option>
        <option value="red">Red</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
        <option value="yellow">Yellow</option>
        <option value="purple">Purple</option>
    </select>
    <br><br>
    <input type="submit" name="submit" value="Submit">
</form>

</body>
</html>

