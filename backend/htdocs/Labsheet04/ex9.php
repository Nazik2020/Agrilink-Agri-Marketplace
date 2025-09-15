<?php
session_start();

// Initialize the attendees array
//create the array for attendees and check if the all the atendees in store in sesssion 
if (!isset($_SESSION['attendees'])) {
    //
    $_SESSION['attendees'] = [];
}
// define varibles set the values 
$name = $email = $contact = "";
$errors = [];
$successMsg = "";

//check if the whether form i s ubmit or not 
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    //store the details whijch already submitted in the form 
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $contact = trim($_POST["contact"]);

    // Validation name,email,phone_no
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

  //if it iis not error s store the data in array
    if (empty($errors)) {
        $attendee = [
            "name" => htmlspecialchars($name),
            "email" => htmlspecialchars($email),
            "contact" => htmlspecialchars($contact)
        ];
 
        // if the new atendee to the array  
        $_SESSION['attendees'][] = $attendee;
        
//if no error show this succes message
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
