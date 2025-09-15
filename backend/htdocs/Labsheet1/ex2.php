<?php


// Initialize the attendees array in the session if not set
if (!isset($_SESSION['attendees'])) {
    $_SESSION['attendees'] = [];
}

// Variables for error and success messages
$name = $email = $contact = "";
$errors = [];
$success = "";

// Form submission
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Sanitize inputs
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $contact = htmlspecialchars(trim($_POST['contact']));

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

    // If no errors, store data
    if (empty($errors)) {
        $attendee = [
            "name" => $name,
            "email" => $email,
            "contact" => $contact
        ];

        $_SESSION['attendees'][] = $attendee;
        $success = "Registration successful!";
        // Reset input fields
        $name = $email = $contact = "";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Conference Registration</title>
    <style>
        body { font-family: Arial; padding: 20px; background-color: #f2f2f2; }
        .form-container, .list-container { background: #fff; padding: 20px; margin-bottom: 20px; border-radius: 8px; }
        input[type="text"], input[type="email"] {
            width: 100%; padding: 10px; margin: 8px 0; border-radius: 5px; border: 1px solid #ccc;
        }
        input[type="submit"] {
            padding: 10px 20px; background-color: #28a745; border: none;
            color: white; border-radius: 5px; cursor: pointer;
        }
        .error { color: red; }
        .success { color: green; font-weight: bold; }
    </style>
</head>
<body>

<div class="form-container">
    <h2>Event Registration Form</h2>

    <?php if (!empty($errors)): ?>
        <div class="error">
            <ul>
                <?php foreach ($errors as $e): ?>
                    <li><?= $e ?></li>
                <?php endforeach; ?>
            </ul>
        </div>
    <?php endif; ?>

    <?php if ($success): ?>
        <p class="success"><?= $success ?></p>
    <?php endif; ?>

    <form method="POST" action="">
        <label>Name:</label>
        <input type="text" name="name" value="<?= $name ?>">

        <label>Email:</label>
        <input type="email" name="email" value="<?= $email ?>">

        <label>Contact Number:</label>
        <input type="text" name="contact" value="<?= $contact ?>">

        <input type="submit" value="Register">
    </form>
</div>

<div class="list-container">
    <h2>Registered Attendees</h2>
    <?php if (!empty($_SESSION['attendees'])): ?>
        <ul>
            <?php foreach ($_SESSION['attendees'] as $a): ?>
                <li>
                    <strong><?= htmlspecialchars($a['name']) ?></strong><br>
                    Email: <?= htmlspecialchars($a['email']) ?><br>
                    Contact: <?= htmlspecialchars($a['contact']) ?>
                </li>
                <hr>
            <?php endforeach; ?>
        </ul>
    <?php else: ?>
        <p>No attendees registered yet.</p>
    <?php endif; ?>
</div>

</body>
</html>
