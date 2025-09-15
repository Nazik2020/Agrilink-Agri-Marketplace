<?php
session_start();

// Initialize the attendees array if not already set
if (!isset($_SESSION['attendees'])) {
    $_SESSION['attendees'] = [];
}

// Define variables and error messages
$name = $email = $contact = "";
$errors = [];
$successMsg = "";

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Trim and sanitize input
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

    // If no errors, save attendee
    if (empty($errors)) {
        $attendee = [
            "name" => htmlspecialchars($name),
            "email" => htmlspecialchars($email),
            "contact" => htmlspecialchars($contact)
        ];

        $_SESSION['attendees'][] = $attendee;

        $successMsg = "✅ Registration successful for <strong>{$attendee['name']}</strong>!";
        
        // Reset form fields
        $name = $email = $contact = "";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Event Registration</title>
    
</head>
<body>

<h2>Conference Registration Form</h2>

<div class="form-container">
    <?php
    if (!empty($errors)) {
        echo "<div class='error'><ul>";
        foreach ($errors as $e) {
            echo "<li>$e</li>";
        }
        echo "</ul></div>";
    }

    if (!empty($successMsg)) {
        echo "<p class='success'>$successMsg</p>";
    }
    ?>

    <form method="POST" action="">
        <label>Name:</label><br>
        <input type="text" name="name" value="<?= htmlspecialchars($name) ?>"><br><br>

        <label>Email:</label><br>
        <input type="email" name="email" value="<?= htmlspecialchars($email) ?>"><br><br>

        <label>Contact Number:</label><br>
        <input type="text" name="contact" value="<?= htmlspecialchars($contact) ?>"><br><br>

        <button type="submit">Register</button>
    </form>
</div>

<?php if (!empty($_SESSION['attendees'])): ?>
    <div class="attendees-container">
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
    </div>
<?php endif; ?>

</body>
</html>


