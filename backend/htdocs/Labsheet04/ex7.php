<?php
session_start();

if (!isset($_SESSION['attendees'])) {
    $_SESSION['attendees'] = [];
}

$name = $email = $contact = "";
$errors = [];
$successMsg = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $contact = trim($_POST["contact"]);

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

    if (empty($errors)) {
        $attendee = [
            "name" => htmlspecialchars($name),
            "email" => htmlspecialchars($email),
            "contact" => htmlspecialchars($contact)
        ];

        $_SESSION['attendees'][] = $attendee;
        $successMsg = "Registration successful for {$attendee['name']}.";

        $name = $email = $contact = "";
    }
}
include("form.html");
?>
