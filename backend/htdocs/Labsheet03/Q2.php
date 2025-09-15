<?php
$age = null;
$error = "";

if (isset($_POST['dob'])) {
    $dob = $_POST['dob'];

    if (!empty($dob)) {
        $dobDate = new DateTime($dob);
        $today = new DateTime();
        $age = $today->diff($dobDate)->y;
    } else {
        $error = "Please select your date of birth.";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Age Calculator</title>
</head>
<body>

    <h2>Enter Your Date of Birth</h2>

    <form method="post" action="">
        <label for="dob">Date of Birth:</label>
        <input type="date" name="dob" id="dob">
        <button type="submit">Submit</button>
    </form>

    <br>

    <?php if ($age !== null): ?>
        <p>Your age is: <strong><?= $age ?></strong> years.</p>
    <?php elseif ($error): ?>
        <p style="color:red;"><?= $error ?></p>
    <?php endif; ?>

</body>
</html>
