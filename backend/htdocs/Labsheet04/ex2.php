
<!DOCTYPE html>
<html>
<head><title>Unsafe Form</title></head>
<body>
    <h2>Unsafe Form</h2>
    <form method="post">
        Enter your name: <input type="text" name="name">
        <input type="submit" value="Submit">
    </form>

    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        echo "<p>Your name is: " . $_POST["name"] . "</p>";
    }
    ?>
</body>
</html>
