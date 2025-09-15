<!DOCTYPE html>
<html>
<head><title>Safe Form</title></head>
<body>
    <h2>Safe Form</h2>
    <form method="post">
        Enter your name: <input type="text" name="name">
        <input type="submit" value="Submit">
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $safe_name = htmlspecialchars($_POST["name"]);
        echo "<p>Your name is: " . $safe_name . "</p>";
    }
    ?>
</body>
</html>
