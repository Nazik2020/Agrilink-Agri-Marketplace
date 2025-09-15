<?php

$name = "";
$email = "";
$phone = "";
$error = "";

// Form processing
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize inputs
    $name = ($_POST['name']);
    $email =($_POST['email']);
    $phone =($_POST['phone']);
    
    // Remove any characters that are not digits
    
    
    
    // Validation
    if (empty($name) || empty($email) || empty($phone)) {
        $error = "All fields are required.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Invalid email address.";
    } elseif (strlen($sanitizedPhone) < 10) {
        $error = "Phone number must contain at least 10 digits.";
    } else {
        // If everything is valid, assign sanitized phone
        $phone = $sanitizedPhone;
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>User Form</title>
</head>
<body>

<h2>User Information Form</h2>

<form method="post" action="">
    <label for="name">Name:</label>
    <input type="text" name="name" id="name" value="<?= htmlspecialchars($name) ?>"><br><br>

    <label for="email">Email:</label>
    <input type="text" name="email" id="email" value="<?= htmlspecialchars($email) ?>"><br><br>

    <label for="phone">Phone Number:</label>
    <input type="text" name="phone" id="phone" value="<?= htmlspecialchars($phone) ?>"><br><br>

    <button type="submit">Submit</button>
</form>

<br>

<?php if ($_SERVER["REQUEST_METHOD"] == "POST"): ?>
    <?php if ($error): ?>
        <p><?php $error ?></p>
    <?php else: ?>
        <h3>Submitted Information:</h3>
        <p><strong>Name:</strong> <?= htmlspecialchars($name) ?></p>
        <p><strong>Email:</strong> <?= htmlspecialchars($email) ?></p>
        <p><strong>Sanitized Phone:</strong> <?= htmlspecialchars($phone) ?></p>
    <?php endif; ?>
<?php endif; ?>

</body>
</html>



