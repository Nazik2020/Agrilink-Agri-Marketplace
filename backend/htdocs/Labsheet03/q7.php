
<!DOCTYPE html>
<html>
<head>
    <title>BMI Calculator</title>
</head>
<body>

<?php
$weight = $height = "";
$weightErr = $heightErr = "";
$bmi = null;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Validate weight
    if (isset($_POST["weight"]) && is_numeric($_POST["weight"]) && $_POST["weight"] > 0) {
        $weight = (float) $_POST["weight"];
    } else {
        $weightErr = " Please enter a valid weight greater than 0.";
    }

    // Validate height
    if (isset($_POST["height"]) && is_numeric($_POST["height"]) && $_POST["height"] > 0) {
        $height = (float) $_POST["height"];
    } else {
        $heightErr = " Please enter a valid height greater than 0.";
    }

    // If no errors, calculate BMI
    if ($weightErr === "" && $heightErr === "") {
        $bmi = $weight / ($height * $height);
        $bmi = round($bmi, 2);
    }
}
?>

<h2>BMI Calculator</h2>
<form method="POST" action="">
    <label for="weight">Weight (kg):</label>
    <input type="text" name="weight" id="weight" value="<?php echo htmlspecialchars($weight); ?>">
    <span style="color:red;"><?php echo $weightErr; ?></span><br><br>

    <label for="height">Height (m):</label>
    <input type="text" name="height" id="height" value="<?php echo htmlspecialchars($height); ?>">
    <span style="color:red;"><?php echo $heightErr; ?></span><br><br>

    <input type="submit" value="Calculate BMI">
</form>

<?php
if (!is_null($bmi)) {
    echo "<h3>✅ Your BMI is <strong>$bmi</strong></h3>";
}
?>

</body>
</html>

 
