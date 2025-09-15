<?php
$phone = "";
$message = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $phone = trim($_POST['phone']);

    // Remove any unwanted characters like spaces, dashes, parentheses
    $cleanedPhone = preg_replace('/[^0-9]/', '', $phone);//all digits from 0 to 9

    // Check if it's a valid 10-digit number
    if (preg_match('/^\d{10}$/', $cleanedPhone)) { //can be eincluded only 10 digits
        $message = " Valid phone number: " . htmlspecialchars($cleanedPhone);//sanitize the phone-number 
    } else {
        $message = " Invalid phone number. Please enter a 10-digit number.";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Phone Number Validation</title>
</head>
<body>
    <h2>Enter Your Phone Number</h2>
    <form method="post" action="">
        <label for="phone">Phone Number:</label>
        <input type="text" name="phone" value="<?= htmlspecialchars($phone) ?>" required>
        <button type="submit">Submit</button>
    </form>

    <?php if (!empty($message)): ?>
        <p><?= $message ?></p>
    <?php endif; ?>
</body>
</html>
