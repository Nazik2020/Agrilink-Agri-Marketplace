<?php

$phone = "";
$error = "";

// Form processing
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $phone = $_POST['phone'];

    // Sanitize phone number (remove all except digits, + and -)
    $sanitizedPhone = filter_var($phone, FILTER_SANITIZE_NUMBER_INT);

    // Remove +, - symbols to count digits
    $digitsOnly = preg_replace("/[^0-9]/", "", $sanitizedPhone);

    // Validate: check if it's exactly 10 digits (adjust as needed for your country)
    if (strlen($digitsOnly) != 10) {
        $error = "Invalid phone number. It must be exactly 10 digits.";
    } else {
        $phone = $digitsOnly;
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Phone Number Validation</title>
</head>
<body>

<h2>Phone Number Form</h2>

<form method="post" action="">
    <label for="phone">Phone Number:</label>
    <input type="text" name="phone" id="phone" value="<?= htmlspecialchars($phone) ?>"><br><br>

    <button type="submit">Submit</button>
</form>

<br>

<?php if ($_SERVER["REQUEST_METHOD"] == "POST"): ?>
    <?php if ($error): ?>
        <p><?= $error ?></p>
    <?php else: ?>
        <p><strong>Valid Phone Number:</strong> <?= htmlspecialchars($phone) ?></p>
    <?php endif; ?>
<?php endif; ?>

