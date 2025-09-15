
<?php
session_start();

// Initialize session array if not already set
if (!isset($_SESSION['attendee'])) {
    $_SESSION['attendee'] = [];
}

// Initialize variables
$name = $email = $contact = "";
$errors = [];
$successMsg = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get and clean input values
    $name = htmlspecialchars(trim($_POST['name'] ?? ''));
    $email = htmlspecialchars(trim($_POST['email'] ?? ''));
    $contact = htmlspecialchars(trim($_POST['contact'] ?? ''));

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

    // If no errors, save the attendee
    if (empty($errors)) {
        $attendee = [
            'name' => $name,
            'email' => $email,
            'contact' => $contact,
        ];
        $_SESSION['attendee'][] = $attendee;
        $successMsg = "Registration successful. Thank you, $name!";
        
        // Clear form values
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

<h2>Event Registration Form</h2>

<?php
// this is not the store the data
if (!empty($errors)) {
    foreach ($errors as $error) {
        echo $error . "<br>";
    }
}


if (!empty($successMsg)) {
    echo $successMsg . "<br>";
}
?>

<form method="post" action="">
    <label>Name:</label><br>
    <input type="text" name="name" value="<?php echo $name; ?>"><br><br>

    <label>Email:</label><br>
    <input type="text" name="email" value="<?php echo $email; ?>"><br><br>

    <label>Contact Number:</label><br>
    <input type="text" name="contact" value="<?php echo $contact; ?>"><br><br>

    <input type="submit" value="Register">
</form>

<h3>Registered Attendees</h3>

<?php
if (!empty($_SESSION['attendee'])) {
    echo "<table border='1' cellpadding='5'>";
    echo "<tr><th>Name</th><th>Email</th><th>Contact</th></tr>";
    foreach ($_SESSION['attendee'] as $attendee) {
        echo "<tr>";
        echo "<td>" . htmlspecialchars($attendee['name']) . "</td>";
        echo "<td>" . htmlspecialchars($attendee['email']) . "</td>";
        echo "<td>" . htmlspecialchars($attendee['contact']) . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "No attendees registered yet.";
}
?>

</body>
</html>
