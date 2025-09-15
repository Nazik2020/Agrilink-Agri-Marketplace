<!DOCTYPE html>
<html>
<head>
    <title>Event Registration</title>
</head>
<body>
    <h1>Conference Registration Form</h1>

    <?php
    // Initialize attendees array if not already set
    session_start();
    if (!isset($_SESSION['attendees'])) {
        $_SESSION['attendees'] = [];
    }

    $name = $email = $contact = "";
    $errors = [];

    // Form submitted
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $name = trim($_POST["name"]);
        $email = trim($_POST["email"]);
        $contact = trim($_POST["contact"]);

        // Validation
        if (empty($name)) {
            $errors[] = "Name is required.";
        }
        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors[] = "Valid email is required.";
        }
        if (empty($contact)) {
            $errors[] = "Contact number is required.";
        }

        // If no errors, save the attendee
        if (empty($errors)) {
            $attendee = [
                "name" => htmlspecialchars($name),
                "email" => htmlspecialchars($email),
                "contact" => htmlspecialchars($contact)
            ];

            $_SESSION['attendees'][] = $attendee;

            echo "<p style='color: green;'>Thank you for registering, <strong>" . $attendee['name'] . "</strong>!</p>";
        }
    }
    ?>

    <!-- Display validation errors -->
    <?php
    if (!empty($errors)) {
        echo "<ul style='color: red;'>";
        foreach ($errors as $error) {
            echo "<li>$error</li>";
        }
        echo "</ul>";
    }
    ?>

    <!-- Registration Form -->
    <form method="post" action="">
        <label>Name: <input type="text" name="name" value="<?= htmlspecialchars($name) ?>"></label><br><br>
        <label>Email: <input type="email" name="email" value="<?= htmlspecialchars($email) ?>"></label><br><br>
        <label>Contact Number: <input type="text" name="contact" value="<?= htmlspecialchars($contact) ?>"></label><br><br>
        <input type="submit" value="Register">
    </form>

    <!-- Display Registered Attendees -->
    <?php if (!empty($_SESSION['attendees'])): ?>
        <h2>Registered Attendees</h2>
        <table border="1" cellpadding="8">
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
            </tr>
            <?php foreach ($_SESSION['attendees'] as $person): ?>
                <tr>
                    <td><?= $person['name'] ?></td>
                    <td><?= $person['email'] ?></td>
                    <td><?= $person['contact'] ?></td>
                </tr>
            <?php endforeach; ?>
        </table>
    <?php endif; ?>
</body>
</html>
