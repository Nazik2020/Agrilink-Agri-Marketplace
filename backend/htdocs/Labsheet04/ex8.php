<?php
session_start();

// Initialize the attendees array
if (!isset($_SESSION['attendees'])) {
    $_SESSION['attendees'] = [];
}

$name = $email = $contact = "";
$errors = [];
$successMsg = "";

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $contact = trim($_POST["contact"]);

    // Validation
    if (empty($name)) {
        $errors[] = "Name is required.";
    }

    if (empty($email)) {
        $errors[] = "Email is required.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Invalid email format.";
    }

    if (empty($contact)) {
        $errors[] = "Contact number is required.";
    }

    // If no errors, store the data
    if (empty($errors)) {
        $attendee = [
            "name" => htmlspecialchars($name),
            "email" => htmlspecialchars($email),
            "contact" => htmlspecialchars($contact)
        ];

        $_SESSION['attendees'][] = $attendee;

        $successMsg = "✅ Registration successful for <strong>{$attendee['name']}</strong>.";

        // Reset input fields
        $name = $email = $contact = "";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Event Registration</title>
    <style>
        body { font-family: Arial; margin: 40px; }
        .error { color: red; }
        .success { color: green; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #999; padding: 8px; }
    </style>
</head>
<body>

<h2>Event Registration Form</h2>

<!-- Display errors -->
<?php if (!empty($errors)): ?>
    <div class="error">
        <ul>
            <?php foreach ($errors as $e): ?>
                <li><?= $e ?></li>
            <?php endforeach; ?>
        </ul>
    </div>
<?php endif; ?>

<!-- Display success message -->
<?php if (!empty($successMsg)): ?>
    <p class="success"><?= $successMsg ?></p>
<?php endif; ?>

<!-- Registration Form -->
<form method="POST" action="">
    <label>Name:</label><br>
    <input type="text" name="name" value="<?= htmlspecialchars($name) ?>"><br><br>

    <label>Email:</label><br>
    <input type="text" name="email" value="<?= htmlspecialchars($email) ?>"><br><br>

    <label>Contact Number:</label><br>
    <input type="text" name="contact" value="<?= htmlspecialchars($contact) ?>"><br><br>

    <button type="submit">Register</button>
</form>

<!-- Attendee List -->
<?php if (!empty($_SESSION['attendees'])): ?>
    <h3>Registered Attendees</h3>
    <table>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact</th>
        </tr>
        <?php foreach ($_SESSION['attendees'] as $a): ?>
            <tr>
                <td><?= htmlspecialchars($a['name']) ?></td>
                <td><?= htmlspecialchars($a['email']) ?></td>
                <td><?= htmlspecialchars($a['contact']) ?></td>
            </tr>
        <?php endforeach; ?>
    </table>
<?php endif; ?>

</body>
</html>
